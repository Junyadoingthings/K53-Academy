"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";
const KEY = "k53-theme";
const EVENT = "k53themechange";

function read(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(KEY) as Theme) || "dark";
}

export function applyTheme(t: Theme) {
  const el = document.documentElement;
  el.classList.remove("dark", "light");
  el.classList.add(t);
  el.style.colorScheme = t;
  localStorage.setItem(KEY, t);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: t }));
}

/** Subscribe to the current theme; updates when toggled anywhere. */
export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>("dark");
  React.useEffect(() => {
    setTheme(read());
    const h = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener(EVENT, h);
    return () => window.removeEventListener(EVENT, h);
  }, []);
  return {
    theme,
    isDark: theme === "dark",
    toggle: () => applyTheme(theme === "dark" ? "light" : "dark"),
    set: applyTheme,
  };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-full border border-asphalt/15 bg-navy-800/60 text-ink-muted transition-all hover:border-cyan/50 hover:text-cyan",
        className
      )}
    >
      <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
