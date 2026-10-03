import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";
import { BadgeToast } from "@/components/gamification/badge-toast";
import { AchievementWatcher } from "@/components/gamification/achievement-watcher";
import { XpToaster } from "@/components/gamification/xp-toaster";
import { LevelUpModal } from "@/components/gamification/level-up-modal";
import { RoboInstructor } from "@/components/assistant/robo-instructor";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-60">
        <TopBar />
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">{children}</main>
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
