"use client";

import Link from "next/link";
import { Route } from "lucide-react";
import { iconFor } from "@/components/ui/icon";
import { ArrowRight } from "lucide-react";
import { Pill } from "@/components/ui/pill";
import { PageHeader } from "@/components/ui/page-header";
import { ClientOnly } from "@/components/hydration";
import { useStore } from "@/lib/store";
import { PATHS } from "@/lib/data/paths";
import { roomById } from "@/lib/data/rooms";
import { cn } from "@/lib/utils";

const CODE_NAMES = { "1": "Code 1", "2": "Code 2", "3": "Code 3" } as const;

function PathsGrid() {
  const completedRooms = useStore((s) => s.completedRooms);
  const myCode = useStore((s) => s.profile.code);

  const sorted = [...PATHS].sort((a, b) => Number(b.codes.includes(myCode)) - Number(a.codes.includes(myCode)));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sorted.map((path) => {
        const Icon = iconFor(path.icon, Route);
        const rooms = path.roomIds.map((id) => roomById(id)).filter(Boolean);
        const done = path.roomIds.filter((r) => completedRooms.includes(r)).length;
        const pct = Math.round((done / path.roomIds.length) * 100);
        const minutes = rooms.reduce((a, r) => a + (r?.estMinutes ?? 0), 0);
        const recommended = path.codes.includes(myCode);
        return (
          <Link
            key={path.id}
            href={`/paths/${path.slug}`}
            className="group flex flex-col rounded-xl border border-asphalt/[0.09] bg-navy-850 p-5 shadow-card transition-[border-color,box-shadow] hover:border-asphalt/[0.18] hover:shadow-raised"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy-800 text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex flex-wrap justify-end gap-1.5">
                {recommended && <Pill tone="cyan">For you</Pill>}
                {done === path.roomIds.length && <Pill tone="grass">Completed</Pill>}
              </div>
            </div>
            <h3 className="mt-4 text-[17px] font-semibold tracking-tight text-ink">{path.title}</h3>
            <div className="text-sm text-ink-muted">{path.subtitle}</div>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">{path.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
              <span>{path.roomIds.length} lessons</span>
              <span>·</span>
              <span>About {Math.round(minutes / 5) * 5} min</span>
              <span>·</span>
              <span>{path.codes.map((c) => CODE_NAMES[c]).join(", ")}</span>
            </div>

            <div className="mt-auto pt-5">
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-700">
                  <div className={cn("h-full rounded-full", pct === 100 ? "bg-grass" : "bg-cyan")} style={{ width: `${pct}%` }} />
                </div>
                <span className="tabular text-xs text-ink-muted">{pct}%</span>
                <ArrowRight className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function PathsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning paths"
        description="Structured courses that take you from your first lesson to test-ready. Paths for your licence code are shown first."
      />
      <ClientOnly fallback={<div className="h-96 animate-pulse rounded-xl bg-navy-850" />}>
        <PathsGrid />
      </ClientOnly>
    </div>
  );
}
