import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  glow,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  glow?: "cyan" | "amber" | "grass" | "signal" | "none";
}) {
  const glowMap = {
    cyan: "hover:shadow-neon hover:border-cyan/40",
    amber: "hover:shadow-neon-amber hover:border-amber/40",
    grass: "hover:shadow-neon-green hover:border-grass/40",
    signal: "hover:shadow-neon-red hover:border-signal/40",
    none: "",
  };
  return (
    <div
      className={cn(
        "rounded-2xl border border-asphalt/[0.10] bg-navy-850/70 shadow-card backdrop-blur-sm transition-all duration-300",
        glow && glow !== "none" && "lift",
        glow && glowMap[glow],
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
  return (
    <h3
      className={cn("font-heading text-lg font-semibold tracking-tight text-ink", className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
