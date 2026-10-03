import { BADGES } from "./data/badges";
import { levelFromXp } from "./xp-engine";

interface EvalInput {
  xp: number;
  streak: number;
  completedRooms: string[];
  perfectRooms: string[];
  categoryStats: Record<string, { correct: number; total: number }>;
  mockPassed: boolean;
  hour: number; // current hour 0-23
}

/**
 * Returns the set of badge ids the user currently qualifies for.
 * Callers diff this against already-unlocked badges to fire toasts.
 */
export function evaluateBadges(input: EvalInput): string[] {
  const earned = new Set<string>();
  const { xp, streak, completedRooms, perfectRooms, categoryStats, mockPassed, hour } = input;
  const level = levelFromXp(xp).level;

  const totalCorrect = Object.values(categoryStats).reduce((a, c) => a + c.correct, 0);

  if (completedRooms.length >= 1) earned.add("first-steps");
  if (perfectRooms.some((r) => r.startsWith("signs-"))) earned.add("sign-master");
  if (perfectRooms.includes("yard-test")) earned.add("perfect-parker");
  if (hour >= 22 || hour < 4) earned.add("night-owl");
  if (streak >= 7) earned.add("streak-7");
  if (mockPassed) earned.add("mock-pass");
  if (totalCorrect >= 50) earned.add("sharpshooter");
  if (level >= 10) earned.add("level-10");

  const code1Rooms = ["rules-basics", "controls-moto", "defensive-driving", "pretrip", "emergencies"];
  if (code1Rooms.every((r) => completedRooms.includes(r))) earned.add("iron-rider");

  return BADGES.map((b) => b.id).filter((id) => earned.has(id));
}
