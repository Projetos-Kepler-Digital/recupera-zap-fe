import type { Data } from ".";

import { formatPhoneNumber } from "../formatPhoneNumber";

type HortmartData =
  | {
      event: "PURCHASE_OUT_OF_SHOPPING_CART";
      data: {
        buyer: {
          name: string;
          email: string;
          phone: string;
        };
      };
    }
  | {
      event: "PURCHASE_APPROVED";
      data: {
        buyer: {
          name: string;
          email: string;
          checkout_phone: string;
        };
        purchase: {
          full_price: {
            value: number;
          };
        };
      };
    }
  | {
      event: "PURCHASE_BILLET_PRINTED";
      data: {
        buyer: {
          name: string;
          email: string;
          checkout_phone: string;
        };
        purchase: {
          full_price: {
            value: number;
          };
        };
      };
    };

export const hotmart = (body: HortmartData): Data => {
  console.log("hotmart");

  const {
    event,
    data: {
      buyer: { name, email },
    },
  } = body;

  if (event === "PURCHASE_APPROVED") {
    const {
      data: {
        buyer: { checkout_phone },
        purchase: {
          full_price: { value },
        },
      },
    } = body;

    return {
      type: "buy",
      event: "Compra aprovada",
      revenue: value,
      lead: {
        phone: formatPhoneNumber(checkout_phone),
        name,
        email,
        cpf: null,
        pixCode: null,
        boletoUrl: null,
        checkout: null,
      },
    };
  } else if (event === "PURCHASE_OUT_OF_SHOPPING_CART") {
    const {
      data: {
        buyer: { phone },
      },
    } = body;

    return {
      type: "recover",
      event: "Carrinho abandonado",
      lead: {
        phone: formatPhoneNumber(phone),
        name,
        email,
        cpf: null,
        pixCode: null,
        boletoUrl: null,
        checkout: null,
      },
    };
  }

  const {
    data: {
      buyer: { checkout_phone },
      purchase: {
        full_price: { value },
      },
    },
  } = body;

  return {
    type: "recover",
    event: "Aguardando pagamento",
    revenue: value,
    lead: {
      phone: formatPhoneNumber(checkout_phone),
      name,
      email,
      cpf: null,
      pixCode: null,
      boletoUrl: null,
      checkout: null,
    },
  };
};
