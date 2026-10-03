"use client";

import { motion } from "framer-motion";
import { useLevel } from "@/lib/store";
import { CountUp } from "./count-up";
import { cn } from "@/lib/utils";

export function XpBar({ className, compact = false }: { className?: string; compact?: boolean }) {
  const level = useLevel();

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="text-sm font-semibold text-ink">Level {level.level}</div>
        <div className="tabular whitespace-nowrap text-xs text-ink-muted">
          <CountUp value={level.currentLevelXp} format={false} className="font-medium text-ink" /> / {level.levelSpan} XP
        </div>
      </div>

      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-navy-700">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, level.progress * 100)}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        />
      </div>

      {!compact && (
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-ink-faint">
          <span className="truncate">{level.rank.name}</span>
          <span className="whitespace-nowrap">
            {level.levelSpan - level.currentLevelXp} XP to level {level.level + 1}
          </span>
        </div>
      )}
    </div>
  );
}
