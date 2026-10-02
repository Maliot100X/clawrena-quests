import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07080b",
        foreground: "#eef0f3",
        card: { DEFAULT: "#0d0f13", raised: "#14171d" },
        muted: { DEFAULT: "#14171d", foreground: "#8b909a" },
        border: { DEFAULT: "rgba(255,255,255,0.07)", strong: "rgba(255,255,255,0.12)" },
        primary: { DEFAULT: "#22c7b8", foreground: "#021a18" },
        up: "#2bd58c",
        down: "#ff5c7a",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { "2xl": "1rem", "3xl": "1.5rem", "4xl": "2rem" },
      boxShadow: {
        glow: "0 0 60px -24px rgba(34,199,184,0.4)",
        "glow-sm": "0 0 30px -12px rgba(34,199,184,0.3)",
        "glow-lg": "0 0 100px -20px rgba(34,199,184,0.6)",
      },
      keyframes: {
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 20px -8px rgba(34,199,184,0.4)" },
          "50%": { boxShadow: "0 0 50px -8px rgba(34,199,184,0.8)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
