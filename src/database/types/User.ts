import type { Timestamp } from "firebase/firestore";

export type User = {
  id: string;

  email: string;
  dueDate: Timestamp;

  name?: string;
  whatsapp?: boolean;

  activeFunnels?: number;
  leadsReached?: number;
  leadsRecovered?: number;
  revenue?: number;
};
