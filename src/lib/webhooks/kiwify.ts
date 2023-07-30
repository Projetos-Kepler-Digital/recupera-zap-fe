import { updateDocument } from "@/database/functions/native-functions";
import type { Data } from ".";

import { formatPhoneNumber } from "../formatPhoneNumber";

type KiwifyData =
  | {
      order_status:
        | "paid"
        | "waiting_payment"
        | "refused"
        | "refunded"
        | "chargedback";
      pix_code: string;
      boleto_URL: string;
      Commissions: {
        charge_amount: number;
      };
      Customer: {
        full_name: string;
        email: string;
        CPF: string;
        mobile: string;
      };
    }
  | {
      checkout_link: string;
      cpf: string;
      email: string;
      name: string;
      phone: string;
      status: string;
    };

const events = {
  "Pagamento aprovado": ["paid"],
  "Aguardando pagamento": ["waiting_payment"],
  "Carrinho abandonado": [] as string[],
  "Pagamento reprovado": ["refused"],
  Reembolso: ["refunded", "chargedback"],
};

function findEvent(option: string): string | null {
  for (const event in events) {
    if (events[event as keyof typeof events].includes(option)) {
      return event;
    }
  }

  return null;
}

export const kiwify = async (body: KiwifyData): Promise<Data> => {
  try {
    if ("status" in body) {
      const { checkout_link, cpf, email, name, phone: _phone } = body;

      const phone = formatPhoneNumber(_phone);

      return {
        type: "recover",
        event: "Carrinho abandonado",
        lead: {
          phone,
          name,
          email,
          cpf,
          pixCode: null,
          boletoUrl: null,
          checkout: checkout_link,
        },
      };
    }

    const {
      order_status: eventStatus,
      Commissions: { charge_amount },
      Customer: { full_name, email, CPF, mobile },
    } = body;

    const event = findEvent(eventStatus);

    const pix_code = "pix_code" in body ? body.pix_code : null;
    const boleto_URL = "boleto_URL" in body ? body.boleto_URL : null;

    await updateDocument("logs", "webhook-received", {
      extract: {
        pix_code,
        boleto_URL,
        event,
        charge_amount,
        full_name,
        email,
        CPF,
        mobile,
      },
    });

    return {
      type: event === "paid" ? "buy" : "recover",
      event,
      revenue: charge_amount / 100,
      lead: {
        phone: formatPhoneNumber(mobile),
        name: full_name,
        email,
        cpf: CPF,
        pixCode: pix_code,
        boletoUrl: boleto_URL,
        checkout: null,
      },
    };
  } catch (err) {
    await updateDocument("logs", "webhook-received", {
      status: "error",
      error: err,
    });

    return {} as Data;
  }
};
