"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { MOBILE_NAV } from "./nav-items";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-asphalt/[0.10] bg-navy-950/90 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {MOBILE_NAV.map((item) => {
          const Icon = (Icons[item.icon as keyof typeof Icons] ?? Icons.Circle) as React.ComponentType<{
            className?: string;
          }>;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-cyan" : "text-ink-faint"
              )}
            >
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-cyan shadow-neon" />}
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
