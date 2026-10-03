"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakFlame({
  count,
  size = "md",
  className,
}: {
  count: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const active = count > 0;
  const dims = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-8 w-8" }[size];
  const text = { sm: "text-sm", md: "text-base", lg: "text-3xl" }[size];

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <Flame
        aria-hidden
        className={cn(dims, active ? "text-amber" : "text-ink-faint")}
        fill={active ? "currentColor" : "none"}
      />
      <span className={cn("tabular font-semibold", text, active ? "text-ink" : "text-ink-faint")}>{count}</span>
    </div>
  );
}
