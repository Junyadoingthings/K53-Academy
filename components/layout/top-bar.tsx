"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Coins, LogOut, Search, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { StreakFlame } from "@/components/gamification/streak-flame";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { ThemeToggle } from "@/components/theme";
import { SearchDialog } from "@/components/layout/search-dialog";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-store";

function Stats() {
  const streak = useStore((s) => s.streak);
  const coins = useStore((s) => s.coins);
  return (
    <div className="flex items-center gap-1">
      <div className="flex h-8 items-center rounded-md px-2" title={`${streak}-day study streak`}>
        <StreakFlame count={streak} size="sm" />
      </div>
      <div className="flex h-8 items-center gap-1.5 rounded-md px-2" title="RoadCoins">
        <Coins className="h-4 w-4 text-amber" />
        <CountUp value={coins} className="tabular text-sm font-semibold text-ink" />
      </div>
    </div>
  );
}

function AccountMenu() {
  const router = useRouter();
  const account = useAuth((s) => s.currentAccount());
  const signOut = useAuth((s) => s.signOut);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const name = account?.name ?? "Driver";
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="grid h-8 w-8 place-items-center rounded-full bg-navy-800 text-xs font-semibold text-ink ring-1 ring-asphalt/[0.08] transition hover:ring-asphalt/20"
      >
        {initials}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 z-50 w-56 overflow-hidden rounded-lg border border-asphalt/[0.1] bg-navy-850 p-1 shadow-pop"
        >
          <div className="px-2.5 py-2">
            <div className="truncate text-sm font-medium text-ink">{name}</div>
            <div className="truncate text-xs text-ink-faint">
              {account?.guest ? "Guest session · progress saved on this device" : account?.email}
            </div>
          </div>
          <div className="my-1 h-px bg-asphalt/[0.08]" />
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-ink-muted hover:bg-navy-800 hover:text-ink"
          >
            <UserRound className="h-4 w-4" /> Profile & settings
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              signOut();
              router.replace("/sign-in");
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-ink-muted hover:bg-navy-800 hover:text-ink"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function TopBar() {
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-asphalt/[0.08] px-4 lg:px-8">
      <div className="lg:hidden">
        <Link href="/dashboard" aria-label="K53 Academy home">
          <Logo size={26} showText={false} />
        </Link>
      </div>

      <button
        onClick={() => setSearchOpen(true)}
        className="hidden h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-asphalt/[0.1] bg-navy-850 px-3 text-sm text-ink-faint shadow-card transition-colors hover:border-asphalt/20 lg:flex"
      >
        <Search className="h-4 w-4" />
        <span>Search lessons and signs</span>
        <kbd className="ml-auto rounded border border-asphalt/[0.12] px-1.5 font-mono text-[10px] text-ink-faint">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-navy-800 hover:text-ink lg:hidden"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
        <ClientOnly fallback={<div className="h-8 w-28" />}>
          <Stats />
        </ClientOnly>
        <ThemeToggle />
        <ClientOnly fallback={<div className="h-8 w-8" />}>
          <AccountMenu />
        </ClientOnly>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
