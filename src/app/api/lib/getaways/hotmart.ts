import { formatPhoneNumber } from '@/utils/format';

import type { ParseResult } from '.';

import type { Event } from '@/types/Getaway';

import { z } from 'zod';

const withdrawalSchema = z.object({
  event: z.literal('PURCHASE_OUT_OF_SHOPPING_CART'),

  data: z.object({
    buyer: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
  }),
});

const orderSchema = z.object({
  event: z.enum([
    'PURCHASE_CANCELED',
    'PURCHASE_COMPLETE',
    'PURCHASE_BILLET_PRINTED',
    'PURCHASE_APPROVED',
    'PURCHASE_PROTEST',
    'PURCHASE_REFUNDED',
    'PURCHASE_CHARGEBACK',
    'PURCHASE_EXPIRED',
    'PURCHASE_DELAYED',
  ]),

  data: z.object({
    product: z.object({
      name: z.string(),
    }),

    buyer: z.object({
      email: z.string().optional(),
      name: z.string().optional(),
      checkout_phone: z.string(),
    }),

    purchase: z.object({
      price: z.object({
        value: z.number(),
      }),

      payment: z.object({
        billet_barcode: z.string().optional(),
        pix_code: z.string().optional(),
      }),
    }),
  }),
});

const schema = z.union([withdrawalSchema, orderSchema]);

type HotmartBody = z.infer<typeof schema>;

export function hotmart(
  body: unknown
): ParseResult & { body: HotmartBody | null } {
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return {
      success: false,
      backlog: validation.error.errors.join(', '),
      body: null,
    };
  }

  const { data } = validation;

  if (data.event === 'PURCHASE_APPROVED') {
    return {
      success: true,
      type: 'sale',
      event: 'compra aprovada',
      revenue: data.data.purchase.price.value,
      lead: {
        name: data.data.buyer.name,
        email: data.data.buyer.email,
        phone: formatPhoneNumber(data.data.buyer.checkout_phone),
      },
      body: data,
    };
  }

  if (data.event === 'PURCHASE_OUT_OF_SHOPPING_CART') {
    return {
      success: true,
      type: 'lead',
      event: 'carrinho abandonado',
      lead: {
        name: data.data.buyer.name,
        email: data.data.buyer.email,
        phone: formatPhoneNumber(data.data.buyer.phone),
      },
      body: data,
    };
  }

  const events: Record<HotmartBody['event'], Event | undefined> = {
    PURCHASE_OUT_OF_SHOPPING_CART: 'carrinho abandonado',
    PURCHASE_CANCELED: undefined,
    PURCHASE_COMPLETE: undefined,
    PURCHASE_BILLET_PRINTED: undefined,
    PURCHASE_APPROVED: 'compra aprovada',
    PURCHASE_PROTEST: undefined,
    PURCHASE_REFUNDED: 'reembolsado',
    PURCHASE_CHARGEBACK: 'chargeback',
    PURCHASE_EXPIRED: undefined,
    PURCHASE_DELAYED: undefined,
  };

  const event = events[data.event];

  if (!event) {
    return {
      success: false,
      backlog: "Event's not been registered yet",
      body: null,
    };
  }

  return {
    success: true,
    type: 'lead',
    event,
    lead: {
      name: data.data.buyer.name,
      email: data.data.buyer.email,
      phone: formatPhoneNumber(data.data.buyer.checkout_phone),
      boleto: data.data.purchase.payment.billet_barcode,
      pix: data.data.purchase.payment.pix_code,
    },
    body: data,
  };
}
