import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pureWhite: "#ffffff",
        offWhite: "#fffafa",
        creamWhite: "#fefafa",
        lightGray: "#d9d9d9",
        deepBlack: "#000000",
        nearBlack: "#040404",
        charcoal: "#413c3c",
        darkGray: "#4b4c4b",
        earthBrown: "#564215",
        rustOrange: "#d33a10"
      },
      fontFamily: {
        baskerville: ['var(--font-baskerville)'],
        maven: ['var(--font-maven)'],
        marvel: ['var(--font-marvel)'],
        kavoon: ['var(--font-kavoon)'],
      }
    },
  },
  plugins: [],
} satisfies Config;
