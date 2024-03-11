import { Funnel } from './Funnel';

import type { Timestamp } from 'firebase-admin/firestore';

export type Plan = 'trial' | 'premium';

export type License = {
  id: string;

  name: string | null;
  email: string;
  phone: string | null;

  license: Plan;
  licensedUntil: Timestamp;
};

export type User = {
  id: string;

  createdAt: Timestamp;

  name: string | null;
  email: string;
  phone: string | null;

  isConnected: boolean;

  licensedUntil: Timestamp;

  funnels?: Funnel[];
};
