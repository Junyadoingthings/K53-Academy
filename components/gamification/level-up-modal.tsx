"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useStore, useLevel } from "@/lib/store";
import { ConfettiBurst } from "@/components/effects/confetti";
import { Button } from "@/components/ui/button";

/**
 * Full-screen celebration when the user levels up — confetti, the new level
 * and rank, and a big glowing number. The single most motivating moment in the
 * loop, so we make it feel like an event.
 */
export function LevelUpModal() {
  const hydrated = useStore((s) => s.hydrated);
  const level = useLevel();
  const prevLevel = React.useRef<number | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!hydrated) return;
    if (prevLevel.current === null) {
      prevLevel.current = level.level; // baseline on first hydrated render
      return;
    }
    if (level.level > prevLevel.current) {
      prevLevel.current = level.level; // advance baseline as we celebrate
      setOpen(true);
      const t = setTimeout(() => setOpen(false), 5200);
      return () => clearTimeout(t);
    }
    prevLevel.current = level.level;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.level, hydrated]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-asphalt-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <ConfettiBurst count={120} origin="center" />
          <motion.div
            initial={{ scale: 0.6, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-cyan/30 bg-navy-850 p-8 text-center shadow-neon"
          >
            <div className="pointer-events-none absolute inset-0 bg-radial-cyan" />
            <div className="relative">
              <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-amber">
                <Sparkles className="h-3 w-3" /> Level up
              </div>

              <motion.div
                initial={{ scale: 0.4, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.1 }}
                className="mx-auto mt-4 grid h-28 w-28 place-items-center rounded-full border-4 border-cyan bg-navy-900 shadow-neon"
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">LVL</div>
                  <div className="font-heading text-5xl font-extrabold text-cyan">{level.level}</div>
                </div>
              </motion.div>

              <h2 className="mt-5 font-heading text-2xl font-bold text-ink">You levelled up!</h2>
              <p className="mt-1 text-ink-muted">
                New rank unlocked:{" "}
                <span className={`font-semibold ${level.rank.color}`}>{level.rank.name}</span>
              </p>

              <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
                Keep driving <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
