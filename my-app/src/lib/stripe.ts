// Stripe 決済システム
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};
