import type { Difficulty, Question, RoadSign } from "./types";
import { SIGNS } from "./signs";
import { shuffle } from "@/lib/utils";

/**
 * One image question per road sign, generated from the verified sign data so
 * the question bank always matches the sign library. Wrong answers are drawn
 * from the same group first (look-alikes are what the real test uses), then
 * the same category. Shuffles are seeded per sign so SSR and client agree.
 */

function seedFrom(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (Math.abs(h) % 2147483646) + 1;
}

const DIFFICULTY: Record<string, Difficulty> = {
  Control: "Easy",
  Command: "Easy",
  Prohibition: "Medium",
  Junctions: "Medium",
  "Curves and layout": "Medium",
  "Road users and animals": "Easy",
  "Surface and hazards": "Medium",
  Reservation: "Hard",
  Comprehensive: "Hard",
  Information: "Hard",
  Roadworks: "Medium",
};

function distractors(sign: RoadSign, seed: number): string[] {
  const pick = (pool: RoadSign[]) => shuffle(pool, seed).map((s) => s.name);
  const sameGroup = pick(SIGNS.filter((s) => s.id !== sign.id && s.group === sign.group));
  const sameCat = pick(SIGNS.filter((s) => s.id !== sign.id && s.category === sign.category && s.group !== sign.group));
  const rest = pick(SIGNS.filter((s) => s.category !== sign.category));
  const out: string[] = [];
  for (const n of [...sameGroup.slice(0, 2), ...sameCat, ...sameGroup.slice(2), ...rest]) {
    if (n !== sign.name && !out.includes(n)) out.push(n);
    if (out.length === 3) break;
  }
  return out;
}

export const SIGN_QUESTIONS: Question[] = SIGNS.map((sign) => {
  const seed = seedFrom(sign.id);
  const options = shuffle([sign.name, ...distractors(sign, seed)], seed + 7);
  return {
    id: `sign-auto-${sign.id}`,
    category: "Road Signs & Markings",
    type: "image",
    codes: ["1", "2", "3"],
    prompt: "What does this sign mean?",
    signId: sign.id,
    options,
    answer: options.indexOf(sign.name),
    explanation: [sign.meaning, sign.action].filter(Boolean).join(" "),
    reference: `SADC-RTSM — ${sign.category} sign ${sign.code}`,
    difficulty: DIFFICULTY[sign.group] ?? "Medium",
  };
});
