import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Surface container. `glow` is kept for API compatibility: it now marks the
 * card as interactive (subtle lift + border on hover) rather than adding a
 * coloured glow.
 */
export function Card({
  className,
  glow,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  glow?: "cyan" | "amber" | "grass" | "signal" | "none";
}) {
  const interactive = glow && glow !== "none";
  return (
    <div
      className={cn(
        "rounded-xl border border-asphalt/[0.09] bg-navy-850 shadow-card transition-[border-color,box-shadow,transform] duration-200",
        interactive && "hover:border-asphalt/[0.16] hover:shadow-raised",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-[15px] font-semibold tracking-tight text-ink", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm text-ink-muted", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
