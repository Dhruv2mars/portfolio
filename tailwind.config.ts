import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f10",
        foreground: "#e5e7eb",
        muted: "#9ca3af",
        link: "#60a5fa"
      }
    }
  },
  plugins: [],
} satisfies Config;

