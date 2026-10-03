/**
 * XP & Level engine for K53 Academy.
 *
 * Level curve is a gentle super-linear ramp so early levels feel fast
 * (dopamine!) and later levels take real commitment. Ranks give each
 * band a themed driving identity, TryHackMe-style.
 */

export const XP_REWARDS = {
  roomComplete: 120,
  perfectRoom: 60, // bonus on top of roomComplete
  questionCorrect: 8,
  questionFirstTry: 4, // bonus
  dailyChallenge: 90,
  mockTestComplete: 150,
  mockTestPass: 100, // bonus
  signRushPoint: 3,
  streakDay: 20,
} as const;

/** Total cumulative XP required to *reach* a given level. */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  // 100 * sum(i^1.35) — smooth curve
  let total = 0;
  for (let i = 1; i < level; i++) total += Math.round(100 * Math.pow(i, 1.35));
  return total;
}

export interface LevelState {
  level: number;
  currentLevelXp: number; // xp into the current level
  levelSpan: number; // xp needed to clear current level
  progress: number; // 0..1 through current level
  nextLevelXp: number; // total xp to hit next level
  rank: Rank;
}

export function levelFromXp(totalXp: number): LevelState {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp) level++;
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const levelSpan = next - base;
  const currentLevelXp = totalXp - base;
  return {
    level,
    currentLevelXp,
    levelSpan,
    progress: levelSpan > 0 ? currentLevelXp / levelSpan : 1,
    nextLevelXp: next,
    rank: rankForLevel(level),
  };
}

export interface Rank {
  name: string;
  min: number;
  color: string; // tailwind text color token
  glow: string;
}

const RANKS: Rank[] = [
  { name: "Pedestrian", min: 1, color: "text-ink-muted", glow: "shadow-none" },
  { name: "Learner", min: 3, color: "text-cyan", glow: "shadow-neon" },
  { name: "Rookie Driver", min: 6, color: "text-cyan", glow: "shadow-neon" },
  { name: "Road Scholar", min: 10, color: "text-grass", glow: "shadow-neon-green" },
  { name: "Defensive Ace", min: 15, color: "text-amber", glow: "shadow-neon-amber" },
  { name: "Highway Veteran", min: 22, color: "text-amber", glow: "shadow-neon-amber" },
  { name: "K53 Master", min: 30, color: "text-signal", glow: "shadow-neon-red" },
];

export function rankForLevel(level: number): Rank {
  let rank = RANKS[0];
  for (const r of RANKS) if (level >= r.min) rank = r;
  return rank;
}
