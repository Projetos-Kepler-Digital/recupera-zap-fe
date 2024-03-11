import type { ParseResult } from '.';

import { z } from 'zod';

import { formatPhoneNumber } from '@/utils/format';

import type { Event } from '@/types/Getaway';

enum SaleStatus {
  none,
  pending,
  approved,
  in_process,
  in_mediation,
  rejected,
  cancelled,
  refunded,
  authorized,
  charged_back,
  completed,
  checkout_error,
  precheckout,
  expired,
  in_review,
}

const schema = z.object({
  sale_amount: z.number(),
  sale_status_enum: z.number(),
  customer: z.object({
    full_name: z.string().nullable(),
    email: z.string().nullable(),
    identification_number: z.string().nullable(),
    phone_formated: z.string(),
  }),
  billet_url: z.string(),
});

type PerfectpayBody = z.infer<typeof schema>;

export function perfectpay(
  body: unknown
): ParseResult & { body: PerfectpayBody | null } {
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return {
      success: false,
      backlog: validation.error.errors.join(', '),
      body: null,
    };
  }

  const { data } = validation;

  const phone = formatPhoneNumber(data.customer.phone_formated);

  const events: Record<Event, SaleStatus[]> = {
    'compra aprovada': [SaleStatus.approved],
    'carrinho abandonado': [SaleStatus.checkout_error, SaleStatus.precheckout],
    chargeback: [SaleStatus.charged_back],
    reembolsado: [SaleStatus.cancelled, SaleStatus.refunded],
  };

  const query = Object.entries(events).find(([_, status]) =>
    status.includes(data.sale_status_enum)
  );

  if (!query) {
    return {
      success: false,
      backlog: "Event's not been registered yet",
      body: null,
    };
  }

  const event: Event = query[0] as Event;

  if (data.sale_status_enum === SaleStatus.approved) {
    return {
      success: true,
      type: 'sale',
      event: 'compra aprovada',
      revenue: data.sale_amount,
      lead: {
        name: data.customer.full_name || undefined,
        email: data.customer.email || undefined,
        cpf: data.customer.identification_number || undefined,
        boleto: data.billet_url,
        phone,
      },
      body: data,
    };
  }

  return {
    success: true,
    type: 'lead',
    event,
    lead: {
      name: data.customer.full_name || undefined,
      email: data.customer.email || undefined,
      cpf: data.customer.identification_number || undefined,
      boleto: data.billet_url,
      phone,
    },
    body: data,
  };
}
