import { Timestamp } from 'firebase/firestore';

export type Getaway = 'Hotmart' | 'Kiwify' | 'Perfectpay' | 'Edduz';
// | 'Monetize'
// | "Pepper"

const events = [
  'Aguardando pagamento',
  'Pagamento reprovado',
  'Pagamento aprovado',
  'Carrinho abandonado',
  'Reembolso',
];

export const Events = {
  Hotmart: [
    'Carrinho abandonado',
    'Compra aprovada',
    'Aguardandando pagamento',
  ],
  Monetize: events,
  Kiwify: events,
  Perfectpay: events,
  Edduz: [
    'Aguardando pagamento',
    'Pagamento aprovado',
    'Carrinho abandonado',
    'Reembolso',
  ],
  Pepper: events,
};

export type Funnel = {
  id: string;

  createdAt: Timestamp;
  isActive: boolean;

  name: string;
  getaway: Getaway;
  events: string[];

  leads: string[];

  leadsReached: number;
  leadsRecovered: number;
  revenue: number;
};
