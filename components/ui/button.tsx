"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-cyan text-white hover:bg-cyan-soft shadow-neon hover:shadow-[0_10px_28px_-8px_rgba(228,0,43,0.6)]",
        amber:
          "bg-amber text-asphalt-950 hover:bg-amber-soft shadow-neon-amber",
        success:
          "bg-grass text-white hover:bg-grass-soft shadow-neon-green",
        danger: "bg-signal text-white hover:bg-signal-soft shadow-neon-red",
        outline:
          "border border-asphalt/15 bg-navy-800/40 text-ink hover:border-cyan/50 hover:text-cyan hover:bg-navy-800",
        ghost: "text-ink-muted hover:text-ink hover:bg-asphalt/[0.06]",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-base py-3.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
