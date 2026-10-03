"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { StreakFlame } from "@/components/gamification/streak-flame";
import { ClientOnly } from "@/components/hydration";
import { useStore, useLevel } from "@/lib/store";
import { LEADERBOARD, PROVINCES, type LeaderRow } from "@/lib/data/leaderboard";
import { cn } from "@/lib/utils";

type Scope = "global" | "provincial" | "friends";

function Board() {
  const profile = useStore((s) => s.profile);
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const level = useLevel();
  const [scope, setScope] = React.useState<Scope>("global");
  const [province, setProvince] = React.useState(profile.province || "Gauteng");

  const me: LeaderRow = {
    rank: 0,
    username: profile.username || "You",
    province: profile.province || "Gauteng",
    xp,
    level: level.level,
    streak,
  };

  let rows = [...LEADERBOARD, me];
  if (scope === "provincial") rows = rows.filter((r) => r.province === province || r === me);
  if (scope === "friends") rows = [LEADERBOARD[2], LEADERBOARD[5], LEADERBOARD[8], me];

  rows = rows
    .sort((a, b) => b.xp - a.xp)
    .map((r, idx) => ({ ...r, rank: idx + 1 }));

  return (
    <div className="space-y-5">
      <div className="flex gap-2 rounded-xl border border-asphalt/[0.10] bg-navy-850/60 p-1">
        {(
          [
            { id: "global", label: "Global" },
            { id: "provincial", label: "Provincial" },
            { id: "friends", label: "Friends" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setScope(t.id)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              scope === t.id ? "bg-cyan text-navy-950 shadow-neon" : "text-ink-muted hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {scope === "provincial" && (
        <div className="flex flex-wrap gap-1.5">
          {PROVINCES.map((p) => (
            <button
              key={p}
              onClick={() => setProvince(p)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                province === p ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-asphalt/15 text-ink-muted"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <Card>
        <CardBody className="divide-y divide-asphalt/[0.06] p-0">
          {rows.map((r, i) => {
            const isMe = r.username === me.username && r.xp === me.xp;
            const medal =
              r.rank === 1 ? "text-amber" : r.rank === 2 ? "text-ink" : r.rank === 3 ? "text-[#CD7F32]" : "";
            return (
              <motion.div
                key={`${r.username}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  isMe && "bg-cyan/[0.06] ring-1 ring-inset ring-cyan/20"
                )}
              >
                <div className={cn("w-8 shrink-0 text-center font-mono font-bold", medal || "text-ink-faint")}>
                  {r.rank <= 3 ? (
                    r.rank === 1 ? (
                      <Crown className="mx-auto h-5 w-5" />
                    ) : (
                      <Medal className="mx-auto h-5 w-5" />
                    )
                  ) : (
                    r.rank
                  )}
                </div>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-700 font-heading text-sm font-bold text-cyan">
                  {r.username.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-ink">{r.username}</span>
                    {isMe && <Pill tone="cyan">You</Pill>}
                  </div>
                  <div className="font-mono text-[11px] text-ink-faint">
                    Lvl {r.level} · {r.province}
                  </div>
                </div>
                <StreakFlame count={r.streak} size="sm" />
                <div className="w-20 text-right font-mono text-sm font-bold text-cyan">
                  {r.xp.toLocaleString("en-ZA")}
                </div>
              </motion.div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber/10 text-amber">
          <Trophy className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">Leaderboard</h1>
          <p className="text-ink-muted">Climb the ranks. Every bit of XP counts.</p>
        </div>
      </div>
      <ClientOnly fallback={<div className="h-96 animate-pulse rounded-2xl bg-navy-850/70" />}>
        <Board />
      </ClientOnly>
    </div>
  );
}
