import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000000",
      white: "#FFFFFF",
      surface: {
        DEFAULT: "#000000",
        deep: "#050505",
        card: "rgba(255, 255, 255, 0.03)",
        elevated: "rgba(255, 255, 255, 0.06)",
      },
      metallic: {
        DEFAULT: "#C0FFFF",
        20: "rgba(192, 255, 255, 0.20)",
        10: "rgba(192, 255, 255, 0.10)",
      },
      accent: {
        DEFAULT: "#806EFF",
        glow: "rgba(128, 110, 255, 0.40)",
        20: "rgba(128, 110, 255, 0.20)",
      },
      chrome: {
        DEFAULT: "#D4D4D8",
        dark: "#A1A1AA",
        border: "#333333",
      },
      body: "#A1A1AA",
      muted: "#71717A",
      dim: "#52525B",
    },
    fontFamily: {
      heading: ['"Inter"', "system-ui", "sans-serif"],
      body: ['"Inter"', "system-ui", "sans-serif"],
      mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
    },
    extend: {
      fontSize: {
        "display-xl": [
          "clamp(3rem, 7vw, 5.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        display: [
          "clamp(2.25rem, 5vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" },
        ],
        headline: [
          "clamp(1.5rem, 3vw, 2.5rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "label-sm": [
          "0.6875rem",
          { lineHeight: "1", letterSpacing: "0.14em", fontWeight: "600" },
        ],
      },
      animation: {
        shimmer: "shimmer 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "terminal-blink": "terminal-blink 1s step-end infinite",
        "node-pulse": "node-pulse 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "node-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.6)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      backgroundImage: {
        metallic: "linear-gradient(135deg, #FFFFFF 0%, #C0FFFF 100%)",
      },
      boxShadow: {
        glass: "inset 0 1px 1px rgba(255,255,255,0.05)",
        "glow-accent": "0 0 30px rgba(128, 110, 255, 0.25)",
        "glow-accent-lg": "0 0 60px rgba(128, 110, 255, 0.35)",
        "glow-metallic": "0 0 40px rgba(192, 255, 255, 0.15)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
