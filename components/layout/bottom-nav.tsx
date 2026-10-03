"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Circle } from "lucide-react";
import { iconFor } from "@/components/ui/icon";
import { MOBILE_NAV } from "./nav-items";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t border-asphalt/[0.08] pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {MOBILE_NAV.map((item) => {
          const Icon = iconFor(item.icon, Circle);
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
                active ? "text-ink" : "text-ink-faint"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-cyan")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
