"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Layers,
  LayoutGrid,
  RotateCw,
  Search,
  Shuffle,
  Timer,
  X,
  Zap,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { PageHeader, Segmented } from "@/components/ui/page-header";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { SIGNS, SIGN_CATEGORIES, signById, signGroups } from "@/lib/data/signs";
import { cn, shuffle } from "@/lib/utils";
import type { RoadSign } from "@/lib/data/types";

type Tab = "library" | "flashcards" | "rush";

const CATEGORY_NOTE: Record<string, string> = {
  Regulatory: "Signs you must obey — control, command, prohibition and reservation.",
  Warning: "Red-bordered triangles that tell you about a hazard ahead.",
  Information: "Useful information about the road ahead.",
  Temporary: "Yellow signs used at roadworks. They override permanent signs.",
};

export default function SignsPage() {
  return (
    <React.Suspense fallback={null}>
      <SignsInner />
    </React.Suspense>
  );
}

function SignsInner() {
  const [tab, setTab] = React.useState<Tab>("library");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Road signs"
        description={`All ${SIGNS.length} signs reproduced from the SADC Road Traffic Signs Manual. Learn them in the library, drill with flashcards, then test your speed.`}
      />

      <Segmented
        value={tab}
        onChange={setTab}
        className="w-full sm:w-auto [&>button]:flex-1 sm:[&>button]:flex-none"
        options={[
          { id: "library", label: "Library", icon: LayoutGrid },
          { id: "flashcards", label: "Flashcards", icon: Layers },
          { id: "rush", label: "Sign Rush", icon: Timer },
        ]}
      />

      {tab === "library" && <Library />}
      {tab === "flashcards" && (
        <ClientOnly fallback={<div className="h-96 animate-pulse rounded-xl bg-navy-850" />}>
          <Flashcards />
        </ClientOnly>
      )}
      {tab === "rush" && (
        <ClientOnly fallback={<div className="h-80 animate-pulse rounded-xl bg-navy-850" />}>
          <SignRush />
        </ClientOnly>
      )}
    </div>
  );
}

/* ─────────────────────────── Library ─────────────────────────── */

function Library() {
  const params = useSearchParams();
  const [cat, setCat] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<RoadSign | null>(null);

  React.useEffect(() => {
    const id = params.get("sign");
    if (id) setOpen(signById(id) ?? null);
  }, [params]);

  const q = query.trim().toLowerCase();
  const filtered = SIGNS.filter(
    (s) =>
      (cat === "All" || s.category === cat) &&
      (!q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q))
  );

  const groups = (cat === "All" ? SIGN_CATEGORIES : [cat]).flatMap((c) =>
    signGroups(c).map((g) => ({ category: c, group: g, signs: filtered.filter((s) => s.category === c && s.group === g) }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
          {["All", ...SIGN_CATEGORIES].map((c) => {
            const count = c === "All" ? SIGNS.length : SIGNS.filter((s) => s.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                  cat === c
                    ? "border-ink bg-ink text-navy-900"
                    : "border-asphalt/[0.12] bg-navy-850 text-ink-muted hover:text-ink"
                )}
              >
                {c}
                <span className={cn("tabular text-[11px]", cat === c ? "text-navy-900/60" : "text-ink-faint")}>{count}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block xl:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, code or meaning"
            className="h-9 w-full rounded-lg border border-asphalt/[0.12] bg-navy-850 pl-9 pr-3 text-sm text-ink shadow-card outline-none placeholder:text-ink-faint focus:border-cyan/50"
          />
        </label>
      </div>

      {cat !== "All" && <p className="-mt-2 text-sm text-ink-muted">{CATEGORY_NOTE[cat]}</p>}

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-asphalt/[0.15] py-16 text-center text-sm text-ink-muted">
          No signs match “{query}”.
        </div>
      )}

      {groups
        .filter((g) => g.signs.length > 0)
        .map((g) => (
          <section key={`${g.category}-${g.group}`}>
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="text-sm font-semibold text-ink">{g.group}</h2>
              <span className="text-xs text-ink-faint">
                {g.category} · {g.signs.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {g.signs.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => setOpen(sign)}
                  className="group flex flex-col rounded-xl border border-asphalt/[0.09] bg-navy-850 p-4 text-left shadow-card transition-[border-color,box-shadow] hover:border-asphalt/[0.18] hover:shadow-raised"
                >
                  <div className="grid h-24 place-items-center">
                    <RoadSignSVG sign={sign} size={84} className="transition-transform duration-200 group-hover:scale-[1.04]" />
                  </div>
                  <div className="mt-3 text-sm font-medium leading-snug text-ink">{sign.name}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-ink-faint">{sign.code}</div>
                </button>
              ))}
            </div>
          </section>
        ))}

      <SignDetail sign={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function SignDetail({ sign, onClose }: { sign: RoadSign | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!sign) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [sign, onClose]);

  return (
    <AnimatePresence>
      {sign && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-label={sign.name}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-t-2xl border border-asphalt/[0.1] bg-navy-850 shadow-pop sm:rounded-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md text-ink-muted hover:bg-navy-800 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="grid place-items-center bg-navy-800/60 py-10">
              <RoadSignSVG sign={sign} size={168} />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Pill>{sign.category}</Pill>
                <Pill>{sign.group}</Pill>
                <span className="ml-auto font-mono text-xs text-ink-faint">{sign.code}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">{sign.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{sign.meaning}</p>
              {sign.action && (
                <div className="mt-4 rounded-lg border border-asphalt/[0.08] bg-navy-800/60 p-3.5">
                  <div className="text-xs font-semibold text-ink">What to do</div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{sign.action}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Flashcards ───────────────────────── */

function Flashcards() {
  const [cat, setCat] = React.useState<string>("All");
  const [deck, setDeck] = React.useState<RoadSign[]>(() => shuffle(SIGNS));
  const [i, setI] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const sign = deck[i];

  const rebuild = React.useCallback((c: string) => {
    setDeck(shuffle(c === "All" ? SIGNS : SIGNS.filter((s) => s.category === c)));
    setI(0);
    setFlipped(false);
  }, []);

  const go = React.useCallback(
    (dir: 1 | -1) => {
      setFlipped(false);
      setI((v) => (v + dir + deck.length) % deck.length);
    },
    [deck.length]
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center justify-between gap-3">
        <select
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            rebuild(e.target.value);
          }}
          className="h-9 rounded-lg border border-asphalt/[0.12] bg-navy-850 px-2.5 text-sm text-ink shadow-card outline-none"
          aria-label="Deck"
        >
          {["All", ...SIGN_CATEGORIES].map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All signs" : c}
            </option>
          ))}
        </select>
        <div className="tabular text-xs text-ink-faint">
          {i + 1} / {deck.length}
        </div>
        <Button variant="ghost" size="sm" onClick={() => rebuild(cat)}>
          <Shuffle className="h-4 w-4" /> Shuffle
        </Button>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-navy-700">
        <div className="h-full bg-ink transition-[width]" style={{ width: `${((i + 1) / deck.length) * 100}%` }} />
      </div>

      <div className="[perspective:1200px]">
        <motion.button
          onClick={() => setFlipped((f) => !f)}
          className="relative block h-[22rem] w-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          aria-label={flipped ? "Show sign" : "Reveal meaning"}
        >
          <Card className="absolute inset-0 grid place-items-center [backface-visibility:hidden]">
            <div className="flex flex-col items-center">
              <RoadSignSVG sign={sign} size={176} />
              <div className="mt-6 text-sm text-ink-faint">What does this sign mean?</div>
            </div>
          </Card>
          <Card className="absolute inset-0 flex flex-col justify-center p-7 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex items-center gap-2">
              <Pill>{sign.group}</Pill>
              <span className="font-mono text-xs text-ink-faint">{sign.code}</span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{sign.name}</h3>
            <p className="mt-2 leading-relaxed text-ink-muted">{sign.meaning}</p>
            {sign.action && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{sign.action}</p>}
          </Card>
        </motion.button>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Previous card">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" onClick={() => setFlipped((f) => !f)}>
          <RotateCw className="h-4 w-4" /> Flip
        </Button>
        <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Next card">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <p className="hidden text-center text-xs text-ink-faint sm:block">Space to flip · ← → to move</p>
    </div>
  );
}

/* ───────────────────────── Sign Rush ───────────────────────── */

const RUSH_SECONDS = 60;

function SignRush() {
  const awardXp = useStore((s) => s.awardXp);
  const [phase, setPhase] = React.useState<"idle" | "playing" | "over">("idle");
  const [time, setTime] = React.useState(RUSH_SECONDS);
  const [score, setScore] = React.useState(0);
  const [answered, setAnswered] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [q, setQ] = React.useState<{ sign: RoadSign; options: string[] } | null>(null);
  const [picked, setPicked] = React.useState<string | null>(null);

  const nextQ = React.useCallback(() => {
    const sign = SIGNS[Math.floor(Math.random() * SIGNS.length)];
    // Prefer look-alike distractors from the same category.
    const same = shuffle(SIGNS.filter((s) => s.id !== sign.id && s.category === sign.category));
    const other = shuffle(SIGNS.filter((s) => s.id !== sign.id && s.category !== sign.category));
    const distractors = [...same, ...other].slice(0, 3).map((s) => s.name);
    setQ({ sign, options: shuffle([sign.name, ...distractors]) });
    setPicked(null);
  }, []);

  React.useEffect(() => {
    if (phase !== "playing") return;
    if (time <= 0) {
      setPhase("over");
      if (score > 0) awardXp(score * 3, "Sign Rush");
      return;
    }
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time, score, awardXp]);

  function start() {
    setScore(0);
    setAnswered(0);
    setStreak(0);
    setTime(RUSH_SECONDS);
    setPhase("playing");
    nextQ();
  }

  function answer(name: string) {
    if (picked || !q) return;
    setPicked(name);
    setAnswered((a) => a + 1);
    if (name === q.sign.name) {
      setScore((s) => s + 1 + Math.floor(streak / 3));
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setTimeout(nextQ, 600);
  }

  if (phase !== "playing") {
    return (
      <Card className="mx-auto max-w-md">
        <CardBody className="p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber/10 text-amber">
            <Timer className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
            {phase === "over" ? "Time's up" : "Sign Rush"}
          </h2>
          {phase === "over" ? (
            <>
              <div className="mt-4 tabular text-5xl font-semibold tracking-tight text-ink">
                <CountUp value={score} />
              </div>
              <p className="mt-1 text-sm text-ink-muted">points from {answered} signs</p>
              {score > 0 && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cyan">
                  <Zap className="h-4 w-4" fill="currentColor" /> +{score * 3} XP
                </div>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Name as many signs as you can in {RUSH_SECONDS} seconds. Every three in a row earns a bonus point.
            </p>
          )}
          <Button className="mt-6 w-full" onClick={start}>
            {phase === "over" ? "Play again" : "Start"}
          </Button>
        </CardBody>
      </Card>
    );
  }

  const pct = time / RUSH_SECONDS;
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-ink-muted">
          Score <span className="tabular font-semibold text-ink">{score}</span>
        </div>
        {streak >= 3 && (
          <Pill tone="amber">
            <Flame className="h-3 w-3" fill="currentColor" /> {streak} in a row
          </Pill>
        )}
        <div className={cn("tabular text-sm font-semibold", time <= 10 ? "text-cyan" : "text-ink")}>{time}s</div>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-navy-700">
        <div
          className={cn("h-full transition-[width] duration-1000 ease-linear", time <= 10 ? "bg-cyan" : "bg-ink")}
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      <Card className="grid place-items-center py-10">{q && <RoadSignSVG sign={q.sign} size={150} />}</Card>

      <div className="grid gap-2 sm:grid-cols-2">
        {q?.options.map((opt) => {
          const isRight = opt === q.sign.name;
          const state = !picked ? "idle" : isRight ? "right" : opt === picked ? "wrong" : "dim";
          return (
            <button
              key={opt}
              onClick={() => answer(opt)}
              className={cn(
                "rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition-colors",
                state === "idle" && "border-asphalt/[0.12] bg-navy-850 text-ink hover:border-asphalt/25 hover:bg-navy-800",
                state === "right" && "border-grass/50 bg-grass/10 text-grass",
                state === "wrong" && "border-cyan/50 bg-cyan/10 text-cyan",
                state === "dim" && "border-asphalt/[0.06] text-ink-faint opacity-60"
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
