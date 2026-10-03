"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Coins,
  BookOpenCheck,
  Target,
  ChevronRight,
  Sparkles,
  CalendarClock,
  ArrowRight,
  Hand,
  CheckCircle2,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, DifficultyPill } from "@/components/ui/pill";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StreakNudge } from "@/components/dashboard/motivation";
import { WeeklyXpChart, AccuracyRadar } from "@/components/dashboard/charts";
import { LevelRing } from "@/components/gamification/level-ring";
import { XpBar } from "@/components/gamification/xp-bar";
import { StreakFlame } from "@/components/gamification/streak-flame";
import { BadgeMedal } from "@/components/gamification/badge-medal";
import { CountUp } from "@/components/gamification/count-up";
import { RoadLine } from "@/components/backgrounds";
import { ClientOnly } from "@/components/hydration";
import { useStore, useLevel } from "@/lib/store";
import { PATHS } from "@/lib/data/paths";
import { ROOMS, roomById } from "@/lib/data/rooms";
import { BADGES } from "@/lib/data/badges";
import { daysUntil } from "@/lib/utils";

function DashboardInner() {
  const profile = useStore((s) => s.profile);
  const streak = useStore((s) => s.streak);
  const coins = useStore((s) => s.coins);
  const completedRooms = useStore((s) => s.completedRooms);
  const badges = useStore((s) => s.badges);
  const categoryStats = useStore((s) => s.categoryStats);
  const dailyDone = useStore((s) => s.dailyChallengeDoneOn);
  const touchStreak = useStore((s) => s.touchStreak);
  const level = useLevel();

  const name = profile.username || "Driver";
  const codeLabel = { "1": "Code 1 · Motorcycle", "2": "Code 2 · Light Vehicle", "3": "Code 3 · Heavy Vehicle" }[
    profile.code
  ];

  // Active path = first path matching the user's code.
  const activePath = PATHS.find((p) => p.codes.includes(profile.code)) ?? PATHS[0];
  const pathRooms = activePath.roomIds;
  const donePathRooms = pathRooms.filter((r) => completedRooms.includes(r));
  const pathPct = Math.round((donePathRooms.length / pathRooms.length) * 100);
  const nextRoomId = pathRooms.find((r) => !completedRooms.includes(r)) ?? pathRooms[0];
  const nextRoom = roomById(nextRoomId)!;

  const totalCorrect = Object.values(categoryStats).reduce((a, c) => a + c.correct, 0);
  const totalAns = Object.values(categoryStats).reduce((a, c) => a + c.total, 0);
  const accuracy = totalAns > 0 ? Math.round((totalCorrect / totalAns) * 100) : 0;
  const dTest = daysUntil(profile.testDate);
  const today = new Date().toISOString().slice(0, 10);
  const didDaily = dailyDone === today;

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden" glow="cyan">
          <div className="pointer-events-none absolute inset-0 bg-radial-cyan" />
          <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan/10 blur-3xl" />
          <CardBody className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <LevelRing size={92} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-cyan">
                  {level.rank.name}
                </span>
                <Pill tone="amber">{codeLabel}</Pill>
              </div>
              <h1 className="mt-1 flex items-center gap-2 font-heading text-2xl font-bold text-ink sm:text-3xl">
                Welcome back, {name}
                <motion.span
                  animate={{ rotate: [0, 18, -8, 14, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6 }}
                  className="inline-flex origin-[70%_80%] text-amber"
                >
                  <Hand className="h-6 w-6" />
                </motion.span>
              </h1>
              <p className="mt-0.5 text-sm text-ink-muted">
                {pathPct < 100
                  ? `You're ${pathPct}% through ${activePath.title}. Keep the momentum.`
                  : `You've cleared ${activePath.title}! Ready for the next challenge?`}
              </p>
              <div className="mt-4 max-w-md">
                <XpBar />
              </div>
            </div>
            <div className="flex gap-2 sm:flex-col">
              <Button onClick={touchStreak} variant="amber" className="flex-1">
                <Flame className="h-4 w-4" fill="currentColor" /> Check in
              </Button>
              <Link href={`/rooms/${nextRoom.slug}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Resume <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Motivation / streak nudge */}
      <StreakNudge />

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          icon="Flame"
          tone="amber"
          label="Day streak"
          value={<CountUp value={streak} />}
          sub={streak > 0 ? "Keep it burning" : "Start today"}
        />
        <StatTile
          icon="BookOpenCheck"
          tone="cyan"
          label="Rooms cleared"
          value={
            <>
              <CountUp value={completedRooms.length} />
              <span className="text-ink-faint">/{ROOMS.length}</span>
            </>
          }
        />
        <StatTile
          icon="Target"
          tone="grass"
          label="Accuracy"
          value={<><CountUp value={accuracy} />%</>}
          sub={`${totalCorrect} correct`}
        />
        <StatTile
          icon={dTest != null ? "CalendarClock" : "Coins"}
          tone={dTest != null ? "signal" : "amber"}
          label={dTest != null ? "Days to test" : "RoadCoins"}
          value={dTest != null ? <CountUp value={Math.max(0, dTest)} /> : <CountUp value={coins} />}
          sub={dTest != null ? "Stay sharp" : "Spend on freezes"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue path */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card glow="cyan">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Continue your path</CardTitle>
              <Link href={`/paths/${activePath.slug}`} className="text-xs text-cyan hover:underline">
                View path
              </Link>
            </CardHeader>
            <CardBody>
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{activePath.title}</span>
                <span className="font-mono text-ink-muted">
                  {donePathRooms.length}/{pathRooms.length} rooms
                </span>
              </div>
              <div className="mb-5 h-2 overflow-hidden rounded-full bg-navy-700">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-deep to-cyan"
                  animate={{ width: `${pathPct}%` }}
                />
              </div>

              <div className="rounded-xl border border-cyan/20 bg-cyan/[0.04] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                    Next up
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-heading text-lg font-semibold text-ink">
                      {nextRoom.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <DifficultyPill level={nextRoom.difficulty} />
                      <Pill>{nextRoom.estMinutes} min</Pill>
                      <Pill tone="cyan">+{nextRoom.xp} XP</Pill>
                    </div>
                  </div>
                  <Link href={`/rooms/${nextRoom.slug}`}>
                    <Button>
                      Enter <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Daily challenge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card glow="amber" className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber/15 text-amber">
                  <Sparkles className="h-4 w-4" />
                </span>
                Daily Challenge
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink-muted">
                5 quick questions, bonus <span className="font-semibold text-amber">+90 XP</span>.
                Resets at midnight SAST.
              </p>
              <div className="my-4">
                <RoadLine />
              </div>
              {didDaily ? (
                <div className="flex items-center justify-center gap-1.5 rounded-xl border border-grass/30 bg-grass/[0.06] p-3 text-center text-sm text-grass">
                  <CheckCircle2 className="h-4 w-4" /> Done for today — come back tomorrow!
                </div>
              ) : (
                <Link href="/practice?mode=daily">
                  <Button variant="amber" className="w-full">
                    Start challenge
                  </Button>
                </Link>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly XP</CardTitle>
          </CardHeader>
          <CardBody>
            <WeeklyXpChart />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accuracy by category</CardTitle>
          </CardHeader>
          <CardBody>
            <AccuracyRadar />
          </CardBody>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Your badges</CardTitle>
          <Link href="/profile" className="text-xs text-cyan hover:underline">
            {badges.length}/{BADGES.length} earned
          </Link>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            {BADGES.map((b) => (
              <BadgeMedal key={b.id} badge={b} unlocked={badges.includes(b.id)} size={56} />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-44 animate-pulse rounded-2xl bg-navy-850/70" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-navy-850/70" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-navy-850/70" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ClientOnly fallback={<Skeleton />}>
      <DashboardInner />
    </ClientOnly>
  );
}
