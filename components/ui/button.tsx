"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-cyan text-white shadow-card hover:bg-cyan-deep dark:hover:bg-cyan-soft",
        dark: "bg-ink text-navy-900 shadow-card hover:bg-ink/85",
        amber: "bg-amber text-white shadow-card hover:bg-amber/90 dark:text-asphalt-950",
        success: "bg-grass text-white shadow-card hover:bg-grass/90 dark:text-asphalt-950",
        danger: "bg-signal text-white shadow-card hover:bg-cyan-deep",
        outline:
          "border border-asphalt/[0.14] bg-navy-850 text-ink shadow-card hover:bg-navy-800 hover:border-asphalt/20",
        ghost: "text-ink-muted hover:bg-navy-800 hover:text-ink",
        link: "h-auto px-0 text-cyan underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-9 w-9",
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
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
