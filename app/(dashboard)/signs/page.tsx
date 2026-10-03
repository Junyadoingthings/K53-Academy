"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Layers, Timer, ChevronLeft, ChevronRight, RotateCw, Zap, Flame } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { SIGNS, SIGN_CATEGORIES } from "@/lib/data/signs";
import { shuffle } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { RoadSign } from "@/lib/data/types";

type Tab = "library" | "flashcards" | "rush";

const catTone: Record<string, "signal" | "amber" | "grass" | "cyan" | "muted"> = {
  Regulatory: "signal",
  Warning: "amber",
  Guidance: "grass",
  Information: "cyan",
  Temporary: "amber",
};

export default function SignsPage() {
  const [tab, setTab] = React.useState<Tab>("library");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Road Signs Trainer</h1>
        <p className="mt-1 text-ink-muted">
          The complete SA sign library — drawn to SARTSM spec. Study, flip, then test your reflexes.
        </p>
      </div>

      <div className="flex gap-2 rounded-xl border border-asphalt/[0.10] bg-navy-850/60 p-1">
        {(
          [
            { id: "library", label: "Library", icon: LayoutGrid },
            { id: "flashcards", label: "Flashcards", icon: Layers },
            { id: "rush", label: "Sign Rush", icon: Timer },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              tab === t.id ? "bg-cyan text-navy-950 shadow-neon" : "text-ink-muted hover:text-ink"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "library" && <Library />}
      {tab === "flashcards" && <Flashcards />}
      {tab === "rush" && (
        <ClientOnly fallback={<div className="h-80 animate-pulse rounded-2xl bg-navy-850/70" />}>
          <SignRush />
        </ClientOnly>
      )}
    </div>
  );
}

function Library() {
  const [cat, setCat] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");

  const filtered = SIGNS.filter(
    (s) =>
      (cat === "All" || s.category === cat) &&
      (query === "" || s.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["All", ...SIGN_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all",
              cat === c
                ? "border-cyan/50 bg-cyan/10 text-cyan"
                : "border-asphalt/15 text-ink-muted hover:text-ink"
            )}
          >
            {c}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search signs…"
          className="ml-auto rounded-lg border border-asphalt/15 bg-navy-800/60 px-3 py-1.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-cyan/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((sign, i) => (
          <motion.div
            key={sign.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <Card className="group h-full">
              <CardBody className="flex flex-col items-center p-4 text-center">
                <div className="transition-transform group-hover:scale-110">
                  <RoadSignSVG sign={sign} size={84} />
                </div>
                <div className="mt-3 font-heading text-sm font-semibold text-ink">{sign.name}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <Pill tone={catTone[sign.category]}>{sign.category}</Pill>
                  <span className="font-mono text-[10px] text-ink-faint">{sign.code}</span>
                </div>
                <p className="mt-2 text-xs leading-snug text-ink-muted">{sign.meaning}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Flashcards() {
  const [deck] = React.useState(() => shuffle(SIGNS, 7));
  const [i, setI] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const sign = deck[i];

  function go(dir: 1 | -1) {
    setFlipped(false);
    setI((v) => (v + dir + deck.length) % deck.length);
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="text-center font-mono text-xs text-ink-faint">
        Card {i + 1} / {deck.length} · tap to flip
      </div>
      <div className="[perspective:1200px]">
        <motion.button
          onClick={() => setFlipped((f) => !f)}
          className="relative block h-80 w-full [transform-style:preserve-3d] transition-transform duration-500"
          animate={{ rotateY: flipped ? 180 : 0 }}
        >
          {/* front */}
          <Card
            glow="cyan"
            className="absolute inset-0 grid place-items-center [backface-visibility:hidden]"
          >
            <div className="flex flex-col items-center">
              <RoadSignSVG sign={sign} size={150} />
              <div className="mt-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
                What does this mean?
              </div>
            </div>
          </Card>
          {/* back */}
          <Card
            glow="grass"
            className="absolute inset-0 grid place-items-center p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <div>
              <Pill tone={catTone[sign.category]}>{sign.category}</Pill>
              <h3 className="mt-3 font-heading text-xl font-bold text-ink">{sign.name}</h3>
              <p className="mt-2 text-sm text-ink-muted">{sign.meaning}</p>
              <div className="mt-3 font-mono text-[10px] text-ink-faint">{sign.code}</div>
            </div>
          </Card>
        </motion.button>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => go(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" onClick={() => setFlipped((f) => !f)}>
          <RotateCw className="h-4 w-4" /> Flip
        </Button>
        <Button variant="outline" size="icon" onClick={() => go(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SignRush() {
  const awardXp = useStore((s) => s.awardXp);
  const [phase, setPhase] = React.useState<"idle" | "playing" | "over">("idle");
  const [time, setTime] = React.useState(60);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [q, setQ] = React.useState<{ sign: RoadSign; options: string[] } | null>(null);
  const [picked, setPicked] = React.useState<string | null>(null);

  const nextQ = React.useCallback(() => {
    const sign = SIGNS[Math.floor(Math.random() * SIGNS.length)];
    const distractors = shuffle(SIGNS.filter((s) => s.id !== sign.id))
      .slice(0, 3)
      .map((s) => s.name);
    setQ({ sign, options: shuffle([sign.name, ...distractors]) });
    setPicked(null);
  }, []);

  React.useEffect(() => {
    if (phase !== "playing") return;
    if (time <= 0) {
      setPhase("over");
      awardXp(score * 3, "Sign Rush");
      return;
    }
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time, score, awardXp]);

  function start() {
    setScore(0);
    setStreak(0);
    setTime(60);
    setPhase("playing");
    nextQ();
  }

  function answer(name: string) {
    if (picked) return;
    setPicked(name);
    const correct = name === q!.sign.name;
    if (correct) {
      setScore((s) => s + 1 + Math.floor(streak / 3));
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setTimeout(nextQ, 550);
  }

  if (phase === "idle" || phase === "over") {
    return (
      <Card glow="amber" className="mx-auto max-w-md">
        <CardBody className="p-8 text-center">
          <Timer className="mx-auto h-12 w-12 text-amber" />
          <h2 className="mt-3 font-heading text-2xl font-bold text-ink">
            {phase === "over" ? "Time's up!" : "Sign Rush"}
          </h2>
          {phase === "over" ? (
            <>
              <p className="mt-1 text-ink-muted">You identified</p>
              <div className="my-3 font-mono text-5xl font-bold text-amber">
                <CountUp value={score} />
              </div>
              <div className="flex items-center justify-center gap-2 text-cyan">
                <Zap className="h-4 w-4" fill="currentColor" /> +{score * 3} XP earned
              </div>
            </>
          ) : (
            <p className="mt-2 text-ink-muted">
              Identify as many signs as you can in 60 seconds. Build a streak for bonus points!
            </p>
          )}
          <Button variant="amber" className="mt-6 w-full" onClick={start}>
            {phase === "over" ? "Play again" : "Start Sign Rush"}
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <Pill tone="cyan">Score: {score}</Pill>
        {streak >= 3 && (
          <Pill tone="amber">
            <Flame className="h-3 w-3" fill="currentColor" /> {streak} streak
          </Pill>
        )}
        <div className="relative h-9 w-9">
          <svg className="-rotate-90" viewBox="0 0 36 36" width={36} height={36}>
            <circle cx="18" cy="18" r="15" fill="none" stroke="#E8DECF" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={time <= 10 ? "#E4002B" : "#E4002B"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 15}
              strokeDashoffset={2 * Math.PI * 15 * (1 - time / 60)}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-mono text-xs font-bold text-ink">
            {time}
          </span>
        </div>
      </div>

      <Card className="grid place-items-center py-8">
        {q && <RoadSignSVG sign={q.sign} size={130} />}
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        {q?.options.map((opt) => {
          const isRight = opt === q.sign.name;
          const state = !picked ? "idle" : isRight ? "right" : opt === picked ? "wrong" : "dim";
          return (
            <button
              key={opt}
              onClick={() => answer(opt)}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm font-medium transition-all",
                state === "idle" && "border-asphalt/15 bg-navy-800/50 hover:border-cyan/50",
                state === "right" && "border-grass/60 bg-grass/10 text-grass",
                state === "wrong" && "border-signal/60 bg-signal/10 text-signal-soft",
                state === "dim" && "border-asphalt/[0.06] opacity-40"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
