import Stripe from "stripe";

// dev
// sk_test_51MfwbBEjZvONFtaqwi034dFAqJqcjVE8cGc6dpL5BpB931H8cTBIWTMaVzSZPcyzgvLRHAqWc6YWiWAt4Vho7hbP0015FHgM1E
const STRIPE_SECRET_KEY =
  "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";

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  appInfo: {
    name: "RecuperaZap",
    version: "1",
  },
});
