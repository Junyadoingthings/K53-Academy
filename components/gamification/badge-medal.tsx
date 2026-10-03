"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { BadgeDef } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const accentMap = {
  cyan: { ring: "border-cyan/50", bg: "bg-cyan/10", text: "text-cyan", glow: "shadow-neon" },
  amber: { ring: "border-amber/50", bg: "bg-amber/10", text: "text-amber", glow: "shadow-neon-amber" },
  grass: { ring: "border-grass/50", bg: "bg-grass/10", text: "text-grass", glow: "shadow-neon-green" },
  signal: { ring: "border-signal/50", bg: "bg-signal/10", text: "text-signal-soft", glow: "shadow-neon-red" },
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
  const a = accentMap[badge.accent];
  const Icon = (Icons[badge.icon as keyof typeof Icons] ?? Icons.Award) as React.ComponentType<{
    className?: string;
  }>;

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.06, rotate: -2 } : {}}
      className={cn(
        "relative grid place-items-center rounded-2xl border transition-all",
        unlocked ? cn(a.ring, a.bg, a.glow) : "border-asphalt/[0.06] bg-navy-800/50 grayscale"
      )}
      style={{ width: size, height: size }}
      title={`${badge.name} — ${badge.description}`}
    >
      <Icon className={cn(size > 56 ? "h-7 w-7" : "h-5 w-5", unlocked ? a.text : "text-ink-faint")} />
      {!unlocked && (
        <div className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-asphalt/15 bg-navy-900">
          <Icons.Lock className="h-2.5 w-2.5 text-ink-faint" />
        </div>
      )}
    </motion.div>
  );
}
