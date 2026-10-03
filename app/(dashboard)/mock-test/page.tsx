"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, XCircle } from "lucide-react";
import { ConfettiBurst } from "@/components/effects/confetti";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { PageHeader } from "@/components/ui/page-header";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { CountUp } from "@/components/gamification/count-up";
import { AchievementWatcher } from "@/components/gamification/achievement-watcher";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { QUESTIONS } from "@/lib/data/questions";
import { signById } from "@/lib/data/signs";
import { cn, shuffle } from "@/lib/utils";
import { XP_REWARDS } from "@/lib/xp-engine";
import type { Question, QCategory } from "@/lib/data/types";

/** Official learner's test structure, in the order the sections are written. */
const OFFICIAL = [
  { cat: "Rules of the Road" as QCategory, label: "Rules of the road", count: 30, pass: 22 },
  { cat: "Road Signs & Markings" as QCategory, label: "Signs, signals & markings", count: 30, pass: 23 },
  { cat: "Vehicle Controls" as QCategory, label: "Vehicle controls", count: 8, pass: 6 },
];
const TEST_SECONDS = 60 * 60;

function poolFor(cat: QCategory, code: string) {
  return QUESTIONS.filter((q) => q.category === cat && q.codes.includes(code as "1" | "2" | "3"));
}

function buildPaper(code: string): Question[] {
  return OFFICIAL.flatMap((sec) => shuffle(poolFor(sec.cat, code)).slice(0, sec.count));
}

function MockInner() {
  const awardXp = useStore((s) => s.awardXp);
  const touchStreak = useStore((s) => s.touchStreak);
  const code = useStore((s) => s.profile.code);
  const [phase, setPhase] = React.useState<"intro" | "run" | "result">("intro");
  const [paper, setPaper] = React.useState<Question[]>([]);
  const [i, setI] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [flags, setFlags] = React.useState<Record<string, boolean>>({});
  const [time, setTime] = React.useState(TEST_SECONDS);
  const [confirming, setConfirming] = React.useState(false);

  const available = OFFICIAL.map((s) => Math.min(s.count, poolFor(s.cat, code).length));
  const paperLength = available.reduce((a, b) => a + b, 0);
  const isShort = OFFICIAL.some((s, idx) => available[idx] < s.count);

  const result = React.useMemo(() => {
    const sections = OFFICIAL.map((s) => {
      const qs = paper.filter((q) => q.category === s.cat);
      const correct = qs.filter((q) => answers[q.id] === q.answer).length;
      const passMark = qs.length > 0 ? Math.ceil((s.pass / s.count) * qs.length) : 0;
      return { ...s, correct, total: qs.length, passMark, passed: qs.length > 0 && correct >= passMark };
    }).filter((s) => s.total > 0);
    const correct = sections.reduce((a, s) => a + s.correct, 0);
    const total = sections.reduce((a, s) => a + s.total, 0);
    return { sections, correct, total, passed: sections.length > 0 && sections.every((s) => s.passed) };
  }, [paper, answers]);

  const submit = React.useCallback(() => {
    setConfirming(false);
    setPhase("result");
    awardXp(XP_REWARDS.mockTestComplete + (result.passed ? XP_REWARDS.mockTestPass : 0), "Mock test");
    touchStreak();
    window.scrollTo({ top: 0 });
  }, [awardXp, touchStreak, result.passed]);

  React.useEffect(() => {
    if (phase !== "run") return;
    if (time <= 0) return void submit();
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time, submit]);

  function start() {
    setPaper(buildPaper(code));
    setAnswers({});
    setFlags({});
    setI(0);
    setTime(TEST_SECONDS);
    setPhase("run");
  }

  /* ── Intro ── */
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader
          title="Mock test"
          description="A timed paper built like the real computerised learner's test. Answer in any order, flag questions to revisit, and submit when you're ready."
        />
        <Card>
          <CardBody className="p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {OFFICIAL.map((s, idx) => (
                <div key={s.cat} className="rounded-lg border border-asphalt/[0.09] p-4">
                  <div className="text-sm font-medium text-ink">{s.label}</div>
                  <div className="tabular mt-3 text-2xl font-semibold tracking-tight text-ink">{available[idx]}</div>
                  <div className="text-xs text-ink-muted">questions</div>
                  <div className="mt-2 text-xs text-ink-faint">
                    Real test: pass {s.pass} of {s.count}
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-5 grid gap-2 text-sm text-ink-muted sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-faint" /> 60 minutes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ink-faint" /> Pass every section
              </li>
              <li className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-ink-faint" /> Flag and come back
              </li>
            </ul>
            {isShort && (
              <p className="mt-5 rounded-lg bg-navy-800/70 px-3.5 py-2.5 text-xs leading-relaxed text-ink-muted">
                Our question bank doesn't yet fill every section of the real 68-question paper, so this paper has{" "}
                {paperLength} questions. Pass marks are scaled to the same percentage as the real test.
              </p>
            )}
            <Button size="lg" className="mt-6 w-full" onClick={start}>
              Start mock test <ArrowRight className="h-4 w-4" />
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  /* ── Result ── */
  if (phase === "result") {
    const wrong = paper.filter((q) => answers[q.id] !== q.answer);
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <AchievementWatcher mockPassed={result.passed} />
        {result.passed && <ConfettiBurst count={80} origin="top" />}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardBody className="p-8 text-center sm:p-10">
              {result.passed ? (
                <CheckCircle2 className="mx-auto h-12 w-12 text-grass" />
              ) : (
                <XCircle className="mx-auto h-12 w-12 text-cyan" />
              )}
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
                {result.passed ? "You passed" : "Not a pass yet"}
              </h1>
              <p className="mt-2 text-ink-muted">
                {result.correct} of {result.total} correct overall.{" "}
                {result.passed ? "You met the pass mark in every section." : "You need to pass every section."}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                +<CountUp value={XP_REWARDS.mockTestComplete + (result.passed ? XP_REWARDS.mockTestPass : 0)} /> XP
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-3">
          {result.sections.map((s) => (
            <div key={s.cat} className="rounded-xl border border-asphalt/[0.09] bg-navy-850 p-4 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-ink">{s.label}</div>
                {s.passed ? <Pill tone="grass">Pass</Pill> : <Pill tone="cyan">Fail</Pill>}
              </div>
              <div className="tabular mt-3 text-2xl font-semibold text-ink">
                {s.correct}
                <span className="text-base font-normal text-ink-faint"> / {s.total}</span>
              </div>
              <div className="text-xs text-ink-muted">Needed {s.passMark}</div>
            </div>
          ))}
        </div>

        {wrong.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Review your mistakes ({wrong.length})</CardTitle>
            </CardHeader>
            <CardBody className="divide-y divide-asphalt/[0.07] p-0">
              {wrong.map((q) => {
                const sign = q.signId ? signById(q.signId) : undefined;
                const yours = answers[q.id];
                return (
                  <div key={q.id} className="flex gap-4 px-5 py-4">
                    {sign && <RoadSignSVG sign={sign} size={48} className="shrink-0" />}
                    <div className="min-w-0 text-sm">
                      <div className="font-medium text-ink">{q.prompt}</div>
                      <div className="mt-1.5 text-ink-muted">
                        {yours == null ? (
                          <span className="text-ink-faint">Not answered. </span>
                        ) : (
                          <span>
                            You chose <span className="text-cyan line-through decoration-cyan/40">{q.options[yours]}</span>.{" "}
                          </span>
                        )}
                        Answer: <span className="font-medium text-grass">{q.options[q.answer]}</span>
                      </div>
                      <p className="mt-1.5 text-ink-faint">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setPhase("intro")}>
            Back to overview
          </Button>
          <Button onClick={start}>Take another test</Button>
        </div>
      </div>
    );
  }

  /* ── Run ── */
  const q = paper[i];
  const sign = q.signId ? signById(q.signId) : undefined;
  const answeredCount = Object.keys(answers).length;
  const unanswered = paper.length - answeredCount;
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");
  const section = OFFICIAL.find((s) => s.cat === q.category)!;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_260px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-muted">
            <span className="tabular font-medium text-ink">Question {i + 1}</span> of {paper.length} · {section.label}
          </span>
          <span className={cn("tabular inline-flex items-center gap-1.5 font-semibold lg:hidden", time <= 300 ? "text-cyan" : "text-ink")}>
            <Clock className="h-4 w-4" /> {mm}:{ss}
          </span>
        </div>

        <Card>
          <CardBody className="p-5 sm:p-7">
            {sign && (
              <div className="mb-6 grid place-items-center rounded-xl bg-navy-800/60 py-8">
                <RoadSignSVG sign={sign} size={132} />
              </div>
            )}
            <h2 className="text-lg font-semibold leading-snug text-ink sm:text-xl">{q.prompt}</h2>
            <div className="mt-5 grid gap-2">
              {q.options.map((opt, idx) => {
                const chosen = answers[q.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-[15px] transition-colors",
                      chosen
                        ? "border-ink bg-navy-800/60 text-ink ring-1 ring-ink"
                        : "border-asphalt/[0.12] bg-navy-850 text-ink hover:border-asphalt/25 hover:bg-navy-800/50"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-semibold",
                        chosen ? "bg-ink text-navy-900" : "bg-navy-800 text-ink-muted ring-1 ring-inset ring-asphalt/[0.1]"
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
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          <Button
            variant="ghost"
            onClick={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}
            className={cn(flags[q.id] && "text-amber hover:text-amber")}
          >
            <Flag className="h-4 w-4" fill={flags[q.id] ? "currentColor" : "none"} /> {flags[q.id] ? "Flagged" : "Flag"}
          </Button>
          {i + 1 < paper.length ? (
            <Button onClick={() => setI((v) => v + 1)}>
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => (unanswered > 0 ? setConfirming(true) : submit())}>Submit</Button>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardBody className="p-4">
            <div className="hidden items-center justify-between lg:flex">
              <span className="text-sm text-ink-muted">Time left</span>
              <span className={cn("tabular text-lg font-semibold", time <= 300 ? "text-cyan" : "text-ink")}>
                {mm}:{ss}
              </span>
            </div>
            <div className="mt-0 text-xs text-ink-faint lg:mt-3">
              {answeredCount} of {paper.length} answered
            </div>
            <div className="mt-3 grid grid-cols-10 gap-1 lg:grid-cols-6">
              {paper.map((pq, idx) => (
                <button
                  key={pq.id}
                  onClick={() => setI(idx)}
                  aria-label={`Go to question ${idx + 1}`}
                  className={cn(
                    "tabular relative grid h-7 place-items-center rounded text-[11px] font-medium transition-colors",
                    idx === i
                      ? "bg-ink text-navy-900"
                      : answers[pq.id] != null
                        ? "bg-navy-700 text-ink"
                        : "bg-navy-800/60 text-ink-faint hover:bg-navy-800"
                  )}
                >
                  {idx + 1}
                  {flags[pq.id] && <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-amber" />}
                </button>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => (unanswered > 0 ? setConfirming(true) : submit())}>
              Submit test
            </Button>
          </CardBody>
        </Card>
      </aside>

      {confirming && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 px-4" onClick={() => setConfirming(false)}>
          <div
            role="dialog"
            aria-label="Submit test?"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-asphalt/[0.1] bg-navy-850 p-6 shadow-pop"
          >
            <h3 className="text-lg font-semibold text-ink">Submit with {unanswered} unanswered?</h3>
            <p className="mt-2 text-sm text-ink-muted">Unanswered questions are marked wrong. You still have {mm}:{ss} left.</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirming(false)}>
                Keep going
              </Button>
              <Button onClick={submit}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MockTestPage() {
  return (
    <ClientOnly fallback={<div className="h-96 animate-pulse rounded-xl bg-navy-850" />}>
      <MockInner />
    </ClientOnly>
  );
}
