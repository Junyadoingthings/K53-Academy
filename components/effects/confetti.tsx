"use client";

import * as React from "react";
import { motion } from "framer-motion";

const COLORS = ["#E4002B", "#FFC21A", "#12B767", "#FF6B6B", "#FFFFFF", "#E68A00"];

/**
 * A lightweight, dependency-free confetti burst. Mount it (e.g. while a
 * celebration modal is open) and it rains pieces once. `origin` controls
 * where the burst starts: "top" rains down, "center" explodes outward.
 */
export function ConfettiBurst({
  count = 90,
  origin = "top",
  className = "",
}: {
  count?: number;
  origin?: "top" | "center";
  className?: string;
}) {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.5,
        duration: 1.6 + Math.random() * 1.4,
        rotate: Math.random() * 720 - 360,
        size: 6 + Math.random() * 8,
        drift: Math.random() * 120 - 60,
        round: Math.random() > 0.5,
      })),
    [count]
  );

  return (
    <div className={`pointer-events-none fixed inset-0 z-[120] overflow-hidden ${className}`} aria-hidden>
      {pieces.map((p) =>
        origin === "top" ? (
          <motion.span
            key={p.id}
            className="absolute top-0"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.4,
              background: p.color,
              borderRadius: p.round ? "50%" : 2,
            }}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{ y: "105vh", opacity: [0, 1, 1, 0.9], x: p.drift, rotate: p.rotate }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          />
        ) : (
          <motion.span
            key={p.id}
            className="absolute left-1/2 top-1/2"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.round ? "50%" : 2,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((p.id / count) * Math.PI * 2) * (180 + p.drift),
              y: Math.sin((p.id / count) * Math.PI * 2) * (180 + p.drift) + 200,
              opacity: 0,
              scale: 0.4,
              rotate: p.rotate,
            }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          />
        )
      )}
    </div>
  );
}
