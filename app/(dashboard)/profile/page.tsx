"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Settings, Trash2, Globe, Crown, Check, Snowflake, LogOut, Moon, Sun } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { BadgeMedal } from "@/components/gamification/badge-medal";
import { LevelRing } from "@/components/gamification/level-ring";
import { StreakFlame } from "@/components/gamification/streak-flame";
import { XpBar } from "@/components/gamification/xp-bar";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { useStore, useLevel } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { useTheme } from "@/components/theme";
import { useRouter } from "next/navigation";
import { BADGES } from "@/lib/data/badges";
import { ROOMS } from "@/lib/data/rooms";
import { PLANS, rand } from "@/lib/paystack";
import { cn } from "@/lib/utils";

const LANGS = ["English", "isiZulu", "Afrikaans", "Sesotho"];

function ProfileInner() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const badges = useStore((s) => s.badges);
  const completedRooms = useStore((s) => s.completedRooms);
  const coins = useStore((s) => s.coins);
  const freezes = useStore((s) => s.freezes);
  const buyFreeze = useStore((s) => s.buyFreeze);
  const reset = useStore((s) => s.reset);
  const level = useLevel();
  const account = useAuth((s) => s.currentAccount());
  const signOut = useAuth((s) => s.signOut);
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [lang, setLang] = React.useState("English");
  const [plan, setPlan] = React.useState<string>("free");

  const name = profile.username || account?.name || "Driver";

  function handleSignOut() {
    signOut();
    router.replace("/sign-in");
  }

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card glow="cyan" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-radial-cyan" />
        <CardBody className="relative flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 place-items-center rounded-2xl border-2 border-cyan/40 bg-navy-900 shadow-neon">
            <span className="font-heading text-4xl font-bold text-cyan">
              {name.slice(0, 1).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-heading text-2xl font-bold text-ink">{name}</h1>
            {account && !account.guest && (
              <div className="text-xs text-ink-faint">{account.email}</div>
            )}
            {account?.guest && (
              <div className="text-xs text-amber">Guest — sign up to keep your progress safe</div>
            )}
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Pill tone="cyan">{level.rank.name}</Pill>
              <Pill tone="amber">Level {level.level}</Pill>
              <StreakFlame count={useStore.getState().streak} size="sm" />
            </div>
            <div className="mt-4 max-w-sm">
              <XpBar compact />
            </div>
          </div>
          <LevelRing size={88} />
        </CardBody>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Rooms cleared", value: completedRooms.length, of: ROOMS.length },
          { label: "Badges", value: badges.length, of: BADGES.length },
          { label: "RoadCoins", value: coins },
          { label: "Freezes", value: freezes },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-asphalt/[0.10] bg-navy-850/70 p-4 text-center">
            <div className="font-heading text-2xl font-bold text-ink">
              <CountUp value={s.value} />
              {s.of != null && <span className="text-ink-faint">/{s.of}</span>}
            </div>
            <div className="text-xs text-ink-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements ({badges.length}/{BADGES.length})</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {BADGES.map((b) => (
              <div key={b.id} className="flex flex-col items-center gap-1.5 text-center">
                <BadgeMedal badge={b} unlocked={badges.includes(b.id)} size={64} />
                <span className={cn("text-[11px] font-medium", badges.includes(b.id) ? "text-ink" : "text-ink-faint")}>
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Membership */}
      <Card glow="amber">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber" /> Membership
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.values(PLANS).map((p) => {
              const active = plan === p.id;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "rounded-2xl border p-4 transition-all",
                    active ? "border-amber/50 bg-amber/[0.05] shadow-neon-amber" : "border-asphalt/[0.10] bg-navy-900/40"
                  )}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-heading text-lg font-bold text-ink">{p.name}</span>
                    <span className="font-mono text-sm text-amber">
                      {p.price === 0 ? "Free" : `${rand(p.price)}/${p.period}`}
                    </span>
                  </div>
                  {"priceYear" in p && (
                    <div className="font-mono text-[11px] text-ink-faint">
                      or {rand((p as { priceYear: number }).priceYear)}/year
                    </div>
                  )}
                  <ul className="mt-3 space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-ink-muted">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-grass" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={active ? "outline" : p.id === "free" ? "ghost" : "amber"}
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setPlan(p.id)}
                    disabled={active}
                  >
                    {active ? "Current plan" : p.id === "free" ? "Downgrade" : "Upgrade"}
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-ink-faint">
            Payments via Paystack (cards, EFT, SnapScan). This demo simulates the upgrade — wire real
            checkout in <span className="font-mono">lib/paystack.ts</span>.
          </p>
        </CardBody>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-ink-muted" /> Settings
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-asphalt/[0.10] bg-navy-900/40 p-4">
            <div className="flex items-center gap-2 text-sm text-ink">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-cyan" />
              ) : (
                <Sun className="h-4 w-4 text-amber" />
              )}
              Appearance
              <span className="font-mono text-xs text-ink-faint">({theme})</span>
            </div>
            <Button size="sm" variant="outline" onClick={toggle}>
              Switch to {theme === "dark" ? "light" : "dark"}
            </Button>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
              <Globe className="h-4 w-4 text-cyan" /> Language
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                    lang === l ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-asphalt/15 text-ink-muted"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-asphalt/[0.10] bg-navy-900/40 p-4">
            <div className="flex items-center gap-2 text-sm text-ink">
              <Snowflake className="h-4 w-4 text-cyan-soft" /> Buy a streak freeze
              <span className="font-mono text-xs text-ink-faint">(40 coins)</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => buyFreeze()} disabled={coins < 40}>
              Buy freeze
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-signal/20 bg-signal/[0.04] p-4">
            <div className="text-sm text-ink">
              Reset all progress
              <div className="text-xs text-ink-faint">Clears XP, streak, badges and history.</div>
            </div>
            <Button size="sm" variant="danger" onClick={() => confirm("Reset all progress?") && reset()}>
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-asphalt/[0.10] bg-navy-900/40 p-4">
            <div className="text-sm text-ink">
              Sign out
              <div className="text-xs text-ink-faint">Your progress is saved to this account.</div>
            </div>
            <Button size="sm" variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ClientOnly fallback={<div className="h-96 animate-pulse rounded-2xl bg-navy-850/70" />}>
      <ProfileInner />
    </ClientOnly>
  );
}
