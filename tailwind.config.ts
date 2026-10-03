import type { Config } from "tailwindcss";

/**
 * K53 Academy design tokens.
 *
 * Neutral, product-grade surfaces with road-sign colours used as accents only:
 * RED for brand / primary actions, AMBER for streaks & caution, GREEN for
 * success. Surfaces and text flip between light and dark via CSS variables
 * (see app/globals.css).
 *
 * NOTE ON TOKEN NAMES (kept to avoid churn across the codebase):
 *   cyan   → brand RED (primary accent)
 *   amber  → AMBER (secondary / streaks)
 *   grass  → GREEN (success)
 *   signal → RED (errors / stop)
 *   navy   → neutral surfaces (page, cards, inputs, borders)
 *   ink    → text
 *   asphalt.DEFAULT → hairline colour; numbered shades are fixed darks.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: "rgb(var(--hairline) / <alpha-value>)",
          950: "#0B0C0E",
          900: "#111215",
          850: "#16181C",
          800: "#1D1F24",
          700: "#2A2D33",
          600: "#3E424A",
        },
        navy: {
          950: "rgb(var(--nv-950) / <alpha-value>)",
          900: "rgb(var(--nv-900) / <alpha-value>)",
          850: "rgb(var(--nv-850) / <alpha-value>)",
          800: "rgb(var(--nv-800) / <alpha-value>)",
          700: "rgb(var(--nv-700) / <alpha-value>)",
          600: "rgb(var(--nv-600) / <alpha-value>)",
        },
        cyan: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          soft: "rgb(var(--brand-soft) / <alpha-value>)",
          deep: "rgb(var(--brand-deep) / <alpha-value>)",
        },
        amber: {
          DEFAULT: "rgb(var(--amber) / <alpha-value>)",
          soft: "rgb(var(--amber-soft) / <alpha-value>)",
        },
        grass: {
          DEFAULT: "rgb(var(--green) / <alpha-value>)",
          soft: "rgb(var(--green-soft) / <alpha-value>)",
        },
        signal: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          soft: "rgb(var(--brand-soft) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Legacy "neon" names now map to quiet, neutral elevation.
        neon: "0 1px 2px rgb(16 24 40 / 0.08), 0 2px 8px -2px rgb(16 24 40 / 0.10)",
        "neon-amber": "0 1px 2px rgb(16 24 40 / 0.08), 0 2px 8px -2px rgb(16 24 40 / 0.10)",
        "neon-green": "0 1px 2px rgb(16 24 40 / 0.08), 0 2px 8px -2px rgb(16 24 40 / 0.10)",
        "neon-red": "0 1px 2px rgb(16 24 40 / 0.08), 0 2px 8px -2px rgb(16 24 40 / 0.10)",
        card: "0 1px 2px rgb(16 24 40 / 0.04)",
        raised: "0 1px 2px rgb(16 24 40 / 0.04), 0 8px 24px -8px rgb(16 24 40 / 0.12)",
        pop: "0 12px 40px -12px rgb(16 24 40 / 0.35)",
      },
      backgroundImage: {
        "radial-cyan": "none",
      },
      keyframes: {
        "road-dash": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "-200px 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "flame-flicker": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "badge-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "light-cycle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "road-dash": "road-dash 3s linear infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "flame-flicker": "flame-flicker 2s ease-in-out infinite",
        "badge-pop": "badge-pop 0.35s cubic-bezier(0.2,0.8,0.2,1) forwards",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
        "light-cycle": "light-cycle 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
