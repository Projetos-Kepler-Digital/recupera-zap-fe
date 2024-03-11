import { Timestamp } from 'firebase/firestore';

import type { Getaway, Event } from './Getaway';

export type Shoot = {
  index: number;
  shootAfter: number;
  delay: number;
  message: string;
  media: string | File | null;
};

export type Lead = Partial<{
  cpf: string;
  name: string;
  email: string;

  pix: string;
  boleto: string;
  checkout: string;
}> & { phone: string };

export type Funnel = {
  id: string;
  uid: string;

  createdAt: Timestamp;

  name: string;

  getaway: Getaway;
  events: Event[];

  status: 'active' | 'suspended';

  shoots: Shoot[];
  leads: string[];

  revenue: number;
  recovers: number;
  reaches: number;
};
