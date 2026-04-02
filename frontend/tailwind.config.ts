import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:        "#FAF9F6", // Cream
        cream:     "#FAF9F6",
        surface:   "#FFFFFF",
        border:    "#E2E2DC",
        navy:      "#0B192C",
        slate:     "#64748B",
        red:       "#E02D3C",
        emerald:   "#059669",
        amber:     "#D97706",
        muted:     "#64748B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        'card': '0 4px 14px rgba(11,25,44,0.15)',
        'btn-hover': '0 6px 20px rgba(11,25,44,0.2)',
        'ecg': '0 20px 60px rgba(11,25,44,0.2)',
        'feature-hover': '0 12px 40px rgba(11,25,44,0.08)'
      }
    },
  },
  plugins: [],
};

export default config;
