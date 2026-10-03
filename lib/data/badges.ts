import type { BadgeDef } from "./types";

export const BADGES: BadgeDef[] = [
  {
    id: "first-steps",
    name: "Ignition",
    description: "Complete your very first room.",
    icon: "Power",
    accent: "cyan",
    criteria: "Complete 1 room",
  },
  {
    id: "sign-master",
    name: "Sign Master",
    description: "Score 100% on a road-signs quiz.",
    icon: "OctagonAlert",
    accent: "signal",
    criteria: "Perfect a signs room",
  },
  {
    id: "perfect-parker",
    name: "Perfect Parker",
    description: "Ace the Yard Test Manoeuvres room.",
    icon: "ParkingSquare",
    accent: "cyan",
    criteria: "Perfect the yard-test room",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Study after 10pm — the road never sleeps.",
    icon: "Moon",
    accent: "amber",
    criteria: "Study after 22:00",
  },
  {
    id: "iron-rider",
    name: "Iron Rider",
    description: "Finish the entire Code 1 motorcycle path.",
    icon: "Bike",
    accent: "amber",
    criteria: "Complete the Code 1 path",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Keep a 7-day study streak alive.",
    icon: "Flame",
    accent: "amber",
    criteria: "Reach a 7-day streak",
  },
  {
    id: "mock-pass",
    name: "Test Ready",
    description: "Pass a full mock test.",
    icon: "BadgeCheck",
    accent: "grass",
    criteria: "Pass a mock test",
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    description: "Answer 50 questions correctly.",
    icon: "Target",
    accent: "grass",
    criteria: "50 correct answers",
  },
  {
    id: "level-10",
    name: "Road Scholar",
    description: "Reach level 10.",
    icon: "Crown",
    accent: "cyan",
    criteria: "Reach level 10",
  },
];

export function badgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}
