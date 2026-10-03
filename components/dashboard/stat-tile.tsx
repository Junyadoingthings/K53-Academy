"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  cyan: "text-cyan bg-cyan/10",
  amber: "text-amber bg-amber/10",
  grass: "text-grass bg-grass/10",
  signal: "text-signal-soft bg-signal/10",
} as const;

export function StatTile({
  icon,
  label,
  value,
  sub,
  tone = "cyan",
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: keyof typeof tones;
}) {
  const Icon = (Icons[icon as keyof typeof Icons] ?? Icons.Circle) as React.ComponentType<{
    className?: string;
  }>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-asphalt/[0.10] bg-navy-850/70 p-4"
    >
      <div className="flex items-center justify-between">
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl", tones[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="mt-3 font-heading text-2xl font-bold text-ink">{value}</div>
      <div className="text-xs font-medium text-ink-muted">{label}</div>
      {sub && <div className="mt-0.5 font-mono text-[10px] text-ink-faint">{sub}</div>}
    </motion.div>
  );
}
