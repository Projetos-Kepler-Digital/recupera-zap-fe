import type { ParseResult } from '.';

import { z } from 'zod';

import { formatPhoneNumber } from '@/utils/format';

import type { Event } from '@/types/Getaway';

const schema = z.object({
  event: z.enum([
    'BANK_SLIP_GENERATED',
    'BANK_SLIP_EXPIRED',
    'PIX_GENERATED',
    'PIX_EXPIRED',
    'SALE_REFUSED',
    'SALE_CHARGEBACK',
    'SALE_APPROVED',
    'SALE_REFUNDED',
    'ABANDONED_CART',
    'SUBSCRIPTION_CANCELED',
    'SUBSCRIPTION_EXPIRED',
    'SUBSCRIPTION_RENEWED',
  ]),
  total_price: z.string(),
  customer: z.object({
    name: z.string().optional(),
    document: z.string().optional(),
    email: z.string().optional(),
    phone_number: z.string(),
  }),
  payment: z.object({
    link: z.string().optional(),
    barcode: z.string().optional(),
    qrcode: z.string().optional(),
  }),
});

type KirvanoBody = z.infer<typeof schema>;

export function kirvano(
  body: unknown
): ParseResult & { body: KirvanoBody | null } {
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return {
      success: false,
      backlog: validation.error.errors.join(', '),
      body: null,
    };
  }

  const { data } = validation;

  const EVENTS: KirvanoBody['event'][] = [
    'SALE_APPROVED',
    'SUBSCRIPTION_RENEWED',
    'BANK_SLIP_GENERATED',
    'ABANDONED_CART',
    'PIX_GENERATED',
    'SALE_REFUSED',
    'SALE_REFUNDED',
    'SALE_CHARGEBACK',
  ];

  if (!EVENTS.includes(data.event)) {
    return {
      success: false,
      backlog: 'event not included',
      body: null,
    };
  }

  if (data.event === 'SALE_APPROVED') {
    const revenue = Number(
      data.total_price.replace('R$ ', '').replace(',', '.')
    );

    return {
      success: true,
      type: 'sale',
      event: 'compra aprovada',
      revenue,
      lead: {
        name: data.customer.name,
        email: data.customer.email,
        phone: formatPhoneNumber(data.customer.phone_number),
        cpf: data.customer.document || undefined,
        boleto: data.payment.barcode || undefined,
        pix: data.payment.qrcode || undefined,
      },
      body: data,
    };
  }

  const events = {
    SALE_APPROVED: 'compra aprovada',
    SUBSCRIPTION_RENEWED: 'compra aprovada',
    BANK_SLIP_GENERATED: 'carrinho abandonado',
    ABANDONED_CART: 'carrinho abandonado',
    PIX_GENERATED: 'carrinho abandonado',
    SALE_REFUSED: 'reembolsado',
    SALE_REFUNDED: 'reembolsado',
    SALE_CHARGEBACK: 'chargeback',
  };

  return {
    success: true,
    type: 'lead',
    event: events[data.event as keyof typeof events] as Event,
    lead: {
      name: data.customer.name,
      email: data.customer.email,
      phone: formatPhoneNumber(data.customer.phone_number),
      cpf: data.customer.document || undefined,
      boleto: data.payment.barcode || undefined,
      pix: data.payment.qrcode || undefined,
    },
    body: data,
  };
}
