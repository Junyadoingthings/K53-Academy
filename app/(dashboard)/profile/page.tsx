"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, LogOut, Snowflake, Trash2 } from "lucide-react";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { PageHeader, Segmented } from "@/components/ui/page-header";
import { BadgeMedal } from "@/components/gamification/badge-medal";
import { LevelRing } from "@/components/gamification/level-ring";
import { XpBar } from "@/components/gamification/xp-bar";
import { ClientOnly } from "@/components/hydration";
import { useStore, useLevel, type VehicleCode } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { useTheme, applyTheme } from "@/components/theme";
import { BADGES } from "@/lib/data/badges";
import { ROOMS } from "@/lib/data/rooms";
import { PROVINCES } from "@/lib/data/leaderboard";
import { PLANS, rand } from "@/lib/paystack";
import { cn } from "@/lib/utils";

const FREEZE_COST = 40;

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        {description && <div className="mt-0.5 text-[13px] text-ink-muted">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const inputCls =
  "h-9 rounded-lg border border-asphalt/[0.12] bg-navy-850 px-3 text-sm text-ink shadow-card outline-none focus:border-cyan/60 focus:ring-2 focus:ring-cyan/15";

function ProfileInner() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const badges = useStore((s) => s.badges);
  const completedRooms = useStore((s) => s.completedRooms);
  const coins = useStore((s) => s.coins);
  const freezes = useStore((s) => s.freezes);
  const streak = useStore((s) => s.streak);
  const xp = useStore((s) => s.xp);
  const buyFreeze = useStore((s) => s.buyFreeze);
  const reset = useStore((s) => s.reset);
  const level = useLevel();
  const account = useAuth((s) => s.currentAccount());
  const signOut = useAuth((s) => s.signOut);
  const { theme } = useTheme();
  const router = useRouter();
  const [name, setName] = React.useState(profile.username || account?.name || "");
  const [saved, setSaved] = React.useState(false);

  const displayName = profile.username || account?.name || "Learner";

  function saveName() {
    setProfile({ username: name.trim() || displayName });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Profile" description="Your progress, achievements and study settings." />

      {/* Summary */}
      <Card>
        <CardBody className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-navy-800 text-2xl font-semibold text-ink ring-1 ring-asphalt/[0.08]">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <div className="text-lg font-semibold text-ink">{displayName}</div>
              <div className="text-sm text-ink-muted">
                {account?.guest ? "Guest — progress saved on this device" : account?.email}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Pill>{level.rank.name}</Pill>
                <Pill>Code {profile.code}</Pill>
                <Pill>{profile.province}</Pill>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-5 sm:justify-end">
            <div className="w-full max-w-[220px]">
              <XpBar />
            </div>
            <LevelRing size={72} />
          </div>
        </CardBody>
        <div className="grid grid-cols-2 divide-asphalt/[0.08] border-t border-asphalt/[0.08] sm:grid-cols-4 sm:divide-x">
          {[
            { label: "Total XP", value: xp.toLocaleString("en-ZA") },
            { label: "Lessons", value: `${completedRooms.length} / ${ROOMS.length}` },
            { label: "Study streak", value: `${streak} day${streak === 1 ? "" : "s"}` },
            { label: "RoadCoins", value: coins.toLocaleString("en-ZA") },
          ].map((s) => (
            <div key={s.label} className="px-6 py-4">
              <div className="text-xs text-ink-faint">{s.label}</div>
              <div className="tabular mt-1 font-semibold text-ink">{s.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            {badges.length} of {BADGES.length} earned
          </CardDescription>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {BADGES.map((b) => {
              const has = badges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={cn("flex items-center gap-3 rounded-lg border p-3", has ? "border-asphalt/[0.1]" : "border-dashed border-asphalt/[0.12]")}
                >
                  <BadgeMedal badge={b} unlocked={has} size={40} />
                  <div className="min-w-0">
                    <div className={cn("truncate text-sm font-medium", has ? "text-ink" : "text-ink-muted")}>{b.name}</div>
                    <div className="line-clamp-2 text-[11px] leading-snug text-ink-faint">{has ? b.description : b.criteria}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Study settings */}
      <Card>
        <CardHeader>
          <CardTitle>Study settings</CardTitle>
          <CardDescription>These shape your learning path, practice questions and mock tests.</CardDescription>
        </CardHeader>
        <CardBody className="divide-y divide-asphalt/[0.07] py-0">
          <Row label="Display name" description="Shown on the leaderboard.">
            <div className="flex gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className={cn(inputCls, "w-44")} />
              <Button size="sm" variant="outline" onClick={saveName} className="h-9">
                {saved ? <Check className="h-4 w-4 text-grass" /> : "Save"}
              </Button>
            </div>
          </Row>
          <Row label="Licence code">
            <Segmented
              value={profile.code}
              onChange={(c: VehicleCode) => setProfile({ code: c })}
              options={[
                { id: "1", label: "Code 1" },
                { id: "2", label: "Code 2" },
                { id: "3", label: "Code 3" },
              ]}
            />
          </Row>
          <Row label="Test date" description="Powers the countdown on your dashboard.">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={profile.testDate ?? ""}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setProfile({ testDate: e.target.value || null })}
                className={inputCls}
              />
              {profile.testDate && (
                <Button size="sm" variant="ghost" onClick={() => setProfile({ testDate: null })}>
                  Clear
                </Button>
              )}
            </div>
          </Row>
          <Row label="Province">
            <select value={profile.province} onChange={(e) => setProfile({ province: e.target.value })} className={inputCls}>
              {PROVINCES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Row>
          <Row label="Appearance">
            <Segmented
              value={theme}
              onChange={(t) => applyTheme(t)}
              options={[
                { id: "light", label: "Light" },
                { id: "dark", label: "Dark" },
              ]}
            />
          </Row>
          <Row
            label="Streak freeze"
            description={`Protects your streak if you miss a day. You have ${freezes}. Costs ${FREEZE_COST} RoadCoins.`}
          >
            <Button size="sm" variant="outline" onClick={() => buyFreeze()} disabled={coins < FREEZE_COST}>
              <Snowflake className="h-4 w-4" /> Buy freeze
            </Button>
          </Row>
        </CardBody>
      </Card>

      {/* Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Everything in K53 Academy is free during early access.</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.values(PLANS).map((p) => {
              const current = p.id === "free";
              return (
                <div key={p.id} className={cn("flex flex-col rounded-lg border p-4", current ? "border-ink ring-1 ring-ink" : "border-asphalt/[0.1]")}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-ink">{p.name}</span>
                    <span className="tabular text-sm text-ink-muted">{p.price === 0 ? "Free" : `${rand(p.price)}/${p.period}`}</span>
                  </div>
                  <ul className="mt-3 flex-1 space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[13px] text-ink-muted">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="mt-4 w-full" disabled>
                    {current ? "Current plan" : "Coming soon"}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardBody className="divide-y divide-asphalt/[0.07] py-0">
          <Row label="Sign out" description="Your progress stays saved to this account on this device.">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                signOut();
                router.replace("/sign-in");
              }}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </Row>
          <Row label="Reset progress" description="Permanently clears your XP, streak, badges and history.">
            <Button
              size="sm"
              variant="outline"
              className="text-cyan hover:text-cyan"
              onClick={() => confirm("Reset all progress? This can't be undone.") && reset()}
            >
              <Trash2 className="h-4 w-4" /> Reset
            </Button>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ClientOnly fallback={<div className="h-96 animate-pulse rounded-xl bg-navy-850" />}>
      <ProfileInner />
    </ClientOnly>
  );
}
