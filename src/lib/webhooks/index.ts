import { kiwify } from "./kiwify";
import { pepper } from "./pepper";
import { edduz } from "./edduz";
import { perfectpay } from "./perfectpay";
import { monetize } from "./monetize";
import { hotmart } from "./hotmart";

import type { Getaway } from "@/database/types/Funnel";
import type { Lead } from "@/database/types/Lead";

export type Data = {
  type: "recover" | "buy";
  event: string | null;
  revenue?: number;
  lead: Lead;
};

const functions = {
  kiwify,
  hotmart,
  monetize,
  perfectpay,
  edduz,
  pepper,
};

export const extractWebhook = async (
  body: any,
  getaway: Getaway
): Promise<Data> => {
  return await functions[getaway.toLowerCase() as keyof typeof functions](body);
};
