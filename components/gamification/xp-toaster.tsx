"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useStore } from "@/lib/store";

interface Gain {
  id: number;
  amount: number;
}

/**
 * Floating "+N XP" chips that pop whenever total XP increases — a small hit of
 * dopamine on every correct answer, room, mock and streak check-in.
 */
export function XpToaster() {
  const xp = useStore((s) => s.xp);
  const hydrated = useStore((s) => s.hydrated);
  const prev = React.useRef<number | null>(null);
  const nextId = React.useRef(0);
  const [gains, setGains] = React.useState<Gain[]>([]);

  React.useEffect(() => {
    if (!hydrated) return;
    if (prev.current === null) {
      prev.current = xp;
      return;
    }
    const delta = xp - prev.current;
    prev.current = xp;
    if (delta <= 0) return;
    const id = nextId.current++;
    setGains((g) => [...g, { id, amount: delta }]);
    setTimeout(() => setGains((g) => g.filter((x) => x.id !== id)), 1300);
  }, [xp, hydrated]);

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[90] flex flex-col items-end gap-2 lg:right-8">
      <AnimatePresence>
        {gains.map((g) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 12, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan px-3 py-1.5 text-white shadow-neon"
          >
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            <span className="font-mono text-sm font-bold">+{g.amount} XP</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
