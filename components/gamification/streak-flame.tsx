"use client";

import { motion } from "framer-motion";
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
  const dims = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" }[size];
  const text = { sm: "text-sm", md: "text-lg", lg: "text-3xl" }[size];

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <motion.span
        className={cn("relative", active && "animate-flame-flicker")}
        aria-hidden
      >
        {active && (
          <span className="absolute inset-0 blur-md">
            <Flame className={cn(dims, "text-amber")} fill="currentColor" />
          </span>
        )}
        <Flame
          className={cn(dims, "relative", active ? "text-amber" : "text-ink-faint")}
          fill={active ? "currentColor" : "none"}
        />
      </motion.span>
      <span className={cn("font-mono font-bold", text, active ? "text-amber" : "text-ink-faint")}>
        {count}
      </span>
    </div>
  );
}
