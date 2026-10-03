"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CornerDownLeft, Route, Search } from "lucide-react";
import { ROOMS } from "@/lib/data/rooms";
import { PATHS } from "@/lib/data/paths";
import { SIGNS } from "@/lib/data/signs";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { cn } from "@/lib/utils";

type Result =
  | { kind: "room"; id: string; title: string; sub: string; href: string }
  | { kind: "path"; id: string; title: string; sub: string; href: string }
  | { kind: "sign"; id: string; title: string; sub: string; href: string };

function search(q: string): Result[] {
  const n = q.trim().toLowerCase();
  const match = (...fields: string[]) => !n || fields.some((f) => f.toLowerCase().includes(n));
  const rooms: Result[] = ROOMS.filter((r) => match(r.title, r.tagline, r.category)).map((r) => ({
    kind: "room",
    id: r.id,
    title: r.title,
    sub: r.tagline,
    href: `/rooms/${r.slug}`,
  }));
  const paths: Result[] = PATHS.filter((p) => match(p.title, p.subtitle)).map((p) => ({
    kind: "path",
    id: p.id,
    title: p.title,
    sub: p.subtitle,
    href: `/paths/${p.slug}`,
  }));
  const signs: Result[] = n
    ? SIGNS.filter((s) => match(s.name, s.code, s.meaning)).map((s) => ({
        kind: "sign",
        id: s.id,
        title: s.name,
        sub: `${s.code} · ${s.category}`,
        href: `/signs?sign=${s.id}`,
      }))
    : [];
  return [...rooms.slice(0, 6), ...paths.slice(0, 3), ...signs.slice(0, 8)];
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const results = React.useMemo(() => search(q), [q]);

  React.useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  React.useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (r: Result) => {
    onClose();
    router.push(r.href);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-[12vh]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-label="Search"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-asphalt/[0.1] bg-navy-850 shadow-pop"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(results.length - 1, a + 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(0, a - 1));
          }
          if (e.key === "Enter" && results[active]) go(results[active]);
        }}
      >
        <div className="flex items-center gap-2 border-b border-asphalt/[0.08] px-4">
          <Search className="h-4 w-4 text-ink-faint" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lessons, paths and road signs…"
            className="h-12 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <kbd className="rounded border border-asphalt/[0.12] px-1.5 font-mono text-[10px] text-ink-faint">esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-1.5">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-ink-faint">No matches for “{q}”.</li>}
          {results.map((r, i) => {
            const sign = r.kind === "sign" ? SIGNS.find((s) => s.id === r.id) : undefined;
            return (
              <li key={`${r.kind}-${r.id}`}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left",
                    i === active ? "bg-navy-800" : ""
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-navy-800 text-ink-muted">
                    {sign ? (
                      <RoadSignSVG sign={sign} size={24} />
                    ) : r.kind === "path" ? (
                      <Route className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{r.title}</span>
                    <span className="block truncate text-xs text-ink-faint">{r.sub}</span>
                  </span>
                  {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-ink-faint" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
