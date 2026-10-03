export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Learn",
    items: [
      { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
      { href: "/paths", label: "Learning paths", icon: "Route" },
      { href: "/signs", label: "Road signs", icon: "OctagonAlert" },
    ],
  },
  {
    label: "Test yourself",
    items: [
      { href: "/practice", label: "Practice", icon: "Target" },
      { href: "/mock-test", label: "Mock test", icon: "ClipboardCheck" },
    ],
  },
  {
    label: "You",
    items: [
      { href: "/leaderboard", label: "Leaderboard", icon: "Trophy" },
      { href: "/profile", label: "Profile", icon: "CircleUser" },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

/** Subset shown in the mobile bottom bar. */
export const MOBILE_NAV = [
  { href: "/dashboard", label: "Home", icon: "LayoutDashboard" },
  { href: "/paths", label: "Paths", icon: "Route" },
  { href: "/signs", label: "Signs", icon: "OctagonAlert" },
  { href: "/mock-test", label: "Test", icon: "ClipboardCheck" },
  { href: "/profile", label: "Profile", icon: "CircleUser" },
] as const;
