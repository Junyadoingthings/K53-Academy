import { NextResponse } from "next/server";
import { retrieveContext } from "@/lib/assistant/knowledge";

export const runtime = "nodejs";

/**
 * Optional Claude-powered assistant. Activates only when ANTHROPIC_API_KEY is
 * set; otherwise returns 501 so the client falls back to the local retrieval
 * engine (lib/assistant/knowledge.ts) — the app works either way.
 *
 * Uses the current Claude model (claude-opus-4-8) with adaptive thinking,
 * grounded in the app's own K53 content via retrieval. Called with native
 * fetch to avoid adding an SDK dependency to the demo; to use the official SDK
 * instead: `npm i @anthropic-ai/sdk` and swap the fetch for
 * `new Anthropic().messages.create(...)`.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM = `You are "Robo-Instructor", the friendly in-app AI tutor for K53 Academy — a gamified app that helps South Africans pass their Learner's and Driver's licence tests (Code 1 motorcycles, Code 2 light vehicles, Code 3 heavy vehicles).

Rules:
- Answer ONLY from the K53 / SARTSM syllabus and the app context provided. If something isn't covered, say so briefly and suggest what to study in the app.
- Be concise, warm and encouraging — a sentence or two, plain language, South African context.
- Never give legal advice or guarantee a pass; you teach the concepts.
- When relevant, point users to the right part of the app (Rooms, Road Signs trainer, Mock Test, Practice).
- Do not use emoji.`;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "assistant-not-configured" }, { status: 501 });
  }

  let body: { message?: string; history?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  const message = (body.message ?? "").slice(0, 2000);
  if (!message.trim()) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  const context = retrieveContext(message, 6);
  const history = (body.history ?? []).slice(-6);

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    {
      role: "user" as const,
      content: `App context (K53 content most relevant to the question):\n${context}\n\n---\nQuestion: ${message}`,
    },
  ];

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        system: SYSTEM,
        thinking: { type: "adaptive" },
        output_config: { effort: "low" },
        messages,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Anthropic API error", res.status, detail);
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }

    const data = await res.json();
    const text = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ text: text || "Sorry, I couldn't generate a reply just now." });
  } catch (e) {
    console.error("chat route error", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
