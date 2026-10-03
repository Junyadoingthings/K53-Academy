import * as React from "react";
import { cn } from "@/lib/utils";

const tones = {
  cyan: "bg-cyan/10 text-cyan ring-cyan/20",
  amber: "bg-amber/10 text-amber ring-amber/25",
  grass: "bg-grass/10 text-grass ring-grass/20",
  signal: "bg-signal/10 text-signal ring-signal/20",
  muted: "bg-navy-800 text-ink-muted ring-asphalt/[0.08]",
} as const;

export function Pill({
  tone = "muted",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
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
