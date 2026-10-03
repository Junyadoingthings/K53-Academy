"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookMarked, Check, X } from "lucide-react";
import type { Question } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
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
 * the store (XP + spaced-repetition card + category stats) unless `dryRun`.
 * Keyboard: A–D or 1–4 to answer, Enter to continue.
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

  const choose = React.useCallback(
    (i: number) => {
      if (locked || !q) return;
      setSelected(i);
      setLocked(true);
      const isCorrect = i === q.answer;
      const fast = Date.now() - startedAt.current < 12000;
      if (isCorrect) setCorrectCount((c) => c + 1);
      if (!dryRun) recordAnswer({ questionId: q.id, category: q.category, correct: isCorrect, fast });
    },
    [locked, q, dryRun, recordAnswer]
  );

  const next = React.useCallback(() => {
    if (index + 1 >= questions.length) {
      onComplete({ correct: correctCount, total: questions.length, perfect: correctCount === questions.length });
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLocked(false);
    startedAt.current = Date.now();
  }, [index, questions.length, correctCount, onComplete]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName)) return;
      if (!q) return;
      const k = e.key.toLowerCase();
      const idx = "abcd".indexOf(k) >= 0 ? "abcd".indexOf(k) : "1234".indexOf(k);
      if (!locked && idx >= 0 && idx < q.options.length) {
        e.preventDefault();
        choose(idx);
      } else if (locked && e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, locked, choose, next]);

  if (!q) return null;
  const isCorrect = selected === q.answer;

  return (
    <div>
      {showProgress && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-ink-muted">
            <span className="tabular">
              Question {index + 1} of {questions.length}
            </span>
            <span>{q.category}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-navy-700">
            <motion.div
              className="h-full rounded-full bg-ink"
              animate={{ width: `${((index + (locked ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {sign && (
            <div className="mb-6 grid place-items-center rounded-xl bg-navy-800/60 py-8">
              <RoadSignSVG sign={sign} size={136} />
            </div>
          )}

          <h2 className="mb-5 text-lg font-semibold leading-snug text-ink sm:text-xl">{q.prompt}</h2>

          <div className="grid gap-2">
            {q.options.map((opt, i) => {
              const isChosen = selected === i;
              const isAnswer = q.answer === i;
              const state = !locked ? "idle" : isAnswer ? "correct" : isChosen ? "wrong" : "dim";
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={locked}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-[15px] transition-colors",
                    state === "idle" && "border-asphalt/[0.12] bg-navy-850 text-ink hover:border-asphalt/25 hover:bg-navy-800/60",
                    state === "correct" && "border-grass/50 bg-grass/[0.08] text-ink",
                    state === "wrong" && "border-cyan/50 bg-cyan/[0.06] text-ink",
                    state === "dim" && "border-asphalt/[0.08] text-ink-faint"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-semibold",
                      state === "correct" && "bg-grass text-white",
                      state === "wrong" && "bg-cyan text-white",
                      (state === "idle" || state === "dim") && "bg-navy-800 text-ink-muted ring-1 ring-inset ring-asphalt/[0.1]"
                    )}
                  >
                    {state === "correct" ? <Check className="h-3.5 w-3.5" /> : state === "wrong" ? <X className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {locked && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                <div className="rounded-lg border border-asphalt/[0.09] bg-navy-800/50 p-4">
                  <div className={cn("text-sm font-semibold", isCorrect ? "text-grass" : "text-cyan")}>
                    {isCorrect ? "Correct" : `Incorrect — the answer is ${String.fromCharCode(65 + q.answer)}`}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{q.explanation}</p>
                  <p className="mt-2.5 flex items-center gap-1.5 text-xs text-ink-faint">
                    <BookMarked className="h-3 w-3" /> {q.reference}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                  <span className="hidden text-xs text-ink-faint sm:inline">Press Enter</span>
                  <Button onClick={next}>
                    {index + 1 >= questions.length ? "See results" : "Next question"}
                    <ArrowRight className="h-4 w-4" />
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
