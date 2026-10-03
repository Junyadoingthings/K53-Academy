"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthLayout, FormError, OrDivider, TextField } from "@/components/auth/auth-layout";
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
    <AuthLayout
      title="Welcome back"
      description="Sign in to pick up where you left off."
      footer={
        <>
          New to K53 Academy?{" "}
          <Link href="/sign-up" className="font-medium text-ink underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {error && <FormError>{error}</FormError>}
      <form onSubmit={submit} className="space-y-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.co.za"
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <OrDivider />
      <Button variant="outline" size="lg" className="w-full" onClick={guest}>
        Continue as guest
      </Button>
    </AuthLayout>
  );
}
