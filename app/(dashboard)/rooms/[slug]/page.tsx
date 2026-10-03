"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Zap, Lightbulb, PlayCircle, Trophy, RotateCcw, CheckCircle2 } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { ConfettiBurst } from "@/components/effects/confetti";
import { VideoSection } from "@/components/rooms/video-section";
import { videosForRoom } from "@/lib/data/videos";
import { Button } from "@/components/ui/button";
import { Pill, DifficultyPill } from "@/components/ui/pill";
import { QuizEngine, type QuizResult } from "@/components/quiz/quiz-engine";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { roomBySlug } from "@/lib/data/rooms";
import { questionById } from "@/lib/data/questions";
import type { Room } from "@/lib/data/types";
import { XP_REWARDS } from "@/lib/xp-engine";

type Phase = "learn" | "quiz" | "result";

function RoomView({ slug }: { slug: string }) {
  const room = roomBySlug(slug);
  const completeRoom = useStore((s) => s.completeRoom);
  const touchStreak = useStore((s) => s.touchStreak);
  const alreadyDone = useStore((s) => (room ? s.completedRooms.includes(room.id) : false));
  const [phase, setPhase] = React.useState<Phase>("learn");
  const [result, setResult] = React.useState<QuizResult | null>(null);

  if (!room) return notFound();
  const questions = room.questionIds.map((id) => questionById(id)!).filter(Boolean);
  const videos = videosForRoom(room.slug);

  function finish(r: QuizResult) {
    setResult(r);
    setPhase("result");
    const pass = r.correct / r.total >= 0.6;
    if (pass) {
      completeRoom(room!.id, r.perfect);
      touchStreak();
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/paths" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-cyan">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Pill tone="cyan">{room.category}</Pill>
          <DifficultyPill level={room.difficulty} />
          {alreadyDone && (
            <Pill tone="grass">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </Pill>
          )}
        </div>
        <h1 className="mt-2 font-heading text-3xl font-bold text-ink">{room.title}</h1>
        <p className="mt-1 text-ink-muted">{room.tagline}</p>
        <div className="mt-3 flex items-center gap-3 text-sm text-ink-faint">
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {room.estMinutes} min</span>
          <span className="inline-flex items-center gap-1 text-cyan"><Zap className="h-4 w-4" /> {room.xp} XP</span>
        </div>
      </div>

      {phase === "learn" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card glow="cyan">
            <CardBody className="p-5">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-cyan">
                Intro
              </div>
              <p className="leading-relaxed text-ink">{room.intro}</p>
            </CardBody>
          </Card>

          {room.sections.map((sec, i) => (
            <Card key={i}>
              <CardBody className="p-5">
                <h3 className="font-heading text-lg font-semibold text-ink">{sec.heading}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{sec.body}</p>
                {sec.tip && (
                  <div className="mt-3 flex gap-2 rounded-xl border border-amber/20 bg-amber/[0.05] p-3 text-sm text-amber-soft">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                    <span>{sec.tip}</span>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}

          {videos.length > 0 && <VideoSection videos={videos} />}

          <div className="sticky bottom-24 lg:bottom-6">
            <Button size="lg" className="w-full" onClick={() => setPhase("quiz")}>
              <PlayCircle className="h-5 w-5" /> Start the quiz ({questions.length} questions)
            </Button>
          </div>
        </motion.div>
      )}

      {phase === "quiz" && (
        <Card>
          <CardBody className="p-5">
            <QuizEngine questions={questions} onComplete={finish} />
          </CardBody>
        </Card>
      )}

      {phase === "result" && result && (
        <ResultCard room={room} result={result} onRetry={() => setPhase("quiz")} newlyCompleted={!alreadyDone} />
      )}
    </div>
  );
}

function ResultCard({
  room,
  result,
  onRetry,
  newlyCompleted,
}: {
  room: Room;
  result: QuizResult;
  onRetry: () => void;
  newlyCompleted: boolean;
}) {
  const pct = Math.round((result.correct / result.total) * 100);
  const pass = pct >= 60;
  const xpEarned =
    (pass && newlyCompleted ? room.xp + (result.perfect ? XP_REWARDS.perfectRoom : 0) : 0) +
    result.correct * XP_REWARDS.questionCorrect;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
      {pass && <ConfettiBurst count={90} origin="top" />}
      <Card glow={pass ? "grass" : "signal"}>
        <CardBody className="p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-grass/10 text-grass">
            <Trophy className="h-8 w-8" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-bold text-ink">
            {result.perfect ? "Flawless!" : pass ? "Room cleared!" : "Almost there"}
          </h2>
          <p className="mt-1 text-ink-muted">
            You scored{" "}
            <span className={pass ? "text-grass" : "text-signal-soft"}>
              {result.correct}/{result.total}
            </span>{" "}
            ({pct}%)
          </p>

          <div className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-cyan/20 bg-cyan/[0.05] py-3">
            <Zap className="h-5 w-5 text-cyan" fill="currentColor" />
            <span className="font-mono text-2xl font-bold text-cyan">
              +<CountUp value={xpEarned} /> XP
            </span>
          </div>

          {!pass && (
            <p className="mt-3 text-sm text-ink-faint">
              You need 60% to clear the room. Review the material and try again.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={onRetry}>
              <RotateCcw className="h-4 w-4" /> Retry quiz
            </Button>
            <Link href="/paths">
              <Button className="w-full">Continue journey</Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default function RoomPage() {
  const params = useParams();
  const slug = String(params.slug);
  return (
    <ClientOnly fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-2xl bg-navy-850/70" />}>
      <RoomView slug={slug} />
    </ClientOnly>
  );
}
