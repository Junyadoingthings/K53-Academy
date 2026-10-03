"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import yardPhoto from "@/public/images/yard-coaching.jpg";
import { Check } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { signById } from "@/lib/data/signs";
import { cn } from "@/lib/utils";

const MOSAIC = ["stop", "yield", "speed-60", "no-overtaking", "roundabout", "children-ahead", "traffic-signal-ahead", "freeway", "sharp-curve-right"];

export function AuthLayout({
  title,
  description,
  children,
  footer,
  aside = "signs",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  aside?: "signs" | "photo";
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(0,560px)]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="K53 Academy home">
            <Logo size={28} />
          </Link>
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-ink-muted">{description}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-ink-muted">{footer}</div>}
        </div>
      </div>

      {aside === "photo" ? <PhotoAside /> : <SignsAside />}
    </div>
  );
}

const POINTS = ["All the official SADC road signs", "Mock tests with the real pass marks", "Progress saved automatically"];

function SignsAside() {
  return (
    <aside className="relative hidden overflow-hidden border-l border-white/[0.06] bg-asphalt-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="grid grid-cols-3 gap-4">
        {MOSAIC.map((id) => {
          const s = signById(id);
          return s ? (
            <div key={id} className="grid aspect-square place-items-center rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.06]">
              <RoadSignSVG sign={s} size={80} className="h-auto w-[62%]" />
            </div>
          ) : null;
        })}
      </div>
      <div>
        <p className="text-2xl font-semibold leading-snug tracking-tight">
          Study the way the test is set — section by section, sign by sign.
        </p>
        <Points />
      </div>
    </aside>
  );
}

function PhotoAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-asphalt-900 text-white lg:block">
      <Image
        src={yardPhoto}
        alt="A driving instructor goes through yard-test notes with a learner driver"
        fill
        priority
        placeholder="blur"
        sizes="560px"
        className="object-cover object-[50%_30%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 p-12">
        <p className="text-2xl font-semibold leading-snug tracking-tight">
          Start with the theory. Arrive at your lessons ready to drive.
        </p>
        <Points />
      </div>
    </aside>
  );
}

function Points() {
  return (
    <ul className="mt-6 space-y-2.5 text-sm text-white/75">
      {POINTS.map((t) => (
        <li key={t} className="flex items-center gap-2">
          <Check className="h-4 w-4 text-white" /> {t}
        </li>
      ))}
    </ul>
  );
}

export function TextField({
  label,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const id = React.useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={cn(
          "h-11 w-full rounded-lg border border-asphalt/[0.14] bg-navy-850 px-3.5 text-[15px] text-ink shadow-card outline-none transition-colors placeholder:text-ink-faint focus:border-cyan/60 focus:ring-2 focus:ring-cyan/15"
        )}
      />
      {hint && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="mb-5 rounded-lg border border-signal/25 bg-signal/[0.06] px-3.5 py-2.5 text-sm text-signal">
      {children}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
      <span className="h-px flex-1 bg-asphalt/[0.1]" /> or <span className="h-px flex-1 bg-asphalt/[0.1]" />
    </div>
  );
}
