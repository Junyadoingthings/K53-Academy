"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { RoomCard } from "@/components/rooms/room-card";
import { RoadLine } from "@/components/backgrounds";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { pathBySlug } from "@/lib/data/paths";
import { roomById } from "@/lib/data/rooms";
import { cn } from "@/lib/utils";

const accentText = {
  cyan: "text-cyan bg-cyan/10 border-cyan/30",
  amber: "text-amber bg-amber/10 border-amber/30",
  grass: "text-grass bg-grass/10 border-grass/30",
  signal: "text-signal-soft bg-signal/10 border-signal/30",
} as const;

function PathDetail({ slug }: { slug: string }) {
  const completedRooms = useStore((s) => s.completedRooms);
  const path = pathBySlug(slug);
  if (!path) return notFound();

  const Icon = (Icons[path.icon as keyof typeof Icons] ?? Icons.Waypoints) as React.ComponentType<{
    className?: string;
  }>;
  const rooms = path.roomIds.map((id) => roomById(id)!).filter(Boolean);
  const done = rooms.filter((r) => completedRooms.includes(r.id)).length;
  const pct = Math.round((done / rooms.length) * 100);

  return (
    <div className="space-y-6">
      <Link href="/paths" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-cyan">
        <ArrowLeft className="h-4 w-4" /> All paths
      </Link>

      <Card glow={path.accent}>
        <CardBody className="p-6">
          <div className="flex items-start gap-4">
            <span className={cn("grid h-16 w-16 shrink-0 place-items-center rounded-2xl border", accentText[path.accent])}>
              <Icon className="h-8 w-8" />
            </span>
            <div className="flex-1">
              <div className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                {path.subtitle}
              </div>
              <h1 className="font-heading text-3xl font-bold text-ink">{path.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">{path.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {path.tags.map((t) => (
                  <Pill key={t} tone={path.accent === "signal" ? "signal" : path.accent}>
                    {t}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-ink-muted">
              <span>Path progress</span>
              <span className="font-mono">{done}/{rooms.length} rooms · {pct}%</span>
            </div>
            <RoadLine />
          </div>
        </CardBody>
      </Card>

      <div>
        <h2 className="mb-3 font-heading text-lg font-semibold text-ink">Rooms in this path</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {rooms.map((room, i) => {
            const isCompleted = completedRooms.includes(room.id);
            const prereqsMet = room.prerequisites.every((p) => completedRooms.includes(p));
            const locked = !isCompleted && !prereqsMet;
            return (
              <RoomCard key={room.id} room={room} completed={isCompleted} locked={locked} index={i} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PathDetailPage() {
  const params = useParams();
  const slug = String(params.slug);
  return (
    <ClientOnly fallback={<div className="h-96 animate-pulse rounded-2xl bg-navy-850/70" />}>
      <PathDetail slug={slug} />
    </ClientOnly>
  );
}
