"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { iconFor } from "@/components/ui/icon";
import { ArrowRight, Check, CheckCircle2, ChevronRight, Flame, Sparkles } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, DifficultyPill } from "@/components/ui/pill";
import { PageHeader } from "@/components/ui/page-header";
import { StatTile } from "@/components/dashboard/stat-tile";
import { WeeklyXpChart, ExamReadiness } from "@/components/dashboard/charts";
import { BadgeMedal } from "@/components/gamification/badge-medal";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";
import { PATHS } from "@/lib/data/paths";
import { ROOMS, roomById } from "@/lib/data/rooms";
import { BADGES } from "@/lib/data/badges";
import { cn, daysUntil } from "@/lib/utils";

const CODE_LABEL = { "1": "Code 1 · Motorcycle", "2": "Code 2 · Light motor vehicle", "3": "Code 3 · Heavy motor vehicle" };

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function DashboardInner() {
  const profile = useStore((s) => s.profile);
  const streak = useStore((s) => s.streak);
  const lastStudyDay = useStore((s) => s.lastStudyDay);
  const completedRooms = useStore((s) => s.completedRooms);
  const badges = useStore((s) => s.badges);
  const categoryStats = useStore((s) => s.categoryStats);
  const dailyDone = useStore((s) => s.dailyChallengeDoneOn);
  const touchStreak = useStore((s) => s.touchStreak);

  const account = useAuth((s) => s.currentAccount());
  const name = profile.username || (account && !account.guest ? account.name.split(" ")[0] : "");
  const today = new Date().toISOString().slice(0, 10);
  const checkedIn = lastStudyDay === today;
  const didDaily = dailyDone === today;

  const activePath = PATHS.find((p) => p.codes.includes(profile.code)) ?? PATHS[0];
  const pathRooms = activePath.roomIds.map((id) => roomById(id)!).filter(Boolean);
  const doneCount = pathRooms.filter((r) => completedRooms.includes(r.id)).length;
  const pathPct = Math.round((doneCount / pathRooms.length) * 100);
  const nextRoom = pathRooms.find((r) => !completedRooms.includes(r.id)) ?? pathRooms[0];

  const totalCorrect = Object.values(categoryStats).reduce((a, c) => a + c.correct, 0);
  const totalAns = Object.values(categoryStats).reduce((a, c) => a + c.total, 0);
  const accuracy = totalAns > 0 ? Math.round((totalCorrect / totalAns) * 100) : null;
  const dTest = daysUntil(profile.testDate);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={CODE_LABEL[profile.code]}
        title={name ? `${greeting()}, ${name}` : greeting()}
        description={
          dTest != null && dTest >= 0
            ? `${dTest === 0 ? "Your test is today" : `${dTest} day${dTest === 1 ? "" : "s"} until your test`}. ${
                pathPct < 100 ? `You're ${pathPct}% through ${activePath.title}.` : `You've finished ${activePath.title}.`
              }`
            : pathPct < 100
              ? `You're ${pathPct}% through ${activePath.title}. A short lesson today keeps you on track.`
              : `You've finished ${activePath.title}. Time to prove it in a mock test.`
        }
        actions={
          <>
            {checkedIn ? (
              <span className="inline-flex h-10 items-center gap-1.5 px-2 text-sm text-ink-muted">
                <CheckCircle2 className="h-4 w-4 text-grass" /> Checked in today
              </span>
            ) : (
              <Button variant="outline" onClick={touchStreak}>
                <Flame className="h-4 w-4 text-amber" /> Check in
              </Button>
            )}
            <Link href={`/rooms/${nextRoom.slug}`}>
              <Button>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon="Flame"
          tone="amber"
          label="Study streak"
          value={
            <>
              <CountUp value={streak} /> <span className="text-base font-normal text-ink-muted">day{streak === 1 ? "" : "s"}</span>
            </>
          }
          sub={checkedIn ? "Done for today" : "Check in to keep it going"}
        />
        <StatTile
          icon="BookOpenCheck"
          label="Lessons completed"
          value={
            <>
              <CountUp value={completedRooms.length} />
              <span className="text-base font-normal text-ink-faint"> / {ROOMS.length}</span>
            </>
          }
        />
        <StatTile
          icon="Target"
          tone="grass"
          label="Accuracy"
          value={accuracy == null ? "—" : <><CountUp value={accuracy} />%</>}
          sub={totalAns > 0 ? `${totalCorrect} of ${totalAns} correct` : "Answer some questions"}
        />
        <StatTile
          icon="CalendarClock"
          tone="cyan"
          label="Test date"
          value={dTest != null && dTest >= 0 ? <><CountUp value={dTest} /> <span className="text-base font-normal text-ink-muted">days</span></> : "Not set"}
          sub={dTest != null && dTest >= 0 ? new Date(profile.testDate!).toLocaleDateString("en-ZA", { day: "numeric", month: "long" }) : "Add it in your profile"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* Continue learning */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{activePath.title}</CardTitle>
                <p className="mt-1 text-sm text-ink-muted">{activePath.subtitle}</p>
              </div>
              <Link href={`/paths/${activePath.slug}`} className="shrink-0 text-sm text-ink-muted hover:text-ink">
                View path
              </Link>
            </CardHeader>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-700">
                  <div className="h-full rounded-full bg-cyan transition-[width] duration-700" style={{ width: `${pathPct}%` }} />
                </div>
                <span className="tabular text-xs text-ink-muted">
                  {doneCount}/{pathRooms.length}
                </span>
              </div>

              <ol className="mt-5 divide-y divide-asphalt/[0.07] rounded-lg border border-asphalt/[0.08]">
                {pathRooms.map((room, i) => {
                  const done = completedRooms.includes(room.id);
                  const isNext = room.id === nextRoom.id && !done;
                  const Icon = iconFor(room.icon, BookOpen);
                  return (
                    <li key={room.id}>
                      <Link
                        href={`/rooms/${room.slug}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-navy-800/60",
                          isNext && "bg-navy-800/40"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold",
                            done
                              ? "bg-grass/10 text-grass"
                              : isNext
                                ? "bg-cyan text-white"
                                : "bg-navy-800 text-ink-faint"
                          )}
                        >
                          {done ? <Check className="h-4 w-4" /> : isNext ? <Icon className="h-4 w-4" /> : i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block truncate text-sm", done ? "text-ink-muted" : "font-medium text-ink")}>
                            {room.title}
                          </span>
                          <span className="block text-xs text-ink-faint">
                            {room.estMinutes} min · {room.xp} XP
                          </span>
                        </span>
                        {isNext ? (
                          <span className="hidden text-xs font-medium text-cyan sm:block">Up next</span>
                        ) : null}
                        <ChevronRight className="h-4 w-4 text-ink-faint" />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardBody>
              <WeeklyXpChart />
            </CardBody>
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exam readiness</CardTitle>
              <Pill>Learner's test</Pill>
            </CardHeader>
            <CardBody>
              <ExamReadiness />
              <Link href="/mock-test" className="mt-5 block">
                <Button variant="outline" className="w-full">
                  Take a mock test
                </Button>
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber" /> Daily challenge
              </CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink-muted">
                Five quick questions from across the syllabus. Earn <span className="font-medium text-ink">+90 XP</span>.
              </p>
              {didDaily ? (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-grass/10 px-3 py-2.5 text-sm text-grass">
                  <CheckCircle2 className="h-4 w-4" /> Done for today. New one tomorrow.
                </div>
              ) : (
                <Link href="/practice?mode=daily" className="mt-4 block">
                  <Button variant="dark" className="w-full">
                    Start challenge
                  </Button>
                </Link>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Badges</CardTitle>
              <Link href="/profile" className="text-sm text-ink-muted hover:text-ink">
                {badges.length} of {BADGES.length}
              </Link>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-5 gap-2">
                {BADGES.slice(0, 10).map((b) => (
                  <BadgeMedal key={b.id} badge={b} unlocked={badges.includes(b.id)} size={44} />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-navy-800" />
        <div className="h-8 w-72 animate-pulse rounded bg-navy-800" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-navy-850" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-xl bg-navy-850" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ClientOnly fallback={<Skeleton />}>
      <DashboardInner />
    </ClientOnly>
  );
}
