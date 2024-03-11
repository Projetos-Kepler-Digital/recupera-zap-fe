import type { ParseResult } from '.';

import { z } from 'zod';

import { formatPhoneNumber } from '@/utils/format';

import type { Event } from '@/types/Getaway';

const schema = z.object({
  tipoEvento: z.object({
    codigo: z.number(),
  }),
  comprador: z.object({
    nome: z.string().optional(),
    cnpj_cpf: z.string().optional(),
    email: z.string().optional(),
    telefone: z.string(),
  }),
  pix_url: z.string().optional(),
  venda: z.object({
    valor: z.number().optional(),
    linkBoleto: z.string().optional(),
  }),
});

type MonetizzeBody = z.infer<typeof schema>;

export function monetizze(
  body: unknown
): ParseResult & { body: MonetizzeBody | null } {
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return {
      success: false,
      backlog: validation.error.errors.join(', '),
      body: null,
    };
  }

  const { data } = validation;

  const event = (function (event: number) {
    if (event === 2 || event === 101) {
      return 'compra aprovada';
    }

    if (event === 7) {
      return 'carrinho abandonado';
    }

    if (event === 4) {
      return 'reembolsado';
    }

    if (event === 5) {
      return 'chargeback';
    }

    return null;
  })(data.tipoEvento.codigo);

  if (!event) {
    return {
      success: false,
      backlog: 'event not included',
      body: null,
    };
  }

  if (event === 'compra aprovada') {
    return {
      success: true,
      type: 'sale',
      event: 'compra aprovada',
      revenue: data.venda.valor!,
      lead: {
        name: data.comprador.nome,
        email: data.comprador.email,
        phone: formatPhoneNumber(data.comprador.telefone),
        cpf: data.comprador.cnpj_cpf || undefined,
        boleto: data.venda.linkBoleto || undefined,
        pix: data.pix_url || undefined,
      },
      body: data,
    };
  }

  return {
    success: true,
    type: 'lead',
    event: event as Event,
    lead: {
      name: data.comprador.nome,
      email: data.comprador.email,
      phone: formatPhoneNumber(data.comprador.telefone),
      cpf: data.comprador.cnpj_cpf || undefined,
      boleto: data.venda.linkBoleto || undefined,
      pix: data.pix_url || undefined,
    },
    body: data,
  };
}
