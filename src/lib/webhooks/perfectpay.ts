import type { Data } from ".";

import { formatPhoneNumber } from "../formatPhoneNumber";

enum SaleStatus {
  none,
  pending,
  approved,
  in_process,
  in_mediation,
  rejected,
  cancelled,
  refunded,
  authorized,
  charged_back,
  completed,
  checkout_error,
  precheckout,
  expired,
  in_review,
}

const events = {
  "Pagamento aprovado": [SaleStatus.approved],
  "Aguardando pagamento": [SaleStatus.pending],
  "Carrinho abandonado": [SaleStatus.checkout_error, SaleStatus.precheckout],
  "Pagamento reprovado": [SaleStatus.rejected],
  Reembolso: [
    SaleStatus.cancelled,
    SaleStatus.refunded,
    SaleStatus.charged_back,
  ],
};

function findEvent(saleStatus: SaleStatus): string | null {
  for (const event in events) {
    if (events[event as keyof typeof events].includes(saleStatus)) {
      return event;
    }
  }

  return null;
}

type PerfectpayData = {
  sale_amount: number;
  sale_status_enum: SaleStatus;
  customer: {
    full_name: string;
    email: string;
    identification_number: string;
    phone_formated: string;
  };
  billet_url: string;
};

export const perfectpay = (body: PerfectpayData): Data => {
  const {
    sale_amount: revenue,
    sale_status_enum: eventEnum,
    customer: {
      full_name: name,
      email,
      identification_number: cpf,
      phone_formated,
    },
    billet_url: boletoUrl,
  } = body;

  const event = findEvent(eventEnum);
  const phone = formatPhoneNumber(phone_formated);

  if (eventEnum === SaleStatus.approved) {
    return {
      type: "buy",
      event,
      revenue,
      lead: {
        phone,
        name,
        email,
        cpf,
        pixCode: null,
        boletoUrl,
        checkout: null,
      },
    };
  }

  return {
    type: "recover",
    event,
    revenue,
    lead: {
      phone,
      name,
      email,
      cpf,
      pixCode: null,
      boletoUrl,
      checkout: null,
    },
  };
};
