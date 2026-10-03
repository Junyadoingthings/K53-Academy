/**
 * Supabase Auth integration point.
 *
 * The demo build uses the local Zustand store for a signed-in "session".
 * To wire real auth (email, Google, and SA phone/OTP):
 *
 *   1. Create a Supabase project; set NEXT_PUBLIC_SUPABASE_URL and
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.
 *   2. `npm i @supabase/supabase-js @supabase/ssr`
 *   3. Replace the stubs below with a real browser/server client and use
 *      middleware to protect the (dashboard) route group.
 */

export type AuthProvider = "email" | "google" | "phone";

export interface DemoSession {
  userId: string;
  provider: AuthProvider;
  email?: string;
  phone?: string;
}

// --- Real Supabase client (uncomment once configured) --------------------
// import { createBrowserClient } from "@supabase/ssr";
// export const supabase = createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
// export async function signInWithGoogle() {
//   return supabase.auth.signInWithOAuth({ provider: "google" });
// }
// export async function sendPhoneOtp(phone: string) {
//   return supabase.auth.signInWithOtp({ phone });
// }

export const AUTH_READY = false;
