"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { PATHS } from "@/lib/data/paths";
import { cn } from "@/lib/utils";

const accentBorder = {
  cyan: "hover:border-cyan/50 hover:shadow-neon",
  amber: "hover:border-amber/50 hover:shadow-neon-amber",
  grass: "hover:border-grass/50 hover:shadow-neon-green",
  signal: "hover:border-signal/50 hover:shadow-neon-red",
} as const;

const accentText = {
  cyan: "text-cyan bg-cyan/10 border-cyan/30",
  amber: "text-amber bg-amber/10 border-amber/30",
  grass: "text-grass bg-grass/10 border-grass/30",
  signal: "text-signal-soft bg-signal/10 border-signal/30",
} as const;

function PathsGrid() {
  const completedRooms = useStore((s) => s.completedRooms);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PATHS.map((path, i) => {
        const Icon = (Icons[path.icon as keyof typeof Icons] ?? Icons.Waypoints) as React.ComponentType<{
          className?: string;
        }>;
        const done = path.roomIds.filter((r) => completedRooms.includes(r)).length;
        const pct = Math.round((done / path.roomIds.length) * 100);
        return (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/paths/${path.slug}`}>
              <Card className={cn("group h-full transition-all", accentBorder[path.accent])}>
                <CardBody className="p-5">
                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border",
                        accentText[path.accent]
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                        {path.subtitle}
                      </div>
                      <h3 className="font-heading text-xl font-bold text-ink">{path.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">{path.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {path.tags.map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-ink-muted">
                        {done}/{path.roomIds.length} rooms
                      </span>
                      <span className="font-mono text-ink-faint">{pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-navy-700">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          path.accent === "cyan" && "bg-cyan",
                          path.accent === "amber" && "bg-amber",
                          path.accent === "grass" && "bg-grass",
                          path.accent === "signal" && "bg-signal"
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function PathsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-ink">Learning Paths</h1>
        <p className="mt-1 text-ink-muted">
          Guided journeys that take you from zero to test-ready. Pick your goal and follow the road.
        </p>
      </div>
      <ClientOnly
        fallback={<div className="h-96 animate-pulse rounded-2xl bg-navy-850/70" />}
      >
        <PathsGrid />
      </ClientOnly>
    </div>
  );
}
