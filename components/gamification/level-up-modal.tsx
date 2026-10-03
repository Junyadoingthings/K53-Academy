"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-asphalt/[0.1] bg-navy-850 p-8 text-center shadow-pop"
          >

            <div className="relative">
              <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber">
                <Sparkles className="h-3 w-3" /> Level up
              </div>

              <motion.div
                initial={{ scale: 0.4, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.1 }}
                className="mx-auto mt-5 grid h-28 w-28 place-items-center rounded-full border-4 border-cyan bg-navy-850"
              >
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Level</div>
                  <div className="tabular text-5xl font-semibold text-ink">{level.level}</div>
                </div>
              </motion.div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">You reached a new level</h2>
              <p className="mt-1 text-ink-muted">
                New rank unlocked:{" "}
                <span className={`font-semibold ${level.rank.color}`}>{level.rank.name}</span>
              </p>

              <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
