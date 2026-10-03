/**
 * Demo leaderboard data. In production this is a materialized view /
 * Prisma query ordered by XP, filterable by province and friends.
 */
export interface LeaderRow {
  rank: number;
  username: string;
  province: string;
  xp: number;
  level: number;
  streak: number;
}

export const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
] as const;

export const LEADERBOARD: LeaderRow[] = [
  { rank: 1, username: "TshianeDrives", province: "Gauteng", xp: 18420, level: 24, streak: 61 },
  { rank: 2, username: "CapeCruiser", province: "Western Cape", xp: 16980, level: 23, streak: 44 },
  { rank: 3, username: "DurbanDrift", province: "KwaZulu-Natal", xp: 15230, level: 22, streak: 38 },
  { rank: 4, username: "KarooKlutch", province: "Northern Cape", xp: 13110, level: 20, streak: 29 },
  { rank: 5, username: "SowetoSignals", province: "Gauteng", xp: 12740, level: 20, streak: 51 },
  { rank: 6, username: "BokkieBiker", province: "Free State", xp: 11890, level: 19, streak: 17 },
  { rank: 7, username: "MzansiMerge", province: "Mpumalanga", xp: 10450, level: 18, streak: 22 },
  { rank: 8, username: "PretoriaPark", province: "Gauteng", xp: 9870, level: 17, streak: 12 },
  { rank: 9, username: "NelspruitNav", province: "Mpumalanga", xp: 8640, level: 16, streak: 9 },
  { rank: 10, username: "LimpopoLane", province: "Limpopo", xp: 7920, level: 15, streak: 14 },
  { rank: 11, username: "GqeberhaGear", province: "Eastern Cape", xp: 7310, level: 15, streak: 6 },
  { rank: 12, username: "RustenburgRev", province: "North West", xp: 6680, level: 14, streak: 3 },
];
