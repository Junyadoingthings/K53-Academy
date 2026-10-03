"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { loadProgressForUser } from "@/lib/store";
import { LogoMark } from "@/components/brand/logo";

/**
 * Restores the signed-in user's progress on a fresh load / reload, so their
 * data comes back after closing the tab. Mounted once in the root layout.
 */
export function AppBoot() {
  const hydrated = useAuth((s) => s.hydrated);
  const currentUserId = useAuth((s) => s.currentUserId);
  const loadedFor = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!hydrated || !currentUserId) return;
    if (loadedFor.current === currentUserId) return;
    loadedFor.current = currentUserId;
    loadProgressForUser(currentUserId);
  }, [hydrated, currentUserId]);

  return null;
}

function FullLoader() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <LogoMark size={64} />
        </div>
        <div className="flex gap-1.5">
          {["#E4002B", "#FFC21A", "#12B767"].map((c, i) => (
            <span
              key={c}
              className="h-2 w-2 animate-light-cycle rounded-full"
              style={{ background: c, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Gates the dashboard behind a signed-in session. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuth((s) => s.hydrated);
  const currentUserId = useAuth((s) => s.currentUserId);

  React.useEffect(() => {
    if (hydrated && !currentUserId) router.replace("/sign-in");
  }, [hydrated, currentUserId, router]);

  if (!hydrated || !currentUserId) return <FullLoader />;
  return <>{children}</>;
}
