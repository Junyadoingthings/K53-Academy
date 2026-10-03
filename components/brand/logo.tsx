import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * K53 Academy mark: a road-sign red tile with a road running to the horizon
 * and its dashed centre line. Simple enough to read at 16px.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#D61F26" />
      <path d="M7.5 27 L14.4 7 H17.6 L24.5 27 Z" fill="#FFFFFF" />
      <g fill="#D61F26">
        <rect x="15.25" y="9.5" width="1.5" height="3" rx="0.5" />
        <rect x="15.1" y="15" width="1.8" height="3.6" rx="0.6" />
        <rect x="14.9" y="21.2" width="2.2" height="4.2" rx="0.7" />
      </g>
    </svg>
  );
}

export function Logo({
  size = 32,
  showText = true,
  className,
}: {
  size?: number;
  showText?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showText && (
        <span className="text-[15px] font-semibold tracking-tight text-ink">
          K53 <span className="text-ink-muted font-medium">Academy</span>
        </span>
      )}
    </div>
  );
}
