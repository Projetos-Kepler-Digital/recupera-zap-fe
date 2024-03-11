export const getaways = [
  'hotmart',
  'kiwify',
  'perfectpay',
  'eduzz',
  'kirvano',
  'monetizze',
] as const;

export type Getaway = (typeof getaways)[number];

export const events = [
  'carrinho abandonado',
  'compra aprovada',
  'reembolsado',
  'chargeback',
] as const;

export type Event = (typeof events)[number];
