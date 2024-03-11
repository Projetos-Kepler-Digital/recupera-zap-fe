import { formatPhoneNumber } from '@/utils/format';

import type { ParseResult } from '.';

import type { Event } from '@/types/Getaway';

import { z } from 'zod';

export enum TransactionStatus {
  OPENNED = 1, // Fatura aberta, cliente gerou boleto, mas ainda não foi compensado
  PAID = 3, // Compra foi paga, o cliente já esta apto a receber o produto
  CANCELED = 4, // Fatura Cancelada pela Eduzz
  WAITING_REFUND = 6, // Cliente solicitou reembolso, porem o mesmo ainda não foi efetuado
  REFUNDED = 7, // Cliente já foi reembolsado pela eduzz
  DUPLICATED = 9, // Cliente tentou comprar mais de uma vez o mesmo produto, a segunda fatura fica como duplicada e não é cobrada.
  EXPIRED = 10, // A fatura que fica mais de 15 dias aberta é alterada para expirada.
  IN_RECOVER = 11, // Fatura entrou para o processo de recuperação
  WAITING_PAYMENT = 15, // Faturas de recorrência após o vencimento ficam com o status aguardando pagamento
}

export enum RecurrenceStatus {
  UP_TO_DATE = 1, // Contrato com pagamento em dia.
  WAITING_PAYMENT = 2, // Esse status é acionado após o vencimento da fatura. Permanece por 3 dias.
  SUSPENDED = 3, // O contrato não gera novas cobranças. Pode ser reativado.
  CANCELED = 4, // O contrato do cliente foi cancelado.
  LATE = 7, // Contrato sem pagamento há mais de 3 dias após o vencimento.
  FINISHED = 9, // Todos os pagamentos foram realizados. Não gera novas cobranças.
  TRIAL = 10, // Contrato em período de trial.
}

const schema = z.object({
  cus_email: z.string(),
  cus_name: z.string(),
  cus_tel: z.string(),
  trans_status: z.number(),
  trans_value: z.number(),
  page_checkout_url: z.string(),
});

type EduzzBody = z.infer<typeof schema>;

export function eduzz(body: unknown): ParseResult & { body: EduzzBody | null } {
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return {
      success: false,
      backlog: validation.error.errors.join(', '),
      body: null,
    };
  }

  const { data } = validation;

  const events: Record<Event, TransactionStatus[]> = {
    'compra aprovada': [TransactionStatus.PAID],
    'carrinho abandonado': [TransactionStatus.EXPIRED],
    chargeback: [],
    reembolsado: [TransactionStatus.REFUNDED],
  };

  const query = Object.entries(events).find(([_, status]) =>
    status.includes(data.trans_status)
  );

  if (!query) {
    return {
      success: false,
      backlog: "Event's not been registered yet",
      body: null,
    };
  }

  const event: Event = query[0] as Event;

  if (data.trans_status === TransactionStatus.PAID) {
    return {
      success: true,
      type: 'sale',
      event: 'compra aprovada',
      revenue: data.trans_value,
      lead: {
        name: data.cus_name,
        email: data.cus_email,
        phone: formatPhoneNumber(data.cus_tel),
        checkout: data.page_checkout_url,
      },
      body: data,
    };
  }

  return {
    success: true,
    type: 'lead',
    event,
    lead: {
      name: data.cus_name,
      email: data.cus_email,
      phone: formatPhoneNumber(data.cus_tel),
      checkout: data.page_checkout_url,
    },
    body: data,
  };
}
