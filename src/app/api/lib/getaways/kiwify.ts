import type { ParseResult } from '.';

import { z } from 'zod';

import { formatPhoneNumber } from '@/utils/format';

import type { Event } from '@/types/Getaway';

const schema = z.object({
  order_status: z.enum([
    'paid',
    'waiting_payment',
    'refused',
    'refunded',
    'chargedback',
  ]),
  pix_code: z.string().nullable(),
  boleto_URL: z.string().nullable(),
  Customer: z.object({
    full_name: z.string(),
    email: z.string(),
    mobile: z.string(),
    CPF: z.string().nullable(),
    ip: z.string().nullable(),
  }),
  Commissions: z.object({
    charge_amount: z.string(),
  }),
});

type KiwifyBody = z.infer<typeof schema>;

export function kiwify(
  body: unknown
): ParseResult & { body: KiwifyBody | null } {
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return {
      success: false,
      backlog: validation.error.errors.join(', '),
      body: null,
    };
  }

  const { data } = validation;

  if (data.order_status === 'paid') {
    return {
      success: true,
      type: 'sale',
      event: 'compra aprovada',
      revenue: Number(data.Commissions.charge_amount) / 100,
      lead: {
        name: data.Customer.full_name,
        email: data.Customer.email,
        phone: formatPhoneNumber(data.Customer.mobile),
        cpf: data.Customer.CPF || undefined,
        boleto: data.boleto_URL || undefined,
        pix: data.pix_code || undefined,
      },
      body: data,
    };
  }

  const events: Record<KiwifyBody['order_status'], Event> = {
    paid: 'compra aprovada',
    waiting_payment: 'carrinho abandonado',
    refused: 'reembolsado',
    refunded: 'reembolsado',
    chargedback: 'chargeback',
  };

  return {
    success: true,
    type: 'lead',
    event: events[data.order_status],
    lead: {
      name: data.Customer.full_name,
      email: data.Customer.email,
      phone: formatPhoneNumber(data.Customer.mobile),
      cpf: data.Customer.CPF || undefined,
      boleto: data.boleto_URL || undefined,
      pix: data.pix_code || undefined,
    },
    body: data,
  };
}
