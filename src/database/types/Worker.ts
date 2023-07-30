import type { Timestamp } from "firebase/firestore";
import type { Lead } from "./Lead";
import type { Shoot } from "./Shoot";

export type Worker = {
  userId: string;
  funnelId: string;

  status: "scheduled" | "paused";
  performAt: Timestamp;

  lead: Lead;
  shoot: Shoot;
};
