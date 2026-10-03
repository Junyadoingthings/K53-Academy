"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useLevel, useStore } from "@/lib/store";
import { CountUp } from "./count-up";
import { cn } from "@/lib/utils";

export function XpBar({ className, compact = false }: { className?: string; compact?: boolean }) {
  const xp = useStore((s) => s.xp);
  const level = useLevel();

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("grid place-items-center rounded-lg bg-cyan/15 text-cyan", compact ? "h-6 w-6" : "h-8 w-8")}>
            <Zap className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} fill="currentColor" />
          </span>
          <div className="leading-tight">
            <div className="font-heading text-sm font-bold text-ink">
              Level {level.level}
            </div>
            {!compact && (
              <div className={cn("text-[11px] font-medium", level.rank.color)}>{level.rank.name}</div>
            )}
          </div>
        </div>
        <div className="text-right font-mono text-xs text-ink-muted">
          <CountUp value={level.currentLevelXp} format={false} className="text-cyan" /> /{" "}
          {level.levelSpan} XP
        </div>
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-navy-700">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-deep via-cyan to-cyan-soft"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(4, level.progress * 100)}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        >
          <div className="absolute inset-0 animate-pulse-glow bg-cyan/40 blur-[6px]" />
        </motion.div>
        {/* moving highlight */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <div className="h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>
      </div>

      {!compact && (
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink-faint">
          <span>Total: <CountUp value={xp} className="text-ink-muted" /> XP</span>
          <span>{level.levelSpan - level.currentLevelXp} XP to level {level.level + 1}</span>
        </div>
      )}
    </div>
  );
}
