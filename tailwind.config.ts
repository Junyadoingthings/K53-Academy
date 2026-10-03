import type { Config } from "tailwindcss";

/**
 * K53 Academy — "Traffic Light / Road Sign" theme.
 *
 * Light, road-sign-inspired palette: warm-white surfaces, traffic RED as the
 * primary accent, warning YELLOW as the secondary, GREEN kept for "go"/success
 * (traffic light), and dark ASPHALT for text, borders and roadway bands.
 *
 * NOTE ON TOKEN NAMES: to avoid churn across ~30 files, the original token
 * names are kept but remapped to the new palette:
 *   cyan   → traffic RED   (primary accent)
 *   amber  → warning YELLOW/GOLD (secondary accent)
 *   grass  → traffic GREEN (success / "go")
 *   signal → RED (errors / stop)
 *   navy   → light PAPER surfaces (page = cream, cards = white)
 *   ink    → dark text
 * `asphalt` is new: dark roadway for bands, borders and shadows.
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
        // Dark roadway. DEFAULT is the theme-flipping hairline (dark line on
        // light, light line on dark); the numbered shades stay fixed-dark for
        // the traffic-light housing, splash and modal backdrops.
        asphalt: {
          DEFAULT: "rgb(var(--hairline) / <alpha-value>)",
          950: "#101114",
          900: "#17181C",
          850: "#1E2026",
          800: "#272932",
          700: "#343742",
          600: "#474B58",
        },
        // Paper surfaces — flip between light (cream/white) and dark via vars.
        navy: {
          950: "rgb(var(--nv-950) / <alpha-value>)",
          900: "rgb(var(--nv-900) / <alpha-value>)",
          850: "rgb(var(--nv-850) / <alpha-value>)",
          800: "rgb(var(--nv-800) / <alpha-value>)",
          700: "rgb(var(--nv-700) / <alpha-value>)",
          600: "rgb(var(--nv-600) / <alpha-value>)",
        },
        // Traffic RED — primary accent (legacy name: cyan)
        cyan: {
          DEFAULT: "#E4002B",
          soft: "#FF3D53",
          deep: "#B10021",
        },
        // Warning YELLOW / gold — secondary accent
        amber: {
          DEFAULT: "#E68A00",
          soft: "#FFC12E",
        },
        // Traffic GREEN — success / "go"
        grass: {
          DEFAULT: "#0B9C56",
          soft: "#25C777",
        },
        // RED — errors / stop
        signal: {
          DEFAULT: "#E4002B",
          soft: "#FF4D5E",
        },
        // Text — flips with theme.
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(228,0,43,0.18), 0 14px 30px -14px rgba(228,0,43,0.35)",
        "neon-amber": "0 0 0 1px rgba(230,138,0,0.22), 0 14px 30px -14px rgba(230,138,0,0.4)",
        "neon-green": "0 0 0 1px rgba(11,156,86,0.2), 0 14px 30px -14px rgba(11,156,86,0.35)",
        "neon-red": "0 0 0 1px rgba(228,0,43,0.22), 0 14px 30px -14px rgba(228,0,43,0.4)",
        card: "0 1px 2px rgba(27,28,33,0.05), 0 14px 34px -18px rgba(27,28,33,0.22)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(27,28,33,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,28,33,0.05) 1px, transparent 1px)",
        "radial-cyan":
          "radial-gradient(600px circle at 50% -10%, rgba(228,0,43,0.10), transparent 60%)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      keyframes: {
        "road-dash": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "-200px 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "flame-flicker": {
          "0%, 100%": { transform: "scale(1) rotate(-1deg)", opacity: "1" },
          "50%": { transform: "scale(1.06) rotate(1deg)", opacity: "0.9" },
        },
        "badge-pop": {
          "0%": { transform: "scale(0.4) rotate(-12deg)", opacity: "0" },
          "60%": { transform: "scale(1.12) rotate(4deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0)", opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "light-cycle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "road-dash": "road-dash 3s linear infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "flame-flicker": "flame-flicker 1.6s ease-in-out infinite",
        "badge-pop": "badge-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
        shimmer: "shimmer 2s infinite",
        float: "float 5s ease-in-out infinite",
        "light-cycle": "light-cycle 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
