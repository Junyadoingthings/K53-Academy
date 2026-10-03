"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthLayout, FormError, OrDivider, TextField } from "@/components/auth/auth-layout";
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
    <AuthLayout
      aside="photo"
      title="Create your account"
      description="Free to start. Takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-ink underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {error && <FormError>{error}</FormError>}
      <form onSubmit={submit} className="space-y-4">
        <TextField
          label="First name"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          placeholder="Thandi"
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least 8 characters."
        />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <OrDivider />
      <Button variant="outline" size="lg" className="w-full" onClick={guest}>
        Continue as guest
      </Button>
      <p className="mt-6 text-center text-xs leading-relaxed text-ink-faint">
        Your account and progress are saved on this device.
      </p>
    </AuthLayout>
  );
}
