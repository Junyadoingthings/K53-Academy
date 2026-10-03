"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Dumbbell, Flame, Brain, ArrowLeft, Trophy, Zap } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { QuizEngine, type QuizResult } from "@/components/quiz/quiz-engine";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { QUESTIONS, questionsByCategory } from "@/lib/data/questions";
import { questionById } from "@/lib/data/questions";
import { dueCards } from "@/lib/spaced-repetition";
import { shuffle } from "@/lib/utils";
import type { Question } from "@/lib/data/types";

type Mode = null | "daily" | "weak" | Question["category"];

const CATEGORIES: Question["category"][] = [
  "Rules of the Road",
  "Road Signs & Markings",
  "Vehicle Controls",
];

function PracticeInner() {
  const params = useSearchParams();
  const reviewCards = useStore((s) => s.reviewCards);
  const markDaily = useStore((s) => s.markDailyDone);
  const touchStreak = useStore((s) => s.touchStreak);
  const dailyDone = useStore((s) => s.dailyChallengeDoneOn);
  const [mode, setMode] = React.useState<Mode>(params.get("mode") === "daily" ? "daily" : null);
  const [result, setResult] = React.useState<QuizResult | null>(null);

  const weakList = React.useMemo(() => {
    const due = dueCards(Object.values(reviewCards));
    return due.map((c) => questionById(c.questionId)).filter(Boolean) as Question[];
  }, [reviewCards]);

  const questions = React.useMemo<Question[]>(() => {
    if (mode === "daily") return shuffle(QUESTIONS, 20260728).slice(0, 5);
    if (mode === "weak") return weakList.slice(0, 10);
    if (mode) return shuffle(questionsByCategory(mode)).slice(0, 10);
    return [];
  }, [mode, weakList]);

  function finish(r: QuizResult) {
    setResult(r);
    touchStreak();
    if (mode === "daily") markDaily();
  }

  function reset() {
    setMode(null);
    setResult(null);
  }

  if (mode && result) {
    const pct = Math.round((result.correct / result.total) * 100);
    return (
      <div className="mx-auto max-w-xl">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <Card glow="grass">
            <CardBody className="p-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-grass/10 text-grass">
                <Trophy className="h-8 w-8" />
              </div>
              <h2 className="mt-4 font-heading text-2xl font-bold text-ink">Session complete!</h2>
              <p className="mt-1 text-ink-muted">
                {result.correct}/{result.total} correct ({pct}%)
              </p>
              <div className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-cyan/20 bg-cyan/[0.05] py-3">
                <Zap className="h-5 w-5 text-cyan" fill="currentColor" />
                <span className="font-mono text-2xl font-bold text-cyan">
                  +<CountUp value={result.correct * 8 + (mode === "daily" ? 90 : 0)} /> XP
                </span>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                <Button variant="outline" onClick={reset}>
                  <ArrowLeft className="h-4 w-4" /> Practice menu
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (mode) {
    if (questions.length === 0) {
      return (
        <div className="mx-auto max-w-xl text-center">
          <Card>
            <CardBody className="p-8">
              <Brain className="mx-auto h-10 w-10 text-cyan" />
              <h2 className="mt-3 font-heading text-xl font-bold text-ink">Nothing due right now</h2>
              <p className="mt-1 text-ink-muted">
                Your weak-area queue is empty — answer more questions in rooms to build it up. Spaced
                repetition will resurface the ones you miss.
              </p>
              <Button className="mt-5" variant="outline" onClick={reset}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </CardBody>
          </Card>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-2xl">
        <button onClick={reset} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-cyan">
          <ArrowLeft className="h-4 w-4" /> Exit session
        </button>
        <Card>
          <CardBody className="p-5">
            <QuizEngine questions={questions} onComplete={finish} />
          </CardBody>
        </Card>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const didDaily = dailyDone === today;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Practice</h1>
        <p className="mt-1 text-ink-muted">
          Sharpen up between rooms. Every answer feeds your XP and your spaced-repetition schedule.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button onClick={() => !didDaily && setMode("daily")} disabled={didDaily} className="text-left">
          <Card glow="amber" className="h-full">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber/10 text-amber">
                  <Flame className="h-5 w-5" />
                </span>
                <Pill tone="amber">+90 XP</Pill>
              </div>
              <h3 className="mt-3 font-heading text-lg font-bold text-ink">Daily Challenge</h3>
              <p className="mt-1 text-sm text-ink-muted">
                {didDaily ? "Completed today — back tomorrow!" : "5 mixed questions. Bonus XP. Resets midnight SAST."}
              </p>
            </CardBody>
          </Card>
        </button>

        <button onClick={() => setMode("weak")} className="text-left">
          <Card glow="signal" className="h-full">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-signal/10 text-signal-soft">
                  <Brain className="h-5 w-5" />
                </span>
                <Pill tone="signal">{weakList.length} due</Pill>
              </div>
              <h3 className="mt-3 font-heading text-lg font-bold text-ink">Weak Areas</h3>
              <p className="mt-1 text-sm text-ink-muted">
                SM-2 spaced repetition resurfaces the questions you keep getting wrong.
              </p>
            </CardBody>
          </Card>
        </button>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-lg font-semibold text-ink">Drill by category</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setMode(cat)} className="text-left">
              <Card glow="cyan" className="h-full">
                <CardBody className="p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan/10 text-cyan">
                    <Dumbbell className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-heading text-base font-bold text-ink">{cat}</h3>
                  <p className="mt-1 text-xs text-ink-faint">
                    {questionsByCategory(cat).length} questions
                  </p>
                </CardBody>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <ClientOnly fallback={<div className="h-96 animate-pulse rounded-2xl bg-navy-850/70" />}>
      <React.Suspense fallback={null}>
        <PracticeInner />
      </React.Suspense>
    </ClientOnly>
  );
}
