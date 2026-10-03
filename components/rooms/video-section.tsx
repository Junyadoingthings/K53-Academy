"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Clock, X, Youtube } from "lucide-react";
import type { RoomVideo } from "@/lib/data/videos";
import { Card, CardBody } from "@/components/ui/card";

/**
 * Videos section for a room: a responsive grid of clickable YouTube thumbnails
 * that open a themed modal player. Thumbnails come straight from
 * img.youtube.com so no assets are stored.
 */
export function VideoSection({ videos }: { videos: RoomVideo[] }) {
  const [active, setActive] = React.useState<RoomVideo | null>(null);

  // Close on Escape and lock body scroll while the modal is open.
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!videos.length) return null;

  return (
    <Card>
      <CardBody className="p-5">
        <div className="mb-1 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan/10 text-cyan">
            <Youtube className="h-4 w-4" />
          </span>
          <h3 className="font-heading text-lg font-semibold text-ink">Watch &amp; learn</h3>
        </div>
        <p className="mb-4 text-sm text-ink-muted">
          Video lessons on the rules of the road from South African K53 educators. Tap any to play.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <motion.button
              key={v.id}
              type="button"
              onClick={() => setActive(v)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group overflow-hidden rounded-xl border border-asphalt/[0.10] bg-navy-800/40 text-left transition-all hover:border-cyan/40 hover:shadow-neon"
            >
              <div className="relative aspect-video overflow-hidden bg-navy-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-asphalt-950/70 via-transparent to-transparent" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-cyan text-white shadow-neon transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-asphalt-950/85 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">
                  <Clock className="h-3 w-3" /> {v.duration}
                </span>
              </div>
              <div className="p-3">
                <div className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-cyan">
                  {v.title}
                </div>
                <div className="mt-1 line-clamp-2 text-xs text-ink-muted">{v.description}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                  {v.source}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </CardBody>

      {/* Modal player */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[140] grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-asphalt-950/80 backdrop-blur-sm"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ scale: 0.94, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-asphalt/[0.10] bg-navy-850 shadow-card"
            >
              <div className="flex items-start justify-between gap-3 border-b border-asphalt/[0.10] px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate font-heading text-sm font-bold text-ink">{active.title}</div>
                  <div className="font-mono text-[11px] text-ink-faint">{active.source}</div>
                </div>
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close video"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-faint transition-all hover:bg-asphalt/[0.08] hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  key={active.id}
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
