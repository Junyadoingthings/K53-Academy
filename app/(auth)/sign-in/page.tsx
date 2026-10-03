"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme";
import { Button } from "@/components/ui/button";
import { GridBackdrop, RoadLine } from "@/components/backgrounds";
import { useAuth } from "@/lib/auth-store";

export default function SignInPage() {
  const router = useRouter();
  const signIn = useAuth((s) => s.signIn);
  const continueAsGuest = useAuth((s) => s.continueAsGuest);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signIn(email, password);
    setBusy(false);
    if (res.ok) router.push("/dashboard");
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
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Logo size={46} />
          </Link>
        </div>

        <div className="rounded-2xl border border-asphalt/[0.10] bg-navy-850/80 p-6 shadow-card backdrop-blur">
          <h1 className="font-heading text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mb-5 mt-1 text-sm text-ink-muted">Sign in to pick up right where you left off.</p>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-signal/30 bg-signal/10 px-3 py-2 text-sm text-signal">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            <label className="flex items-center gap-2.5 rounded-xl border border-asphalt/15 bg-navy-800/60 px-3.5 py-3 focus-within:border-cyan/50">
              <Mail className="h-4 w-4 text-ink-faint" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.co.za"
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
              />
            </label>
            <label className="flex items-center gap-2.5 rounded-xl border border-asphalt/15 bg-navy-800/60 px-3.5 py-3 focus-within:border-cyan/50">
              <Lock className="h-4 w-4 text-ink-faint" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
              />
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"} <ArrowRight className="h-4 w-4" />
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
            New here?{" "}
            <Link href="/sign-up" className="font-semibold text-cyan hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
