import { Timestamp } from "firebase/firestore";

export type Getaway =
  | "Hotmart"
  | "Monetize"
  | "Kiwify"
  | "Perfectpay"
  | "Edduz"
  | "Pepper";

const events = [
  "Aguardando pagamento",
  "Pagamento reprovado",
  "Pagamento aprovado",
  "Carrinho abandonado",
  "Reembolso",
];

export const Events = {
  Hotmart: [
    "Carrinho abandonado",
    "Compra aprovada",
    "Aguardandando pagamento",
  ],
  Monetize: events,
  Kiwify: events,
  Perfectpay: events,
  Edduz: events,
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
