"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Circle } from "lucide-react";
import { iconFor } from "@/components/ui/icon";
import { Logo } from "@/components/brand/logo";
import { NAV_SECTIONS } from "./nav-items";
import { XpBar } from "@/components/gamification/xp-bar";
import { ClientOnly } from "@/components/hydration";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-asphalt/[0.08] bg-navy-950 lg:flex">
      <div className="flex h-14 items-center px-5">
        <Link href="/dashboard" aria-label="K53 Academy home">
          <Logo size={26} />
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pt-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
              {section.label}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = iconFor(item.icon, Circle);
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-navy-800 font-medium text-ink"
                          : "text-ink-muted hover:bg-navy-800/70 hover:text-ink"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-cyan" : "text-ink-faint")} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-lg border border-asphalt/[0.08] bg-navy-850 p-3.5">
        <ClientOnly fallback={<div className="h-14" />}>
          <XpBar />
        </ClientOnly>
      </div>
    </aside>
  );
}
