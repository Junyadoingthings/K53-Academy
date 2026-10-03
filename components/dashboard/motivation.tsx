"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Flame, Zap, CalendarClock, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, useLevel } from "@/lib/store";
import { daysUntil } from "@/lib/utils";

const TIPS = [
  "Per the K53 system: observe, signal, then manoeuvre — in that order, every time.",
  "A solid line on your side means no crossing. Broken line = overtake when clear.",
  "Two-second following gap on dry roads; double it in rain or fog.",
  "Red circle = prohibition. Blue circle = command. Triangle = warning.",
  "At a four-way stop: first to stop goes first; otherwise yield to your right.",
  "Answer a few questions daily — spaced repetition beats last-minute cramming.",
];

export function StreakNudge() {
  const streak = useStore((s) => s.streak);
  const lastStudyDay = useStore((s) => s.lastStudyDay);
  const testDate = useStore((s) => s.profile.testDate);
  const touchStreak = useStore((s) => s.touchStreak);
  const level = useLevel();

  const today = new Date().toISOString().slice(0, 10);
  const checkedInToday = lastStudyDay === today;
  const dTest = daysUntil(testDate);

  // Rotating tip
  const [tip, setTip] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTip((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Build a 7-dot "chain" — filled up to the current streak (capped visual at 7).
  const chain = Array.from({ length: 7 }, (_, i) => i < Math.min(streak, 7));

  let headline: React.ReactNode;
  let sub: string;
  if (streak === 0) {
    headline = (
      <>
        Your streak starts <span className="text-gradient">now</span>
      </>
    );
    sub = "Check in daily to build momentum and earn bonus XP.";
  } else if (!checkedInToday) {
    headline = (
      <>
        Keep the chain alive — day <span className="text-gradient">{streak + 1}</span>
      </>
    );
    sub = "You studied yesterday. Check in today so your streak doesn't reset.";
  } else {
    headline = (
      <>
        <span className="text-gradient">{streak}-day</span> streak. You're on fire.
      </>
    );
    sub = `${level.levelSpan - level.currentLevelXp} XP to level ${level.level + 1}. So close.`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-amber/30 bg-navy-850 p-5 shadow-card"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_0%_0%,rgba(230,138,0,0.12),transparent_55%),radial-gradient(500px_circle_at_100%_120%,rgba(228,0,43,0.1),transparent_55%)]" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber/15 text-amber">
            {streak > 0 ? (
              <Flame className="h-6 w-6 animate-flame-flicker" fill="currentColor" />
            ) : (
              <Rocket className="h-6 w-6" />
            )}
          </span>
          <div>
            <h3 className="font-heading text-lg font-bold text-ink">{headline}</h3>
            <p className="text-sm text-ink-muted">{sub}</p>
            {/* 7-day chain */}
            <div className="mt-2.5 flex items-center gap-1.5">
              {chain.map((on, i) => (
                <span
                  key={i}
                  className={`h-2 w-6 rounded-full transition-all ${
                    on ? "bg-amber shadow-neon-amber" : "bg-navy-700"
                  }`}
                />
              ))}
              <span className="ml-1 font-mono text-[10px] text-ink-faint">this week</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {dTest != null && dTest >= 0 && (
            <div className="hidden items-center gap-1.5 rounded-xl border border-signal/25 bg-signal/[0.06] px-3 py-2 text-signal sm:flex">
              <CalendarClock className="h-4 w-4" />
              <span className="font-mono text-sm font-bold">{dTest}d</span>
              <span className="text-xs">to test</span>
            </div>
          )}
          {!checkedInToday ? (
            <Button variant="amber" onClick={touchStreak} className="shine">
              <Zap className="h-4 w-4" fill="currentColor" /> Check in (+20 XP)
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <Flame className="h-4 w-4 text-amber" fill="currentColor" /> Checked in
            </Button>
          )}
        </div>
      </div>

      {/* rotating tip */}
      <div className="relative mt-4 flex items-center gap-2 border-t border-asphalt/[0.08] pt-3">
        <span className="rounded-md bg-cyan/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-cyan">
          Tip
        </span>
        <motion.p
          key={tip}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-ink-muted"
        >
          {TIPS[tip]}
        </motion.p>
      </div>
    </motion.div>
  );
}
