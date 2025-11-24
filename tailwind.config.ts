import type { Config } from "tailwindcss";
import { COLOR_MAP } from "./constants/chatData";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  safelist: Object.keys(COLOR_MAP).map((color) => `bg-${color}-400`),
};
export default config;
