"use client";

import { motion } from "framer-motion";
import { useLevel } from "@/lib/store";

/** Circular level indicator with a progress ring. */
export function LevelRing({ size = 84 }: { size?: number }) {
  const level = useLevel();
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - level.progress);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-navy-700" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-cyan"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />
      </svg>
      <div className="absolute text-center leading-none">
        <div className="text-[10px] font-medium uppercase tracking-wide text-ink-faint">Level</div>
        <div className="tabular mt-0.5 text-2xl font-semibold text-ink">{level.level}</div>
      </div>
    </div>
  );
}
