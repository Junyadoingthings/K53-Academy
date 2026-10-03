"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { evaluateBadges } from "@/lib/achievements";

/**
 * Watches the store and unlocks any newly-earned badges. Mounted once in
 * the app shell so unlocks fire from anywhere (rooms, quizzes, mocks).
 */
export function AchievementWatcher({ mockPassed = false }: { mockPassed?: boolean }) {
  const s = useStore();

  React.useEffect(() => {
    if (!s.hydrated) return;
    const earned = evaluateBadges({
      xp: s.xp,
      streak: s.streak,
      completedRooms: s.completedRooms,
      perfectRooms: s.perfectRooms,
      categoryStats: s.categoryStats,
      mockPassed,
      hour: new Date().getHours(),
    });
    for (const id of earned) {
      if (!s.badges.includes(id)) s.unlockBadge(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.xp, s.streak, s.completedRooms, s.perfectRooms, s.categoryStats, s.hydrated, mockPassed]);

  return null;
}
