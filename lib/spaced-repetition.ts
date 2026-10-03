/**
 * SM-2 spaced-repetition (SuperMemo 2) for the K53 question bank.
 *
 * Each question the user attempts gets a review card. Wrong answers reset the
 * repetition streak and shorten the interval; right answers grow it. The
 * "weak areas" surface = cards that are due AND have a low ease factor.
 */

export interface ReviewCard {
  questionId: string;
  repetitions: number; // consecutive correct recalls
  easeFactor: number; // >= 1.3
  interval: number; // days until next review
  dueDate: string; // ISO
  lapses: number; // total times forgotten
}

/** Quality of recall: 0 (blackout) .. 5 (perfect). We map answers to this. */
export type RecallQuality = 0 | 1 | 2 | 3 | 4 | 5;

export function newCard(questionId: string): ReviewCard {
  return {
    questionId,
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0,
    dueDate: new Date().toISOString(),
    lapses: 0,
  };
}

export function reviewCard(card: ReviewCard, quality: RecallQuality): ReviewCard {
  const now = Date.now();
  let { repetitions, easeFactor, interval, lapses } = card;

  if (quality < 3) {
    // Forgot it — restart, keep it in the near-term queue.
    repetitions = 0;
    interval = 1;
    lapses += 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  // Ease factor adjustment (bounded at 1.3).
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return {
    ...card,
    repetitions,
    easeFactor: Number(easeFactor.toFixed(2)),
    interval,
    lapses,
    dueDate: new Date(now + interval * 86_400_000).toISOString(),
  };
}

/** Map a simple correct/incorrect + confidence into SM-2 quality. */
export function qualityFrom(correct: boolean, fast: boolean): RecallQuality {
  if (!correct) return fast ? 1 : 2; // guessed wrong vs. thought and wrong
  return fast ? 5 : 4;
}

export function isDue(card: ReviewCard, at = Date.now()): boolean {
  return new Date(card.dueDate).getTime() <= at;
}

/** Weakest first: due cards sorted by lapses desc, then low ease. */
export function dueCards(cards: ReviewCard[], at = Date.now()): ReviewCard[] {
  return cards
    .filter((c) => isDue(c, at))
    .sort((a, b) => b.lapses - a.lapses || a.easeFactor - b.easeFactor);
}
