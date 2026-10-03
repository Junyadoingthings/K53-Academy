"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, ChevronRight, Lightbulb, BookMarked } from "lucide-react";
import type { Question } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { signById } from "@/lib/data/signs";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface QuizResult {
  correct: number;
  total: number;
  perfect: boolean;
}

/**
 * Reusable quiz runner for every question type. Records each answer into
 * the store (XP + SM-2 review card + category stats) unless `dryRun`.
 */
export function QuizEngine({
  questions,
  onComplete,
  dryRun = false,
  showProgress = true,
}: {
  questions: Question[];
  onComplete: (result: QuizResult) => void;
  dryRun?: boolean;
  showProgress?: boolean;
}) {
  const recordAnswer = useStore((s) => s.recordAnswer);
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [locked, setLocked] = React.useState(false);
  const [correctCount, setCorrectCount] = React.useState(0);
  const startedAt = React.useRef(Date.now());

  const q = questions[index];
  const sign = q?.signId ? signById(q.signId) : undefined;

  function choose(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    const isCorrect = i === q.answer;
    const fast = Date.now() - startedAt.current < 12000;
    if (isCorrect) setCorrectCount((c) => c + 1);
    if (!dryRun) {
      recordAnswer({ questionId: q.id, category: q.category, correct: isCorrect, fast });
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      onComplete({
        correct: correctCount,
        total: questions.length,
        perfect: correctCount === questions.length,
      });
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLocked(false);
    startedAt.current = Date.now();
  }

  if (!q) return null;
  const isCorrect = selected === q.answer;

  return (
    <div>
      {showProgress && (
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-ink-muted">
            <span className="font-mono">
              Question {index + 1} / {questions.length}
            </span>
            <Pill tone="cyan">{q.category}</Pill>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-700">
            <motion.div
              className="h-full rounded-full bg-cyan"
              animate={{ width: `${((index + (locked ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {sign && (
            <div className="mb-5 flex justify-center rounded-2xl border border-asphalt/[0.10] bg-navy-900/60 py-6">
              <RoadSignSVG sign={sign} size={128} />
            </div>
          )}

          <h2 className="mb-5 font-heading text-xl font-semibold leading-snug text-ink">
            {q.prompt}
          </h2>

          <div className="grid gap-2.5">
            {q.options.map((opt, i) => {
              const isChosen = selected === i;
              const isAnswer = q.answer === i;
              const state = !locked
                ? "idle"
                : isAnswer
                ? "correct"
                : isChosen
                ? "wrong"
                : "dim";
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={locked}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all",
                    state === "idle" &&
                      "border-asphalt/[0.12] bg-navy-800/50 hover:border-cyan/50 hover:bg-navy-800",
                    state === "correct" && "border-grass/60 bg-grass/10 text-grass",
                    state === "wrong" && "border-signal/60 bg-signal/10 text-signal-soft",
                    state === "dim" && "border-asphalt/[0.08] bg-navy-800/30 opacity-50"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs font-bold",
                      state === "correct" && "border-grass bg-grass text-navy-950",
                      state === "wrong" && "border-signal bg-signal text-white",
                      (state === "idle" || state === "dim") &&
                        "border-asphalt/20 text-ink-muted group-hover:border-cyan/50"
                    )}
                  >
                    {state === "correct" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : state === "wrong" ? (
                      <X className="h-3.5 w-3.5" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {locked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 overflow-hidden"
              >
                <div
                  className={cn(
                    "rounded-xl border p-4",
                    isCorrect ? "border-grass/30 bg-grass/[0.06]" : "border-signal/30 bg-signal/[0.06]"
                  )}
                >
                  <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                    {isCorrect ? (
                      <span className="text-grass">Correct! +8 XP</span>
                    ) : (
                      <span className="text-signal-soft">Not quite.</span>
                    )}
                  </div>
                  <p className="flex gap-2 text-sm text-ink-muted">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                    {q.explanation}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-ink-faint">
                    <BookMarked className="h-3 w-3" /> {q.reference}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button onClick={next}>
                    {index + 1 >= questions.length ? "Finish" : "Next question"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
