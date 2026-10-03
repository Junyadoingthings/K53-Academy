"use client";

import * as React from "react";
import { Award, Lock } from "lucide-react";
import { iconFor } from "@/components/ui/icon";
import type { BadgeDef } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const accentMap = {
  cyan: "bg-cyan/10 text-cyan ring-cyan/25",
  amber: "bg-amber/10 text-amber ring-amber/30",
  grass: "bg-grass/10 text-grass ring-grass/25",
  signal: "bg-signal/10 text-signal ring-signal/25",
} as const;

export function BadgeMedal({
  badge,
  unlocked,
  size = 64,
}: {
  badge: BadgeDef;
  unlocked: boolean;
  size?: number;
}) {
  const Icon = iconFor(badge.icon, Award);

  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-full ring-1 ring-inset transition-colors",
        unlocked ? accentMap[badge.accent] : "bg-navy-800 text-ink-faint/60 ring-asphalt/[0.06]"
      )}
      style={{ width: size, height: size }}
      title={`${badge.name} — ${unlocked ? badge.description : badge.criteria}`}
    >
      <Icon className={size > 56 ? "h-6 w-6" : "h-5 w-5"} />
      {!unlocked && (
        <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-navy-850 ring-1 ring-asphalt/[0.1]">
          <Lock className="h-2.5 w-2.5 text-ink-faint" />
        </span>
      )}
    </div>
  );
}
