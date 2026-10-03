"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Lightbulb, RotateCcw, XCircle } from "lucide-react";
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
import { roomBySlug, ROOMS } from "@/lib/data/rooms";
import { PATHS } from "@/lib/data/paths";
import { questionById } from "@/lib/data/questions";
import type { Room } from "@/lib/data/types";
import { XP_REWARDS } from "@/lib/xp-engine";

type Phase = "learn" | "quiz" | "result";
const PASS_PCT = 60;

function RoomView({ slug }: { slug: string }) {
  const room = roomBySlug(slug);
  const completeRoom = useStore((s) => s.completeRoom);
  const touchStreak = useStore((s) => s.touchStreak);
  const myCode = useStore((s) => s.profile.code);
  const alreadyDone = useStore((s) => (room ? s.completedRooms.includes(room.id) : false));
  const [phase, setPhase] = React.useState<Phase>("learn");
  const [result, setResult] = React.useState<QuizResult | null>(null);
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [phase]);

  if (!room) return notFound();
  const questions = room.questionIds.map((id) => questionById(id)!).filter(Boolean);
  const videos = videosForRoom(room.slug);

  // The path this lesson belongs to (prefer the learner's own code).
  const path =
    PATHS.find((p) => p.roomIds.includes(room.id) && p.codes.includes(myCode)) ??
    PATHS.find((p) => p.roomIds.includes(room.id));
  const nextInPath = path ? roomById(path.roomIds[path.roomIds.indexOf(room.id) + 1]) : undefined;

  function finish(r: QuizResult) {
    setResult(r);
    setPhase("result");
    if ((r.correct / r.total) * 100 >= PASS_PCT) {
      completeRoom(room!.id, r.perfect);
      touchStreak();
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={path ? `/paths/${path.slug}` : "/paths"}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> {path ? path.title : "Learning paths"}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Pill>{room.category}</Pill>
          <DifficultyPill level={room.difficulty} />
          {alreadyDone && (
            <Pill tone="grass">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </Pill>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{room.title}</h1>
        <p className="mt-2 text-ink-muted">{room.tagline}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-ink-faint">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {room.estMinutes} min
          </span>
          <span>{questions.length} questions</span>
          <span>{room.xp} XP</span>
        </div>
      </header>

      <div className="mt-8">
        {phase === "learn" && (
          <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-[17px] leading-relaxed text-ink">{room.intro}</p>

            <div className="mt-10 space-y-10">
              {room.sections.map((sec, i) => (
                <section key={i}>
                  <div className="flex items-baseline gap-3">
                    <span className="tabular text-sm font-medium text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="text-xl font-semibold tracking-tight text-ink">{sec.heading}</h2>
                  </div>
                  <p className="mt-3 leading-relaxed text-ink-muted">{sec.body}</p>
                  {sec.tip && (
                    <div className="mt-4 flex gap-3 rounded-lg border-l-2 border-amber bg-amber/[0.07] px-4 py-3 text-sm">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                      <div>
                        <div className="font-medium text-ink">Exam tip</div>
                        <div className="mt-0.5 text-ink-muted">{sec.tip}</div>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {videos.length > 0 && (
              <div className="mt-10">
                <VideoSection videos={videos} />
              </div>
            )}

            <div className="sticky bottom-20 z-10 mt-10 lg:bottom-6">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-asphalt/[0.1] bg-navy-850/95 p-3 pl-4 shadow-pop backdrop-blur">
                <div className="text-sm">
                  <div className="font-medium text-ink">Ready to check what you learnt?</div>
                  <div className="text-ink-faint">
                    {questions.length} questions · {PASS_PCT}% to complete
                  </div>
                </div>
                <Button onClick={() => setPhase("quiz")}>
                  Start quiz <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.article>
        )}

        {phase === "quiz" && (
          <Card>
            <CardBody className="p-5 sm:p-7">
              <QuizEngine key={attempt} questions={questions} onComplete={finish} />
            </CardBody>
          </Card>
        )}

        {phase === "result" && result && (
          <ResultCard
            room={room}
            result={result}
            newlyCompleted={!alreadyDone}
            nextRoom={nextInPath}
            onReview={() => setPhase("learn")}
            onRetry={() => {
              setAttempt((a) => a + 1);
              setPhase("quiz");
            }}
          />
        )}
      </div>
    </div>
  );
}

function roomById(id?: string): Room | undefined {
  return id ? ROOMS.find((r) => r.id === id) : undefined;
}

function ResultCard({
  room,
  result,
  newlyCompleted,
  nextRoom,
  onRetry,
  onReview,
}: {
  room: Room;
  result: QuizResult;
  newlyCompleted: boolean;
  nextRoom?: Room;
  onRetry: () => void;
  onReview: () => void;
}) {
  const pct = Math.round((result.correct / result.total) * 100);
  const pass = pct >= PASS_PCT;
  const xpEarned =
    (pass && newlyCompleted ? room.xp + (result.perfect ? XP_REWARDS.perfectRoom : 0) : 0) +
    result.correct * XP_REWARDS.questionCorrect;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      {pass && <ConfettiBurst count={60} origin="top" />}
      <Card>
        <CardBody className="p-8 text-center sm:p-10">
          {pass ? (
            <CheckCircle2 className="mx-auto h-12 w-12 text-grass" />
          ) : (
            <XCircle className="mx-auto h-12 w-12 text-ink-faint" />
          )}
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
            {result.perfect ? "Perfect score" : pass ? "Lesson complete" : "Not quite there yet"}
          </h2>
          <p className="mt-2 text-ink-muted">
            You got <span className="font-medium text-ink">{result.correct} of {result.total}</span> correct ({pct}%).
            {!pass && ` You need ${PASS_PCT}% to complete this lesson.`}
          </p>

          <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 divide-x divide-asphalt/[0.08] rounded-lg border border-asphalt/[0.09]">
            <div className="p-3">
              <div className="tabular text-xl font-semibold text-ink">{pct}%</div>
              <div className="text-xs text-ink-faint">Score</div>
            </div>
            <div className="p-3">
              <div className="tabular text-xl font-semibold text-ink">
                +<CountUp value={xpEarned} />
              </div>
              <div className="text-xs text-ink-faint">XP earned</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {pass ? (
              <>
                <Button variant="outline" onClick={onRetry}>
                  <RotateCcw className="h-4 w-4" /> Retake quiz
                </Button>
                {nextRoom ? (
                  <Link href={`/rooms/${nextRoom.slug}`}>
                    <Button className="w-full">
                      Next: {nextRoom.title} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/mock-test">
                    <Button className="w-full">
                      Try a mock test <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onReview}>
                  Review the lesson
                </Button>
                <Button onClick={onRetry}>
                  <RotateCcw className="h-4 w-4" /> Try again
                </Button>
              </>
            )}
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
    <ClientOnly fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-xl bg-navy-850" />}>
      <RoomView slug={slug} />
    </ClientOnly>
  );
}
