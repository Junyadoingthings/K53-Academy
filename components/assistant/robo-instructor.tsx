"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
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
  text: "Hi! I'm your K53 instructor. Ask me about road signs, the rules of the road, the learner's test or how the app works.",
};

export function RoboInstructor() {
  const pathname = usePathname();
  const focusMode = /^\/(rooms|mock-test)/.test(pathname);
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
        whileTap={{ scale: 0.96 }}
        aria-label={open ? "Close instructor chat" : "Ask the instructor"}
        title={open ? "Close" : "Ask the instructor"}
        className={cn(
          "fixed bottom-24 right-4 z-[95] h-12 w-12 place-items-center rounded-full bg-ink text-navy-900 shadow-pop transition-colors hover:bg-ink/90 lg:bottom-6 lg:right-6",
          focusMode && !open ? "hidden lg:grid" : "grid"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>

      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-40 right-4 z-[95] flex h-[540px] max-h-[70vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-asphalt/[0.10] bg-navy-850 shadow-pop lg:bottom-20 lg:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-asphalt/[0.08] px-4 py-3">
              <LogoMark size={28} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">K53 instructor</div>
                <div className="text-[11px] text-ink-faint">Answers are for study only — check the official manual</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-faint hover:text-ink">
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
                      className="flex w-full items-center rounded-lg border border-asphalt/[0.10] px-3 py-2 text-left text-[13px] text-ink-muted transition-colors hover:bg-navy-800 hover:text-ink"
                    >
                      {s}
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
              className="flex items-center gap-2 border-t border-asphalt/[0.08] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about K53…"
                className="w-full rounded-lg border border-asphalt/[0.12] bg-navy-900 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-cyan/50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-navy-900 transition-colors hover:bg-ink/85 disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
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
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-3.5 py-2 text-sm text-navy-900">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-navy-800 px-3.5 py-2.5 text-sm text-ink">
        {sign && (
          <div className="mb-2 flex justify-center rounded-lg bg-navy-850 py-3">
            <RoadSignSVG sign={sign} size={72} />
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {msg.sources.map((s, i) => (
              <span
                key={i}
                className="rounded border border-asphalt/[0.10] px-1.5 py-0.5 text-[10px] text-ink-faint"
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
