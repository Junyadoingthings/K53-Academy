"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PageHeader, Segmented } from "@/components/ui/page-header";
import { StreakFlame } from "@/components/gamification/streak-flame";
import { ClientOnly } from "@/components/hydration";
import { useStore, useLevel } from "@/lib/store";
import { LEADERBOARD, PROVINCES, type LeaderRow } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

type Scope = "national" | "provincial";

const MEDAL = ["bg-amber/15 text-amber", "bg-navy-700 text-ink", "bg-[#CD7F32]/15 text-[#B06A28]"];

function Board() {
  const profile = useStore((s) => s.profile);
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const level = useLevel();
  const [scope, setScope] = React.useState<Scope>("national");
  const [province, setProvince] = React.useState<string>(profile.province || "Gauteng");

  const me: LeaderRow & { me: true } = {
    rank: 0,
    username: profile.username || "You",
    province: profile.province || "Gauteng",
    xp,
    level: level.level,
    streak,
    me: true,
  };

  let rows: (LeaderRow & { me?: boolean })[] = [...LEADERBOARD, me];
  if (scope === "provincial") rows = rows.filter((r) => r.province === province || r.me);
  rows = rows.sort((a, b) => b.xp - a.xp).map((r, idx) => ({ ...r, rank: idx + 1 }));

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2.5 rounded-lg border border-asphalt/[0.09] bg-navy-850 px-4 py-3 text-sm text-ink-muted shadow-card">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
        <span>
          Preview: the other names below are sample data. Live rankings arrive when online accounts launch — your own
          XP is real and counts from today.
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          value={scope}
          onChange={setScope}
          options={[
            { id: "national", label: "National" },
            { id: "provincial", label: "Provincial" },
          ]}
        />
        {scope === "provincial" && (
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            aria-label="Province"
            className="h-9 rounded-lg border border-asphalt/[0.12] bg-navy-850 px-2.5 text-sm text-ink shadow-card outline-none"
          >
            {PROVINCES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_auto_5.5rem] items-center gap-3 border-b border-asphalt/[0.08] px-4 py-2.5 text-xs font-medium text-ink-faint">
          <span>Rank</span>
          <span>Learner</span>
          <span className="hidden sm:block">Streak</span>
          <span className="text-right">XP</span>
        </div>
        <CardBody className="divide-y divide-asphalt/[0.06] p-0">
          {rows.map((r) => (
            <div
              key={`${r.username}-${r.rank}`}
              className={cn("grid grid-cols-[3rem_1fr_auto_5.5rem] items-center gap-3 px-4 py-3", r.me && "bg-cyan/[0.05]")}
            >
              <span
                className={cn(
                  "tabular grid h-7 w-7 place-items-center rounded-full text-xs font-semibold",
                  r.rank <= 3 ? MEDAL[r.rank - 1] : "text-ink-faint"
                )}
              >
                {r.rank}
              </span>
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-800 text-xs font-semibold text-ink">
                  {r.username.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-ink">{r.username}</span>
                    {r.me && <Pill tone="cyan">You</Pill>}
                  </div>
                  <div className="text-xs text-ink-faint">
                    Level {r.level} · {r.province}
                  </div>
                </div>
              </div>
              <span className="hidden sm:block">
                <StreakFlame count={r.streak} size="sm" />
              </span>
              <span className="tabular text-right text-sm font-semibold text-ink">{r.xp.toLocaleString("en-ZA")}</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Leaderboard" description="See how your progress compares with other learners." />
      <ClientOnly fallback={<div className="h-96 animate-pulse rounded-xl bg-navy-850" />}>
        <Board />
      </ClientOnly>
    </div>
  );
}
