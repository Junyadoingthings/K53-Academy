import { SIGNS } from "@/lib/data/signs";
import { QUESTIONS } from "@/lib/data/questions";
import { ROOMS } from "@/lib/data/rooms";
import { PATHS } from "@/lib/data/paths";

/**
 * "Robo-Instructor" knowledge base + local answer engine.
 *
 * Builds a searchable index from the app's own K53 content (signs, questions,
 * rooms, paths) plus a small FAQ, and answers questions with keyword-scored
 * retrieval. This runs entirely client-side with zero setup, so the assistant
 * always works. When an ANTHROPIC_API_KEY is configured, the chat UI first
 * tries /api/chat (real Claude, grounded in this same content) and only falls
 * back to this engine — see app/api/chat/route.ts.
 */

export interface Doc {
  id: string;
  kind: "sign" | "question" | "room" | "path" | "faq";
  title: string;
  body: string;
  signId?: string;
}

export interface Answer {
  text: string;
  sources: { label: string; kind: Doc["kind"] }[];
  signId?: string;
}

const FAQ: Doc[] = [
  {
    id: "faq-structure",
    kind: "faq",
    title: "How many questions are in the K53 learner's test and what are the pass marks?",
    body: "The official K53 learner's test has 68 questions in three sections: Vehicle Controls (8 questions, pass 6), Road Signs & Markings (30 questions, pass 23), and Rules of the Road (30 questions, pass 22). You must pass every section. K53 Academy's Mock Test mirrors this exact structure with a 60-minute timer.",
  },
  {
    id: "faq-alcohol",
    kind: "faq",
    title: "What is the legal alcohol limit for driving in South Africa?",
    body: "The legal blood-alcohol limit is below 0.05 g per 100 ml of blood (0.24 mg per 1000 ml of breath). For professional drivers it is stricter, below 0.02 g. The only safe amount before driving is none.",
  },
  {
    id: "faq-following",
    kind: "faq",
    title: "What is a safe following distance?",
    body: "Use the two-second rule on dry roads: when the vehicle ahead passes a fixed point, you should reach it no sooner than two seconds later. Double it to at least four seconds in rain, fog, or at night. Heavy vehicles need even more.",
  },
  {
    id: "faq-k53-system",
    kind: "faq",
    title: "What is the K53 defensive driving system?",
    body: "The K53 system is Observe, Signal, Manoeuvre — always in that order, with observation before every action. Check mirrors, do a blind-spot check over your shoulder, signal your intention in good time, then move only when it is safe. Examiners score this rhythm on the driving test.",
  },
  {
    id: "faq-xp",
    kind: "faq",
    title: "How do XP, levels, streaks and RoadCoins work?",
    body: "You earn XP for every correct answer (+8), completed room (+120), daily check-in (+20), daily challenge (+90) and mock test. XP fills your level ring and unlocks ranks (Pedestrian to K53 Master) and badges. A daily study streak grows each day you check in — protect it with streak freezes bought using RoadCoins, the in-app currency you earn as you learn.",
  },
  {
    id: "faq-account",
    kind: "faq",
    title: "How do I sign in and does my progress save?",
    body: "Create an account with an email and password (or continue as a guest) from the sign-up screen. Your XP, streaks, badges and history are saved to your account and stay put even after you close the browser. Sign in again any time to pick up where you left off. You can also switch between light and dark mode from the top bar or your profile.",
  },
  {
    id: "faq-codes",
    kind: "faq",
    title: "What do Code 1, Code 2 and Code 3 mean?",
    body: "Code 1 (A1/A) is motorcycles; Code 2 (B) is light motor vehicles like cars and bakkies under 3 500 kg; Code 3 (C1/C/EC) is heavy vehicles like trucks and buses. Pick your code during onboarding and your rooms and questions adapt to it.",
  },
  {
    id: "faq-signs-shapes",
    kind: "faq",
    title: "How do I read road signs by shape and colour?",
    body: "Shape and colour tell you the type at a glance. An octagon is stop; an inverted triangle is yield. Round signs give commands (blue) or prohibitions (red ring) — red means don't, blue means do. Triangular signs with a red border warn of a hazard ahead. Rectangular blue signs give information; yellow diamond signs mark temporary roadworks.",
  },
  {
    id: "faq-premium",
    kind: "faq",
    title: "What does Premium cost and what do I get?",
    body: "Free covers 3 rooms per path, one mock test a week and the core question bank. Premium (R79/month or R499/year) unlocks everything: unlimited mock tests, advanced analytics, offline downloads and an ad-free experience. There is also an Instructor tier (R199/month) for driving schools to manage students. Payments use Paystack (cards, EFT, SnapScan).",
  },
];

let INDEX: Doc[] | null = null;

function buildIndex(): Doc[] {
  if (INDEX) return INDEX;
  const docs: Doc[] = [];

  for (const s of SIGNS) {
    docs.push({
      id: `sign-${s.id}`,
      kind: "sign",
      title: `${s.name} sign`,
      body: `${s.name} is a ${s.category.toLowerCase()} road sign (code ${s.code}). ${s.meaning}`,
      signId: s.id,
    });
  }
  for (const q of QUESTIONS) {
    docs.push({
      id: `q-${q.id}`,
      kind: "question",
      title: q.prompt,
      body: `${q.prompt} The correct answer is "${q.options[q.answer]}". ${q.explanation} (Reference: ${q.reference}.)`,
    });
  }
  for (const r of ROOMS) {
    docs.push({
      id: `room-${r.id}-intro`,
      kind: "room",
      title: `${r.title} (room)`,
      body: `${r.title}: ${r.tagline} ${r.intro}`,
    });
    for (const sec of r.sections) {
      docs.push({
        id: `room-${r.id}-${sec.heading}`,
        kind: "room",
        title: `${r.title} — ${sec.heading}`,
        body: `${sec.body}${sec.tip ? ` Tip: ${sec.tip}` : ""}`,
      });
    }
  }
  for (const p of PATHS) {
    docs.push({
      id: `path-${p.id}`,
      kind: "path",
      title: `${p.title} (learning path)`,
      body: `${p.title} — ${p.subtitle}. ${p.description}`,
    });
  }
  docs.push(...FAQ);

  INDEX = docs;
  return docs;
}

const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "were", "of", "to", "in", "on", "at", "for",
  "and", "or", "do", "does", "how", "what", "when", "where", "why", "which", "who",
  "i", "you", "my", "me", "it", "this", "that", "can", "should", "would", "if", "with",
  "be", "as", "so", "about", "tell", "explain", "mean", "means", "whats", "hey", "hi",
]);

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => t.length > 1 && !STOP.has(t));
}

/** Retrieve the most relevant docs for a query. */
export function retrieve(query: string, limit = 3): Doc[] {
  const docs = buildIndex();
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  const uniq = Array.from(new Set(qTokens));

  const scored = docs.map((doc) => {
    const title = doc.title.toLowerCase();
    const body = doc.body.toLowerCase();
    let score = 0;
    for (const t of uniq) {
      if (title.includes(t)) score += 3;
      if (body.includes(t)) score += 1;
    }
    // small boost for signs/faq when the query mentions "sign" / question words
    if (doc.kind === "sign" && query.toLowerCase().includes("sign")) score += 1;
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.doc);
}

/** Compact context string for the LLM route (grounding). */
export function retrieveContext(query: string, limit = 5): string {
  return retrieve(query, limit)
    .map((d) => `• ${d.title}\n${d.body}`)
    .join("\n\n");
}

export const SUGGESTIONS = [
  "What does a yield sign mean?",
  "How many questions are in the mock test?",
  "What is the K53 defensive driving system?",
  "What is the legal alcohol limit?",
  "How do XP and streaks work?",
];

/** Local, no-network answer. */
export function answerLocally(query: string): Answer {
  const q = query.trim().toLowerCase();

  if (/^(hi|hey|hello|howzit|molo|sawubona|dumela)\b/.test(q) || q === "") {
    return {
      text: "Howzit! I'm your Robo-Instructor. Ask me anything about K53 — road signs, the rules of the road, the mock test, or how the app works. Try one of the suggestions below.",
      sources: [],
    };
  }
  if (/(thank|thanks|dankie|shot|nice one)/.test(q)) {
    return { text: "Anytime — keep that streak alive and you'll ace the test.", sources: [] };
  }

  const hits = retrieve(query, 3);
  if (hits.length === 0) {
    return {
      text: "I couldn't find that in the K53 material yet. Try rephrasing, or ask about a specific road sign, a rule of the road, the mock test structure, or how XP, streaks and sign-in work.",
      sources: [],
    };
  }

  const top = hits[0];
  let text: string;
  if (top.kind === "sign") text = top.body;
  else if (top.kind === "question") text = top.body;
  else text = top.body;

  // Weave in a second hit if it adds something distinct.
  const extra = hits[1];
  if (extra && extra.kind !== "sign" && extra.body.length < 240) {
    text += `\n\nAlso worth knowing: ${extra.body}`;
  }

  return {
    text,
    signId: top.signId,
    sources: hits.slice(0, 2).map((d) => ({ label: d.title, kind: d.kind })),
  };
}
