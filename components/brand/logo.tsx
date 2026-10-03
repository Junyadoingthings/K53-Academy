import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * K53 Academy mark: a rounded road-sign shield in traffic red, containing an
 * "A" formed from road markings (the yellow centre dash), with a traffic-light
 * trio down the side. Tagline: "Master the Road."
 */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="k53-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF2D45" />
          <stop offset="1" stopColor="#E4002B" />
        </linearGradient>
      </defs>
      {/* shield / sign body */}
      <rect x="5" y="6" width="38" height="38" rx="12" fill="url(#k53-shield)" />
      <rect
        x="6.5"
        y="7.5"
        width="35"
        height="35"
        rx="10.5"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.9"
        strokeWidth="1.5"
      />
      {/* the road "A": two legs + a yellow dashed centre line as the crossbar */}
      <path
        d="M16 37 L23 15 L25 15 L32 37"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="20.4" y="27" width="7.2" height="2.6" rx="1.3" fill="#FFC21A" />
      {/* traffic-light trio */}
      <g>
        <circle cx="37" cy="14" r="2.1" fill="#FF6B6B" />
        <circle cx="37" cy="20" r="2.1" fill="#FFC21A" />
        <circle cx="37" cy="26" r="2.1" fill="#2ED47A" />
      </g>
    </svg>
  );
}

export function Logo({
  size = 40,
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
        <div className="leading-none">
          <div className="font-heading text-[15px] font-bold tracking-tight text-ink">
            K53 <span className="text-cyan">Academy</span>
          </div>
          <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">
            Master the Road
          </div>
        </div>
      )}
    </div>
  );
}
