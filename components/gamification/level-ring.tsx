"use client";

import { motion } from "framer-motion";
import { useLevel } from "@/lib/store";

/** Circular level indicator with an animated progress ring. */
export function LevelRing({ size = 84 }: { size?: number }) {
  const level = useLevel();
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - level.progress);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8DECF" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E4002B"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
          style={{ filter: "drop-shadow(0 0 6px rgba(0,229,255,0.6))" }}
        />
      </svg>
      <div className="absolute text-center leading-none">
        <div className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">LVL</div>
        <div className="font-heading text-2xl font-bold text-ink">{level.level}</div>
      </div>
    </div>
  );
}
