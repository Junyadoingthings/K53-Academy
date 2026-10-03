import * as React from "react";
import type { RoadSign } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/**
 * Renders an official SADC / SARTSM road sign. Artwork lives in
 * /public/signs and comes from the public-domain SADC road sign set on
 * Wikimedia Commons (see public/signs/SOURCE.md).
 */
export function RoadSignSVG({
  sign,
  size = 96,
  title,
  className,
}: {
  sign: RoadSign;
  size?: number;
  title?: string;
  className?: string;
}) {
  const src = `/signs/${sign.image ?? `${sign.code}.svg`}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={size}
      height={size}
      alt={title ?? `${sign.name} sign (${sign.code})`}
      draggable={false}
      loading="lazy"
      decoding="async"
      className={cn("select-none object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
