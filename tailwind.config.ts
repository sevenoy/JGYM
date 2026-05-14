import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F4FBF8",
        surface: "#FFFFFF",
        "surface-soft": "#EEF5F2",
        "surface-muted": "#E8EFEC",
        "surface-high": "#DDE4E1",
        primary: "#007A6C",
        "primary-soft": "#C8F7EF",
        secondary: "#0EA5E9",
        "secondary-soft": "#DFF3FF",
        accent: "#F59E0B",
        "accent-soft": "#FFF1D6",
        ink: "#111B18",
        muted: "#60716D",
        outline: "#BACAC5",
      },
      boxShadow: {
        soft: "0 18px 45px -28px rgba(0, 107, 95, 0.35)",
        glow: "0 18px 45px -30px rgba(14, 165, 233, 0.45)",
        tab: "0 -12px 34px -24px rgba(0, 107, 95, 0.45)",
      },
      borderRadius: {
        card: "1.5rem",
        "card-lg": "2rem",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
