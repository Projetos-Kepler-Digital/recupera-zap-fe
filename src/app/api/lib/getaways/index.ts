import { eduzz } from './eduzz';
import { kiwify } from './kiwify';
import { hotmart } from './hotmart';
import { perfectpay } from './perfectpay';
import { monetizze } from './monetizze';
import { kirvano } from './kirvano';

const getaways: Record<Getaway, (body: unknown) => ParseResult> = {
  eduzz,
  kiwify,
  hotmart,
  perfectpay,
  monetizze,
  kirvano,
};

import type { Lead } from '@/types/Funnel';

import type { Event, Getaway } from '@/types/Getaway';

type Success =
  | {
      success: true;
      type: 'lead';
      lead: Lead;
      event: Event;
    }
  | {
      success: true;
      type: 'sale';
      lead: Lead;
      revenue: number;
      event: 'compra aprovada';
    };

type Failure = {
  success: false;
  backlog: string;
};

export type ParseResult = Success | Failure;

export function parse(body: unknown, getaway: Getaway): ParseResult {
  return getaways[getaway](body);
}
