"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useStore } from "@/lib/store";
import { badgeById } from "@/lib/data/badges";
import { cn } from "@/lib/utils";

const accentMap = {
  cyan: "text-cyan border-cyan/50 shadow-neon",
  amber: "text-amber border-amber/50 shadow-neon-amber",
  grass: "text-grass border-grass/50 shadow-neon-green",
  signal: "text-signal-soft border-signal/50 shadow-neon-red",
} as const;

const particleColors = ["#E4002B", "#FFC12E", "#0B9C56", "#E4002B", "#FF3D53"];

export function BadgeToast() {
  const lastBadge = useStore((s) => s.lastBadgeUnlocked);
  const clear = useStore((s) => s.clearBadgeToast);
  const badge = lastBadge ? badgeById(lastBadge) : undefined;

  React.useEffect(() => {
    if (!lastBadge) return;
    const t = setTimeout(clear, 4200);
    return () => clearTimeout(t);
  }, [lastBadge, clear]);

  const Icon = badge
    ? ((Icons[badge.icon as keyof typeof Icons] ?? Icons.Award) as React.ComponentType<{ className?: string }>)
    : Icons.Award;

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 md:bottom-8"
          role="status"
        >
          <div
            className={cn(
              "relative flex items-center gap-3 overflow-visible rounded-2xl border bg-navy-850/95 px-5 py-4 backdrop-blur",
              accentMap[badge.accent]
            )}
          >
            {/* particle burst */}
            {particleColors.map((color, i) =>
              Array.from({ length: 3 }).map((_, j) => {
                const idx = i * 3 + j;
                const angle = (idx / 15) * Math.PI * 2;
                return (
                  <motion.span
                    key={idx}
                    className="absolute left-8 top-1/2 h-1.5 w-1.5 rounded-full"
                    style={{ background: color }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(angle) * (60 + (idx % 4) * 12),
                      y: Math.sin(angle) * (60 + (idx % 4) * 12),
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                );
              })
            )}

            <motion.span
              className={cn("relative grid h-12 w-12 place-items-center rounded-xl border bg-navy-900", accentMap[badge.accent])}
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.6 }}
            >
              <Icon className="h-6 w-6" />
            </motion.span>
            <div className="pr-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                Badge unlocked
              </div>
              <div className="font-heading text-base font-bold text-ink">{badge.name}</div>
              <div className="text-xs text-ink-muted">{badge.description}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
