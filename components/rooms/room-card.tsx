"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { iconFor } from "@/components/ui/icon";
import type { Room } from "@/lib/data/types";
import { DifficultyPill } from "@/components/ui/pill";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoomCard({
  room,
  completed,
  locked,
}: {
  room: Room;
  completed?: boolean;
  locked?: boolean;
  index?: number;
}) {
  const Icon = iconFor(room.icon, BookOpen);

  const inner = (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-asphalt/[0.09] bg-navy-850 p-5 shadow-card transition-[border-color,box-shadow]",
        !locked && "hover:border-asphalt/[0.18] hover:shadow-raised",
        locked && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy-800 text-ink">
          <Icon className="h-5 w-5" />
        </span>
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-grass" />
        ) : locked ? (
          <Lock className="h-4 w-4 text-ink-faint" />
        ) : null}
      </div>
      <h3 className="mt-4 font-semibold text-ink">{room.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{room.tagline}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 text-xs text-ink-faint">
        <DifficultyPill level={room.difficulty} />
        <span>{room.estMinutes} min</span>
        <span>·</span>
        <span>{room.xp} XP</span>
      </div>
    </div>
  );

  if (locked) return <div>{inner}</div>;
  return <Link href={`/rooms/${room.slug}`}>{inner}</Link>;
}
