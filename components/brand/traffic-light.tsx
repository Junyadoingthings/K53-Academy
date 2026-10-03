"use client";

import { cn } from "@/lib/utils";

/**
 * A traffic-light motif. `active` controls which lamp glows:
 *  - "red" | "amber" | "green" light a single lamp
 *  - "cycle" animates through all three (nice for loaders / hero)
 *  - "all" lights every lamp (branding)
 */
export function TrafficLight({
  size = 44,
  active = "all",
  horizontal = false,
  className,
}: {
  size?: number;
  active?: "red" | "amber" | "green" | "cycle" | "all";
  horizontal?: boolean;
  className?: string;
}) {
  const lampSize = size * 0.62;
  const lamps = [
    { key: "red", color: "#E4002B", glow: "rgba(228,0,43,0.75)" },
    { key: "amber", color: "#FFC21A", glow: "rgba(255,194,26,0.8)" },
    { key: "green", color: "#12B767", glow: "rgba(18,183,103,0.75)" },
  ] as const;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-2xl border border-asphalt-600/60 bg-asphalt-900 p-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),0_10px_24px_-12px_rgba(0,0,0,0.6)]",
        horizontal ? "flex-row" : "flex-col",
        className
      )}
      style={{ width: horizontal ? "auto" : size + 8 }}
      aria-hidden
    >
      {lamps.map((l, i) => {
        const lit =
          active === "all" ||
          active === l.key ||
          (active === "cycle" ? false : false);
        return (
          <span
            key={l.key}
            className={cn(
              "rounded-full transition-all",
              active === "cycle" && "animate-light-cycle"
            )}
            style={{
              width: lampSize,
              height: lampSize,
              background: lit || active === "cycle" ? l.color : "#2a2c33",
              boxShadow:
                lit || active === "cycle"
                  ? `0 0 ${lampSize * 0.5}px ${l.glow}, inset 0 0 ${lampSize * 0.25}px rgba(255,255,255,0.35)`
                  : "inset 0 2px 4px rgba(0,0,0,0.6)",
              animationDelay: active === "cycle" ? `${i * 0.45}s` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
