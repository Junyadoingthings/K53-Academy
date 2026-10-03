"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { GridBackdrop, RoadLine } from "@/components/backgrounds";
import { useAuth } from "@/lib/auth-store";

export default function SignUpPage() {
  const router = useRouter();
  const signUp = useAuth((s) => s.signUp);
  const continueAsGuest = useAuth((s) => s.continueAsGuest);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signUp({ name, email, password });
    setBusy(false);
    if (res.ok) router.push("/onboarding");
    else setError(res.error ?? "Something went wrong.");
  }

  async function guest() {
    await continueAsGuest();
    router.push("/dashboard");
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-10">
      <GridBackdrop />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Logo size={46} />
          </Link>
        </div>

        <div className="rounded-2xl border border-asphalt/[0.10] bg-navy-850/80 p-6 shadow-card backdrop-blur">
          <h1 className="font-heading text-2xl font-bold text-ink">Create your driver</h1>
          <p className="mb-5 mt-1 text-sm text-ink-muted">
            Save your XP, streaks and progress — it stays put even after you close the tab.
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-signal/30 bg-signal/10 px-3 py-2 text-sm text-signal">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            <Field icon={<User className="h-4 w-4" />}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Driver name"
                maxLength={20}
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
              />
            </Field>
            <Field icon={<Mail className="h-4 w-4" />}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.co.za"
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
              />
            </Field>
            <Field icon={<Lock className="h-4 w-4" />}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 4 characters)"
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
              />
            </Field>

            <Button type="submit" size="lg" className="w-full shine" disabled={busy}>
              {busy ? "Creating…" : "Create account"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="my-4">
            <RoadLine />
          </div>

          <button
            onClick={guest}
            className="w-full rounded-xl border border-asphalt/15 py-2.5 text-sm font-medium text-ink-muted transition-all hover:border-cyan/40 hover:text-ink"
          >
            Continue as guest
          </button>

          <p className="mt-5 text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-[11px] text-ink-faint">
          Accounts are stored on this device (demo). For cross-device sync, wire Supabase Auth.
        </p>
      </motion.div>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2.5 rounded-xl border border-asphalt/15 bg-navy-800/60 px-3.5 py-3 focus-within:border-cyan/50">
      <span className="text-ink-faint">{icon}</span>
      {children}
    </label>
  );
}
