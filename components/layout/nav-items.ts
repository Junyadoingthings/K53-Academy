export const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "LayoutDashboard" },
  { href: "/paths", label: "Paths", icon: "Waypoints" },
  { href: "/practice", label: "Practice", icon: "Dumbbell" },
  { href: "/signs", label: "Signs", icon: "OctagonAlert" },
  { href: "/mock-test", label: "Mock Test", icon: "FileCheck2" },
  { href: "/leaderboard", label: "Leaderboard", icon: "Trophy" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;

/** Subset shown in the mobile bottom bar. */
export const MOBILE_NAV = [
  { href: "/dashboard", label: "Home", icon: "LayoutDashboard" },
  { href: "/paths", label: "Paths", icon: "Waypoints" },
  { href: "/practice", label: "Practice", icon: "Dumbbell" },
  { href: "/leaderboard", label: "Ranks", icon: "Trophy" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;
