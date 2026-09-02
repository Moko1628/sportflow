import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sport: {
          dark: "#0A0F1D",
          card: "#131B2E",
          cardHover: "#1A2540",
          blue: "#0052FF",
          cyan: "#00E5FF",
          orange: "#FF5500",
          red: "#FF3B30",
          gray: "#94A3B8",
          light: "#F8FAFC",
        },
      },
      animation: {
        "pulse-fast": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-ball": "bounce 1s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
