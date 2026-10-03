"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { TrafficLight } from "@/components/brand/traffic-light";
import { RoadSignSVG } from "@/components/signs/road-sign";
import { signById } from "@/lib/data/signs";
import { answerLocally, SUGGESTIONS } from "@/lib/assistant/knowledge";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  text: string;
  sources?: { label: string; kind: string }[];
  signId?: string;
}

const WELCOME: Msg = {
  role: "assistant",
  text: "Howzit! I'm your Robo-Instructor. Ask me anything about K53 — road signs, rules of the road, the mock test, or how the app works.",
};

export function RoboInstructor() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([WELCOME]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.text }));
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);

    let replied = false;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: q, history }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setMessages((m) => [...m, { role: "assistant", text: data.text }]);
          replied = true;
        }
      }
    } catch {
      /* fall through to local */
    }

    if (!replied) {
      const a = answerLocally(q);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: a.text, sources: a.sources, signId: a.signId },
      ]);
    }
    setBusy(false);
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Robo-Instructor assistant"
        className="fixed bottom-24 right-4 z-[95] grid h-14 w-14 place-items-center rounded-full bg-cyan text-white shadow-neon lg:bottom-6 lg:right-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-6 w-6" fill="currentColor" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-navy-900 bg-grass" />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-40 right-4 z-[95] flex h-[540px] max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-asphalt/[0.10] bg-navy-850 shadow-card lg:bottom-24 lg:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-asphalt/[0.10] bg-navy-900/60 px-4 py-3">
              <TrafficLight size={22} active="all" horizontal />
              <div className="flex-1">
                <div className="font-heading text-sm font-bold text-ink">Robo-Instructor</div>
                <div className="flex items-center gap-1 text-[11px] text-grass">
                  <span className="h-1.5 w-1.5 rounded-full bg-grass" /> Online · K53 tutor
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-ink-faint hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <Bubble key={i} msg={m} />
              ))}
              {busy && (
                <div className="flex items-center gap-1.5 pl-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-2 w-2 animate-light-cycle rounded-full bg-ink-faint"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              )}

              {messages.length <= 1 && (
                <div className="space-y-1.5 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="flex w-full items-center gap-1.5 rounded-xl border border-asphalt/[0.10] bg-navy-800/50 px-3 py-2 text-left text-xs text-ink-muted transition-all hover:border-cyan/40 hover:text-ink"
                    >
                      <Sparkles className="h-3 w-3 shrink-0 text-cyan" /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-asphalt/[0.10] bg-navy-900/40 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about K53…"
                className="w-full rounded-xl border border-asphalt/15 bg-navy-800/60 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-cyan/50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan text-white shadow-neon transition-all hover:bg-cyan-soft disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const sign = msg.signId ? signById(msg.signId) : undefined;
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-cyan px-3.5 py-2 text-sm text-white">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-asphalt/[0.10] bg-navy-800/60 px-3.5 py-2.5 text-sm text-ink">
        {sign && (
          <div className="mb-2 flex justify-center rounded-xl bg-navy-900/60 py-3">
            <RoadSignSVG sign={sign} size={72} />
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {msg.sources.map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-asphalt/[0.10] bg-navy-900/50 px-2 py-0.5 text-[10px] text-ink-faint"
              >
                {s.kind}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
