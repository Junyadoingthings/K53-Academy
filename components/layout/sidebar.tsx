"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NAV_ITEMS } from "./nav-items";
import { XpBar } from "@/components/gamification/xp-bar";
import { ClientOnly } from "@/components/hydration";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-asphalt/[0.10] bg-navy-950/60 backdrop-blur-xl lg:flex">
      <div className="px-5 py-5">
        <Link href="/dashboard">
          <Logo size={38} />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = (Icons[item.icon as keyof typeof Icons] ?? Icons.Circle) as React.ComponentType<{
            className?: string;
          }>;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-cyan/10 text-cyan"
                  : "text-ink-muted hover:bg-asphalt/[0.06] hover:text-ink"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan shadow-neon" />
              )}
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-asphalt/[0.10] p-4">
        <ClientOnly fallback={<div className="h-16" />}>
          <XpBar />
        </ClientOnly>
        <p className="mt-3 text-center font-mono text-[10px] text-ink-faint">
          Created by Stanford (Junya) Mazibuko
        </p>
      </div>
    </aside>
  );
}
