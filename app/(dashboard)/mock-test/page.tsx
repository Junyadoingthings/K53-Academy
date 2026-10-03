"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FileCheck2, Timer, CheckCircle2, XCircle, Zap, ArrowRight, PartyPopper } from "lucide-react";
import { ConfettiBurst } from "@/components/effects/confetti";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { CountUp } from "@/components/gamification/count-up";
import { AchievementWatcher } from "@/components/gamification/achievement-watcher";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { QUESTIONS } from "@/lib/data/questions";
import { signById } from "@/lib/data/signs";
import { shuffle } from "@/lib/utils";
import { XP_REWARDS } from "@/lib/xp-engine";
import type { Question, QCategory } from "@/lib/data/types";
import { cn } from "@/lib/utils";

// Official K53 learner's structure (the real target).
const OFFICIAL = [
  { cat: "Vehicle Controls" as QCategory, count: 8, pass: 6 },
  { cat: "Road Signs & Markings" as QCategory, count: 30, pass: 23 },
  { cat: "Rules of the Road" as QCategory, count: 30, pass: 22 },
];
const TEST_SECONDS = 60 * 60;

function buildPaper(): Question[] {
  // Demo paper: as many as the bank holds per section (seed to 1000+ for a
  // full 68-question paper). Real ordering mirrors the official structure.
  const paper: Question[] = [];
  for (const sec of OFFICIAL) {
    const pool = shuffle(QUESTIONS.filter((q) => q.category === sec.cat));
    paper.push(...pool.slice(0, sec.count));
  }
  return paper;
}

function MockInner() {
  const awardXp = useStore((s) => s.awardXp);
  const touchStreak = useStore((s) => s.touchStreak);
  const [phase, setPhase] = React.useState<"intro" | "run" | "result">("intro");
  const [paper, setPaper] = React.useState<Question[]>([]);
  const [i, setI] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [time, setTime] = React.useState(TEST_SECONDS);

  React.useEffect(() => {
    if (phase !== "run") return;
    if (time <= 0) return void submit();
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, time]);

  function start() {
    const p = buildPaper();
    setPaper(p);
    setAnswers({});
    setI(0);
    setTime(TEST_SECONDS);
    setPhase("run");
  }

  function pick(qid: string, opt: number) {
    setAnswers((a) => ({ ...a, [qid]: opt }));
  }

  const result = React.useMemo(() => {
    const bySec: Record<string, { correct: number; total: number }> = {};
    for (const q of paper) {
      bySec[q.category] ??= { correct: 0, total: 0 };
      bySec[q.category].total++;
      if (answers[q.id] === q.answer) bySec[q.category].correct++;
    }
    const sections = OFFICIAL.map((s) => {
      const r = bySec[s.cat] ?? { correct: 0, total: 0 };
      const passMark = r.total > 0 ? Math.ceil((s.pass / s.count) * r.total) : 0;
      return { ...s, ...r, passMark, passed: r.correct >= passMark && r.total > 0 };
    }).filter((s) => s.total > 0);
    const correct = sections.reduce((a, s) => a + s.correct, 0);
    const total = sections.reduce((a, s) => a + s.total, 0);
    const passed = sections.length > 0 && sections.every((s) => s.passed);
    return { sections, correct, total, passed };
  }, [paper, answers]);

  function submit() {
    setPhase("result");
    const xp = XP_REWARDS.mockTestComplete + (result.passed ? XP_REWARDS.mockTestPass : 0);
    awardXp(xp, "Mock test");
    touchStreak();
  }

  // ── Intro ──
  if (phase === "intro") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">Mock Test</h1>
          <p className="mt-1 text-ink-muted">
            A timed simulation of the official K53 learner's test structure.
          </p>
        </div>
        <Card glow="cyan">
          <CardBody className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {OFFICIAL.map((s) => (
                <div key={s.cat} className="rounded-xl border border-asphalt/[0.10] bg-navy-900/50 p-4 text-center">
                  <div className="font-heading text-2xl font-bold text-cyan">{s.count}</div>
                  <div className="text-xs text-ink-muted">{s.cat}</div>
                  <div className="mt-1 font-mono text-[10px] text-ink-faint">pass: {s.pass}/{s.count}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><FileCheck2 className="h-4 w-4 text-cyan" /> 68 questions</span>
              <span className="inline-flex items-center gap-1.5"><Timer className="h-4 w-4 text-amber" /> 60 minutes</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-grass" /> Must pass every section</span>
            </div>
            <p className="mt-4 text-center text-xs text-ink-faint">
              This demo draws from the current question bank. Seed to 1000+ questions for the full
              68-question paper — the structure and pass logic are already in place.
            </p>
            <Button size="lg" className="mt-5 w-full" onClick={start}>
              Begin mock test <ArrowRight className="h-4 w-4" />
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ── Result ──
  if (phase === "result") {
    return (
      <div className="mx-auto max-w-xl space-y-5">
        <AchievementWatcher mockPassed={result.passed} />
        {result.passed && <ConfettiBurst count={110} origin="top" />}
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <Card glow={result.passed ? "grass" : "signal"}>
            <CardBody className="p-8 text-center">
              <div
                className={cn(
                  "mx-auto grid h-16 w-16 place-items-center rounded-2xl",
                  result.passed ? "bg-grass/10 text-grass" : "bg-signal/10 text-signal-soft"
                )}
              >
                {result.passed ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
              </div>
              <h2 className="mt-4 flex items-center justify-center gap-2 font-heading text-3xl font-bold text-ink">
                {result.passed ? (
                  <>
                    PASS <PartyPopper className="h-7 w-7 text-amber" />
                  </>
                ) : (
                  "Not yet"
                )}
              </h2>
              <p className="mt-1 text-ink-muted">
                {result.correct}/{result.total} correct overall
              </p>
              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-xl border border-cyan/20 bg-cyan/[0.05] px-4 py-2">
                <Zap className="h-4 w-4 text-cyan" fill="currentColor" />
                <span className="font-mono font-bold text-cyan">
                  +<CountUp value={150 + (result.passed ? 100 : 0)} /> XP
                </span>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <div className="space-y-2">
          {result.sections.map((s) => (
            <Card key={s.cat}>
              <CardBody className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-ink">{s.cat}</div>
                  <div className="font-mono text-xs text-ink-faint">
                    {s.correct}/{s.total} · need {s.passMark}
                  </div>
                </div>
                {s.passed ? (
                  <Pill tone="grass"><CheckCircle2 className="h-3 w-3" /> Passed</Pill>
                ) : (
                  <Pill tone="signal"><XCircle className="h-3 w-3" /> Failed</Pill>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        <Button className="w-full" onClick={() => setPhase("intro")}>
          Take another
        </Button>
      </div>
    );
  }

  // ── Run ──
  const q = paper[i];
  const sign = q.signId ? signById(q.signId) : undefined;
  const answered = Object.keys(answers).length;
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="sticky top-16 z-10 flex items-center justify-between rounded-xl border border-asphalt/[0.10] bg-navy-850/90 px-4 py-2.5 backdrop-blur">
        <span className="font-mono text-sm text-ink-muted">
          {i + 1}/{paper.length}
        </span>
        <span className="font-mono text-xs text-ink-faint">{answered} answered</span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-mono text-sm font-bold",
            time <= 300 ? "text-signal-soft" : "text-cyan"
          )}
        >
          <Timer className="h-4 w-4" /> {mm}:{ss}
        </span>
      </div>

      <Card>
        <CardBody className="p-5">
          {sign && (
            <div className="mb-5 flex justify-center rounded-2xl border border-asphalt/[0.10] bg-navy-900/60 py-6">
              <RoadSignSVG sign={sign} size={120} />
            </div>
          )}
          <Pill tone="cyan">{q.category}</Pill>
          <h2 className="mt-2 font-heading text-xl font-semibold leading-snug text-ink">{q.prompt}</h2>
          <div className="mt-4 grid gap-2.5">
            {q.options.map((opt, idx) => {
              const chosen = answers[q.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => pick(q.id, idx)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                    chosen
                      ? "border-cyan/60 bg-cyan/10 text-cyan"
                      : "border-asphalt/[0.12] bg-navy-800/50 hover:border-cyan/40"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-md border text-xs font-bold",
                      chosen ? "border-cyan bg-cyan text-navy-950" : "border-asphalt/20 text-ink-muted"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" disabled={i === 0} onClick={() => setI((v) => v - 1)}>
          Previous
        </Button>
        {i + 1 < paper.length ? (
          <Button onClick={() => setI((v) => v + 1)}>
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="success" onClick={submit}>
            Submit test
          </Button>
        )}
      </div>
    </div>
  );
}

export default function MockTestPage() {
  return (
    <ClientOnly fallback={<div className="h-96 animate-pulse rounded-2xl bg-navy-850/70" />}>
      <MockInner />
    </ClientOnly>
  );
}
