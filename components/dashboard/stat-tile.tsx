"use client";

import * as React from "react";
import { Circle } from "lucide-react";
import { iconFor } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const tones = {
  cyan: "text-cyan",
  amber: "text-amber",
  grass: "text-grass",
  signal: "text-signal",
  muted: "text-ink-faint",
} as const;

export function StatTile({
  icon,
  label,
  value,
  sub,
  tone = "muted",
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: keyof typeof tones;
}) {
  const Icon = iconFor(icon, Circle);
  return (
    <div className="rounded-xl border border-asphalt/[0.09] bg-navy-850 p-4 shadow-card">
      <div className="flex items-center gap-2 text-[13px] text-ink-muted">
        <Icon className={cn("h-4 w-4", tones[tone])} />
        {label}
      </div>
      <div className="tabular mt-3 text-2xl font-semibold tracking-tight text-ink">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-faint">{sub}</div>}
    </div>
  );
}
