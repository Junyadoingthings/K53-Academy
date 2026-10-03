"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { levelFromXp, XP_REWARDS } from "./xp-engine";
import { newCard, reviewCard, qualityFrom, type ReviewCard } from "./spaced-repetition";

/**
 * Demo state store. In production this is replaced by Supabase + Prisma
 * (see prisma/schema.prisma and lib/db.ts). Everything here persists to
 * localStorage so the whole gamification loop is playable with no backend.
 */

export type LicenseGoal = "learners" | "drivers" | "both";
export type VehicleCode = "1" | "2" | "3";

export interface OnboardingProfile {
  completed: boolean;
  username: string;
  license: LicenseGoal;
  code: VehicleCode;
  province: string;
  testDate: string | null;
}

interface XpEvent {
  id: string;
  amount: number;
  reason: string;
  at: number;
}

interface Store {
  hydrated: boolean;
  profile: OnboardingProfile;
  xp: number;
  coins: number; // in-app currency for streak freezes
  streak: number;
  lastStudyDay: string | null;
  freezes: number;
  completedRooms: string[];
  perfectRooms: string[];
  badges: string[];
  reviewCards: Record<string, ReviewCard>;
  categoryStats: Record<string, { correct: number; total: number }>;
  xpLog: XpEvent[];
  dailyChallengeDoneOn: string | null;
  lastBadgeUnlocked: string | null;

  // actions
  setHydrated: () => void;
  setProfile: (p: Partial<OnboardingProfile>) => void;
  awardXp: (amount: number, reason: string) => void;
  addCoins: (n: number) => void;
  recordAnswer: (args: {
    questionId: string;
    category: string;
    correct: boolean;
    fast: boolean;
  }) => void;
  completeRoom: (roomId: string, perfect: boolean) => void;
  touchStreak: () => void;
  buyFreeze: () => boolean;
  unlockBadge: (id: string) => void;
  clearBadgeToast: () => void;
  markDailyDone: () => void;
  reset: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const initialProfile: OnboardingProfile = {
  completed: false,
  username: "",
  license: "learners",
  code: "2",
  province: "Gauteng",
  testDate: null,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profile: initialProfile,
      xp: 0,
      coins: 50,
      streak: 0,
      lastStudyDay: null,
      freezes: 1,
      completedRooms: [],
      perfectRooms: [],
      badges: [],
      reviewCards: {},
      categoryStats: {},
      xpLog: [],
      dailyChallengeDoneOn: null,
      lastBadgeUnlocked: null,

      setHydrated: () => set({ hydrated: true }),

      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),

      awardXp: (amount, reason) =>
        set((s) => ({
          xp: s.xp + amount,
          coins: s.coins + Math.round(amount / 20),
          xpLog: [
            { id: crypto.randomUUID(), amount, reason, at: Date.now() },
            ...s.xpLog,
          ].slice(0, 60),
        })),

      addCoins: (n) => set((s) => ({ coins: s.coins + n })),

      recordAnswer: ({ questionId, category, correct, fast }) =>
        set((s) => {
          const existing = s.reviewCards[questionId] ?? newCard(questionId);
          const updated = reviewCard(existing, qualityFrom(correct, fast));
          const cat = s.categoryStats[category] ?? { correct: 0, total: 0 };
          const xpGain = correct
            ? XP_REWARDS.questionCorrect + (fast ? XP_REWARDS.questionFirstTry : 0)
            : 0;
          return {
            reviewCards: { ...s.reviewCards, [questionId]: updated },
            categoryStats: {
              ...s.categoryStats,
              [category]: {
                correct: cat.correct + (correct ? 1 : 0),
                total: cat.total + 1,
              },
            },
            xp: s.xp + xpGain,
            coins: s.coins + (correct ? 1 : 0),
          };
        }),

      completeRoom: (roomId, perfect) =>
        set((s) => {
          if (s.completedRooms.includes(roomId)) return s;
          const gain =
            XP_REWARDS.roomComplete + (perfect ? XP_REWARDS.perfectRoom : 0);
          return {
            completedRooms: [...s.completedRooms, roomId],
            perfectRooms: perfect ? [...s.perfectRooms, roomId] : s.perfectRooms,
            xp: s.xp + gain,
            coins: s.coins + 10,
            xpLog: [
              {
                id: crypto.randomUUID(),
                amount: gain,
                reason: `Completed room${perfect ? " (perfect!)" : ""}`,
                at: Date.now(),
              },
              ...s.xpLog,
            ].slice(0, 60),
          };
        }),

      touchStreak: () =>
        set((s) => {
          const t = today();
          if (s.lastStudyDay === t) return s; // already counted today
          const yesterday = new Date(Date.now() - 86_400_000)
            .toISOString()
            .slice(0, 10);
          let streak = s.streak;
          let freezes = s.freezes;
          if (s.lastStudyDay === yesterday || s.lastStudyDay === null) {
            streak += 1;
          } else if (freezes > 0) {
            // Freeze protects the streak across a single missed day.
            freezes -= 1;
            streak += 1;
          } else {
            streak = 1;
          }
          return {
            streak,
            freezes,
            lastStudyDay: t,
            xp: s.xp + XP_REWARDS.streakDay,
          };
        }),

      buyFreeze: () => {
        const s = get();
        if (s.coins < 40) return false;
        set({ coins: s.coins - 40, freezes: s.freezes + 1 });
        return true;
      },

      unlockBadge: (id) =>
        set((s) =>
          s.badges.includes(id)
            ? s
            : { badges: [...s.badges, id], lastBadgeUnlocked: id }
        ),

      clearBadgeToast: () => set({ lastBadgeUnlocked: null }),

      markDailyDone: () =>
        set((s) => ({
          dailyChallengeDoneOn: today(),
          xp: s.xp + XP_REWARDS.dailyChallenge,
          coins: s.coins + 15,
        })),

      reset: () =>
        set({
          profile: initialProfile,
          xp: 0,
          coins: 50,
          streak: 0,
          lastStudyDay: null,
          freezes: 1,
          completedRooms: [],
          perfectRooms: [],
          badges: [],
          reviewCards: {},
          categoryStats: {},
          xpLog: [],
          dailyChallengeDoneOn: null,
          lastBadgeUnlocked: null,
        }),
    }),
    {
      // Storage name is swapped per signed-in user via loadProgressForUser().
      // skipHydration keeps us from loading anything until we know who's here.
      name: "k53-progress:none",
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);

/** Convenience selector hook for the derived level state. */
export function useLevel() {
  const xp = useStore((s) => s.xp);
  return levelFromXp(xp);
}

const progressKey = (userId: string) => `k53-progress:${userId}`;

/**
 * Point the persisted progress store at a specific user's slot and load it.
 * Fresh users start from defaults; returning users get their saved progress
 * back — surviving reloads and page closes.
 */
export async function loadProgressForUser(userId: string) {
  const name = progressKey(userId);
  useStore.persist.setOptions({ name });
  if (typeof window !== "undefined" && localStorage.getItem(name)) {
    await useStore.persist.rehydrate();
  } else {
    useStore.getState().reset();
  }
  useStore.setState({ hydrated: true });
}

/** Detach progress on sign-out without wiping the user's saved slot. */
export function detachProgress() {
  useStore.persist.setOptions({ name: "k53-progress:none" });
  useStore.getState().reset();
  useStore.setState({ hydrated: false });
}
