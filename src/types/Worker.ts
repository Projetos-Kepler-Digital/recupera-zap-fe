import type { Timestamp } from 'firebase-admin/firestore';

import { Lead, Shoot } from './Funnel';

export type Worker = {
  uid: string;
  fid: string;

  lead: Lead;
  shoot: Shoot;

  performAt: Timestamp;
};
