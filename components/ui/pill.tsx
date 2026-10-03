import * as React from "react";
import { cn } from "@/lib/utils";

const tones = {
  cyan: "border-cyan/30 bg-cyan/10 text-cyan",
  amber: "border-amber/30 bg-amber/10 text-amber",
  grass: "border-grass/30 bg-grass/10 text-grass",
  signal: "border-signal/30 bg-signal/10 text-signal",
  muted: "border-asphalt/15 bg-asphalt/[0.06] text-ink-muted",
} as const;

export function Pill({
  tone = "muted",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

const difficultyTone: Record<string, keyof typeof tones> = {
  Easy: "grass",
  Medium: "amber",
  Hard: "signal",
};

export function DifficultyPill({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  return <Pill tone={difficultyTone[level]}>{level}</Pill>;
}
