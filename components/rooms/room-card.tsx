"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import type { Room } from "@/lib/data/types";
import { Card } from "@/components/ui/card";
import { Pill, DifficultyPill } from "@/components/ui/pill";
import { CheckCircle2, Clock, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoomCard({
  room,
  completed,
  locked,
  index = 0,
}: {
  room: Room;
  completed?: boolean;
  locked?: boolean;
  index?: number;
}) {
  const Icon = (Icons[room.icon as keyof typeof Icons] ?? Icons.BookOpen) as React.ComponentType<{
    className?: string;
  }>;

  const inner = (
    <Card
      glow={locked ? "none" : "cyan"}
      className={cn(
        "sheen group h-full p-5",
        locked && "opacity-60",
        completed && "border-grass/30"
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "grid h-11 w-11 place-items-center rounded-xl border",
            completed
              ? "border-grass/40 bg-grass/10 text-grass"
              : "border-cyan/30 bg-cyan/10 text-cyan"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-grass" />
        ) : locked ? (
          <Lock className="h-4 w-4 text-ink-faint" />
        ) : null}
      </div>

      <h3 className="mt-4 font-heading text-lg font-semibold text-ink group-hover:text-cyan">
        {room.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{room.tagline}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DifficultyPill level={room.difficulty} />
        <Pill>
          <Clock className="h-3 w-3" /> {room.estMinutes}m
        </Pill>
        <Pill tone="cyan">
          <Zap className="h-3 w-3" /> {room.xp} XP
        </Pill>
      </div>
    </Card>
  );

  if (locked) return <div>{inner}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link href={`/rooms/${room.slug}`}>{inner}</Link>
    </motion.div>
  );
}
