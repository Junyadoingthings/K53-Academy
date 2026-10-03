"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Route } from "lucide-react";
import { iconFor } from "@/components/ui/icon";
import { ArrowLeft, Check, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill, DifficultyPill } from "@/components/ui/pill";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { pathBySlug } from "@/lib/data/paths";
import { roomById } from "@/lib/data/rooms";
import { cn } from "@/lib/utils";

function PathDetail({ slug }: { slug: string }) {
  const completedRooms = useStore((s) => s.completedRooms);
  const path = pathBySlug(slug);
  if (!path) return notFound();

  const Icon = iconFor(path.icon, Route);
  const rooms = path.roomIds.map((id) => roomById(id)!).filter(Boolean);
  const done = rooms.filter((r) => completedRooms.includes(r.id)).length;
  const pct = Math.round((done / rooms.length) * 100);
  const next = rooms.find((r) => !completedRooms.includes(r.id));
  const minutes = rooms.reduce((a, r) => a + r.estMinutes, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link href="/paths" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All paths
      </Link>

      <header>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-850 text-ink shadow-card ring-1 ring-asphalt/[0.08]">
          <Icon className="h-6 w-6" />
        </span>
        <div className="mt-5 text-sm text-ink-muted">{path.subtitle}</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">{path.title}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">{path.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {path.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-asphalt/[0.09] bg-navy-850 p-4 shadow-card sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink">
                {done} of {rooms.length} lessons complete
              </span>
              <span className="tabular text-ink-muted">{pct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-700">
              <div className={cn("h-full rounded-full", pct === 100 ? "bg-grass" : "bg-cyan")} style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-ink-faint">About {minutes} minutes in total</div>
          </div>
          {next && (
            <Link href={`/rooms/${next.slug}`}>
              <Button className="w-full sm:w-auto">{done === 0 ? "Start path" : "Continue"}</Button>
            </Link>
          )}
        </div>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Lessons</h2>
        <ol className="relative space-y-2">
          {rooms.map((room, i) => {
            const isDone = completedRooms.includes(room.id);
            const prereqsMet = room.prerequisites.every((p) => completedRooms.includes(p));
            const locked = !isDone && !prereqsMet;
            const isNext = next?.id === room.id;
            const body = (
              <div
                className={cn(
                  "flex items-center gap-4 rounded-xl border bg-navy-850 p-4 shadow-card transition-[border-color,box-shadow]",
                  isNext ? "border-cyan/40" : "border-asphalt/[0.09]",
                  !locked && "hover:border-asphalt/[0.18] hover:shadow-raised",
                  locked && "opacity-60"
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold",
                    isDone ? "bg-grass/10 text-grass" : isNext ? "bg-cyan text-white" : "bg-navy-800 text-ink-muted"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-ink">{room.title}</div>
                  <div className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{room.tagline}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                    <DifficultyPill level={room.difficulty} />
                    <span>{room.estMinutes} min</span>
                    <span>·</span>
                    <span>{room.questionIds.length} questions</span>
                    <span>·</span>
                    <span>{room.xp} XP</span>
                  </div>
                </div>
                {locked ? (
                  <span className="hidden text-xs text-ink-faint sm:block">Finish earlier lessons first</span>
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-faint" />
                )}
              </div>
            );
            return <li key={room.id}>{locked ? body : <Link href={`/rooms/${room.slug}`}>{body}</Link>}</li>;
          })}
        </ol>
      </section>
    </div>
  );
}

export default function PathDetailPage() {
  const params = useParams();
  const slug = String(params.slug);
  return (
    <ClientOnly fallback={<div className="h-96 animate-pulse rounded-xl bg-navy-850" />}>
      <PathDetail slug={slug} />
    </ClientOnly>
  );
}
