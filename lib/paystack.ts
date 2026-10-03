/**
 * Paystack integration point (South African payment gateway — cards, EFT,
 * SnapScan). The demo simulates upgrades locally; wire the real flow here.
 *
 *   1. Create a Paystack account; set PAYSTACK_SECRET_KEY and
 *      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.
 *   2. Initialise a transaction server-side (app/api/paystack/route.ts),
 *      redirect to the authorization_url, and verify on the callback.
 */

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "3 rooms per path",
      "1 mock test per week",
      "Core question bank",
      "Road sign trainer",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    price: 79,
    priceYear: 499,
    period: "month",
    features: [
      "Everything unlocked",
      "Unlimited mock tests",
      "Advanced analytics & weak-area radar",
      "Offline PWA downloads",
      "Ad-free",
    ],
  },
  instructor: {
    id: "instructor",
    name: "Instructor",
    price: 199,
    period: "month",
    features: [
      "Manage student accounts",
      "Assign paths & track progress",
      "Class leaderboards",
      "Everything in Premium",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;

/** Rand formatting for prices. */
export function rand(amount: number): string {
  return `R${amount.toFixed(0)}`;
}

// --- Real Paystack init (server-side, uncomment once configured) ---------
// export async function initTransaction(email: string, amountKobo: number) {
//   const res = await fetch("https://api.paystack.co/transaction/initialize", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, amount: amountKobo, currency: "ZAR" }),
//   });
//   return res.json();
// }
