"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Brain, CheckCircle2, Cog, OctagonAlert, Sparkles } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { PageHeader } from "@/components/ui/page-header";
import { QuizEngine, type QuizResult } from "@/components/quiz/quiz-engine";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { QUESTIONS, questionById } from "@/lib/data/questions";
import { dueCards } from "@/lib/spaced-repetition";
import { XP_REWARDS } from "@/lib/xp-engine";
import { cn, shuffle } from "@/lib/utils";
import type { Question } from "@/lib/data/types";

type Mode = null | "daily" | "weak" | Question["category"];

const CATEGORIES: { cat: Question["category"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { cat: "Rules of the Road", label: "Rules of the road", icon: BookOpen },
  { cat: "Road Signs & Markings", label: "Signs, signals & markings", icon: OctagonAlert },
  { cat: "Vehicle Controls", label: "Vehicle controls", icon: Cog },
];

/** Same five questions for everyone on a given day; new set each day. */
function dailySeed() {
  const d = new Date().toISOString().slice(0, 10);
  return Number(d.replace(/-/g, ""));
}

function PracticeInner() {
  const params = useSearchParams();
  const reviewCards = useStore((s) => s.reviewCards);
  const markDaily = useStore((s) => s.markDailyDone);
  const touchStreak = useStore((s) => s.touchStreak);
  const dailyDone = useStore((s) => s.dailyChallengeDoneOn);
  const code = useStore((s) => s.profile.code);
  const stats = useStore((s) => s.categoryStats);
  const [mode, setMode] = React.useState<Mode>(params.get("mode") === "daily" ? "daily" : null);
  const [result, setResult] = React.useState<QuizResult | null>(null);
  const [round, setRound] = React.useState(0);

  const mine = React.useMemo(() => QUESTIONS.filter((q) => q.codes.includes(code)), [code]);

  const weakList = React.useMemo(() => {
    const due = dueCards(Object.values(reviewCards));
    return due.map((c) => questionById(c.questionId)).filter(Boolean) as Question[];
  }, [reviewCards]);

  const questions = React.useMemo<Question[]>(() => {
    if (mode === "daily") return shuffle(mine, dailySeed()).slice(0, 5);
    if (mode === "weak") return weakList.slice(0, 10);
    if (mode) return shuffle(mine.filter((q) => q.category === mode)).slice(0, 10);
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, weakList, mine, round]);

  const today = new Date().toISOString().slice(0, 10);
  const didDaily = dailyDone === today;

  function finish(r: QuizResult) {
    setResult(r);
    touchStreak();
    if (mode === "daily") markDaily();
  }

  function reset() {
    setMode(null);
    setResult(null);
  }

  /* ── Session result ── */
  if (mode && result) {
    const pct = Math.round((result.correct / result.total) * 100);
    const xp = result.correct * XP_REWARDS.questionCorrect + (mode === "daily" ? XP_REWARDS.dailyChallenge : 0);
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg">
        <Card>
          <CardBody className="p-8 text-center sm:p-10">
            <CheckCircle2 className="mx-auto h-12 w-12 text-grass" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">Session complete</h2>
            <p className="mt-2 text-ink-muted">
              {result.correct} of {result.total} correct ({pct}%) · +<CountUp value={xp} /> XP
            </p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="outline" onClick={reset}>
                <ArrowLeft className="h-4 w-4" /> Practice menu
              </Button>
              {mode !== "daily" && (
                <Button
                  onClick={() => {
                    setResult(null);
                    setRound((r) => r + 1);
                  }}
                >
                  Another round <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  }

  /* ── In session ── */
  if (mode) {
    if (questions.length === 0) {
      return (
        <div className="mx-auto max-w-lg">
          <Card>
            <CardBody className="p-8 text-center">
              <Brain className="mx-auto h-10 w-10 text-ink-faint" />
              <h2 className="mt-4 text-xl font-semibold text-ink">Nothing to review yet</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Questions you get wrong in lessons and practice will come back here when they're due for review.
              </p>
              <Button className="mt-6" variant="outline" onClick={reset}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </CardBody>
          </Card>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-2xl">
        <button onClick={reset} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> End session
        </button>
        <Card>
          <CardBody className="p-5 sm:p-7">
            <QuizEngine key={`${mode}-${round}`} questions={questions} onComplete={finish} />
          </CardBody>
        </Card>
      </div>
    );
  }

  /* ── Menu ── */
  return (
    <div className="space-y-8">
      <PageHeader
        title="Practice"
        description="Short rounds between lessons. Every answer counts towards your exam readiness, and questions you miss come back for review."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => !didDaily && setMode("daily")}
          disabled={didDaily}
          className="group flex flex-col rounded-xl border border-asphalt/[0.09] bg-navy-850 p-5 text-left shadow-card transition-[border-color,box-shadow] enabled:hover:border-asphalt/[0.18] enabled:hover:shadow-raised"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber/10 text-amber">
              <Sparkles className="h-5 w-5" />
            </span>
            {didDaily ? <Pill tone="grass">Done today</Pill> : <Pill tone="amber">+{XP_REWARDS.dailyChallenge} XP</Pill>}
          </div>
          <h3 className="mt-4 font-semibold text-ink">Daily challenge</h3>
          <p className="mt-1 text-sm text-ink-muted">
            {didDaily ? "You've done today's challenge. A new one is ready tomorrow." : "Five mixed questions, new every day."}
          </p>
        </button>

        <button
          onClick={() => setMode("weak")}
          className="group flex flex-col rounded-xl border border-asphalt/[0.09] bg-navy-850 p-5 text-left shadow-card transition-[border-color,box-shadow] hover:border-asphalt/[0.18] hover:shadow-raised"
        >
          <div className="flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan/10 text-cyan">
              <Brain className="h-5 w-5" />
            </span>
            <Pill tone={weakList.length ? "cyan" : "muted"}>{weakList.length} due</Pill>
          </div>
          <h3 className="mt-4 font-semibold text-ink">Review mistakes</h3>
          <p className="mt-1 text-sm text-ink-muted">Spaced repetition brings back the questions you've missed, right before you'd forget them.</p>
        </button>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Practise by section</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {CATEGORIES.map(({ cat, label, icon: Icon }) => {
            const count = mine.filter((q) => q.category === cat).length;
            const s = stats[cat];
            const acc = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
            return (
              <button
                key={cat}
                onClick={() => setMode(cat)}
                className="flex flex-col rounded-xl border border-asphalt/[0.09] bg-navy-850 p-5 text-left shadow-card transition-[border-color,box-shadow] hover:border-asphalt/[0.18] hover:shadow-raised"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy-800 text-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-ink">{label}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
                  <span>{count} questions</span>
                  {acc != null && (
                    <>
                      <span>·</span>
                      <span className={cn(acc >= 75 ? "text-grass" : "text-ink-muted")}>{acc}% accuracy</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function PracticePage() {
  return (
    <ClientOnly fallback={<div className="h-96 animate-pulse rounded-xl bg-navy-850" />}>
      <React.Suspense fallback={null}>
        <PracticeInner />
      </React.Suspense>
    </ClientOnly>
  );
}
