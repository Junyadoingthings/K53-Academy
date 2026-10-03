"use client";

import * as React from "react";
import { animate, useMotionValue } from "framer-motion";
import { formatNumber } from "@/lib/utils";

/** A number that ticks up smoothly whenever its target changes. */
export function CountUp({
  value,
  duration = 0.9,
  className,
  format = true,
}: {
  value: number;
  duration?: number;
  className?: string;
  format?: boolean;
}) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [value, duration, mv]);

  return <span className={className}>{format ? formatNumber(display) : display}</span>;
}
