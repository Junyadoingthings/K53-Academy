import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";
import { GridBackdrop } from "@/components/backgrounds";
import { BadgeToast } from "@/components/gamification/badge-toast";
import { AchievementWatcher } from "@/components/gamification/achievement-watcher";
import { XpToaster } from "@/components/gamification/xp-toaster";
import { LevelUpModal } from "@/components/gamification/level-up-modal";
import { RoboInstructor } from "@/components/assistant/robo-instructor";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <GridBackdrop />
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 lg:px-8 lg:pb-12">{children}</main>
      </div>
      <BottomNav />
      <BadgeToast />
      <XpToaster />
      <LevelUpModal />
      <RoboInstructor />
      <AchievementWatcher />
    </div>
  );
}
