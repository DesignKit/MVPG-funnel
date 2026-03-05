"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const SUCCESS_PATHS: Record<string, string> = {
  "ai-workshop": "/workshop",
  "comprehensive-workshop": "/confirmed?paid=true",
};

export async function createCheckoutSession(
  tierKey: string,
  bookingId: string | null,
  origin: string
) {
  const supabase = await createClient();

  // Fetch tier from DB
  const { data: tier } = await supabase
    .from("pricing_tiers")
    .select("name, price_cents, display_price")
    .eq("key", tierKey)
    .eq("active", true)
    .single();

  if (!tier || tier.price_cents === 0) {
    throw new Error("Invalid tier for checkout");
  }

  // Get user email to pre-fill checkout
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const successPath = SUCCESS_PATHS[tierKey] ?? "/confirmed?paid=true";

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: tier.name },
          unit_amount: tier.price_cents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}${successPath}`,
    cancel_url: `${origin}/confirmed`,
    customer_email: user?.email ?? undefined,
    metadata: {
      bookingId: bookingId ?? "",
      userId: user?.id ?? "",
      tier: tierKey,
    },
  });

  return { url: session.url };
}
