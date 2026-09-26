import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      colors: {
        amethyst_smoke: {
          DEFAULT: "#9c89b8",
          100: "#1f1828",
          200: "#3d3050",
          300: "#5c4878",
          400: "#7a61a0",
          500: "#9c89b8",
          600: "#b0a1c6",
          700: "#c4b8d5",
          800: "#d7d0e3",
          900: "#ebe7f1",
        },
        blush_pop: {
          DEFAULT: "#f0a6ca",
          100: "#460c28",
          200: "#8c1850",
          300: "#d12378",
          400: "#e462a1",
          500: "#f0a6ca",
          600: "#f3b9d5",
          700: "#f6cbe0",
          800: "#f9dcea",
          900: "#fceef5",
        },
        pink_orchid: {
          DEFAULT: "#efc3e6",
          100: "#44123a",
          200: "#892475",
          300: "#cb3aae",
          400: "#dd7eca",
          500: "#efc3e6",
          600: "#f2cfeb",
          700: "#f5dbf0",
          800: "#f9e7f5",
          900: "#fcf3fa",
        },
        lavender_blush: {
          DEFAULT: "#f0e6ef",
          100: "#3b2338",
          200: "#754671",
          300: "#a970a4",
          400: "#cdabc9",
          500: "#f0e6ef",
          600: "#f3ebf2",
          700: "#f6f0f5",
          800: "#f9f5f8",
          900: "#fcfafc",
        },
        periwinkle: {
          DEFAULT: "#b8bedd",
          100: "#1a1f36",
          200: "#343e6d",
          300: "#4f5da3",
          400: "#808bc2",
          500: "#b8bedd",
          600: "#c5cae3",
          700: "#d4d7ea",
          800: "#e2e5f1",
          900: "#f1f2f8",
        },
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          accent: "#10b981",
          violet: "#8b5cf6",
        },
        surface: {
          darker: "#191321",
          dark: "#231b2e",
          card: "#241a31",
          border: "#3d3050",
        },
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        scanline: "scanline 6s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(156, 137, 184, 0.3)" },
          "100%": {
            boxShadow:
              "0 0 25px rgba(156, 137, 184, 0.8), 0 0 45px rgba(240, 166, 202, 0.4)",
          },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
