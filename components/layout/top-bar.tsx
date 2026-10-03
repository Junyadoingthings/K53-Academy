"use client";

import Link from "next/link";
import { Coins, Snowflake, Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { StreakFlame } from "@/components/gamification/streak-flame";
import { CountUp } from "@/components/gamification/count-up";
import { ClientOnly } from "@/components/hydration";
import { ThemeToggle } from "@/components/theme";
import { useStore } from "@/lib/store";

function Stats() {
  const streak = useStore((s) => s.streak);
  const coins = useStore((s) => s.coins);
  const freezes = useStore((s) => s.freezes);
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5 rounded-full border border-asphalt/15 bg-navy-800/60 px-3 py-1.5" title="Study streak">
        <StreakFlame count={streak} size="sm" />
      </div>
      <div className="hidden items-center gap-1.5 rounded-full border border-asphalt/15 bg-navy-800/60 px-3 py-1.5 sm:flex" title="Streak freezes">
        <Snowflake className="h-4 w-4 text-cyan-soft" />
        <span className="font-mono text-sm font-bold text-cyan-soft">{freezes}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-amber/20 bg-amber/5 px-3 py-1.5" title="RoadCoins">
        <Coins className="h-4 w-4 text-amber" />
        <CountUp value={coins} className="font-mono text-sm font-bold text-amber" />
      </div>
    </div>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-asphalt/[0.10] bg-navy-950/70 px-4 backdrop-blur-xl lg:px-8">
      <div className="lg:hidden">
        <Link href="/dashboard">
          <Logo size={34} showText={false} />
        </Link>
      </div>

      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-asphalt/[0.10] bg-navy-850/60 px-3 py-2 text-sm text-ink-faint lg:flex">
        <Search className="h-4 w-4" />
        <span>Search rooms, signs, questions…</span>
        <kbd className="ml-auto rounded border border-asphalt/15 bg-navy-800 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
          /
        </kbd>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <ClientOnly fallback={<div className="h-9 w-40" />}>
          <Stats />
        </ClientOnly>
      </div>
    </header>
  );
}
