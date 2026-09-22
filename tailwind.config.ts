import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kiniela: {
          navy: {
            DEFAULT: "#00063E",
            deep: "#000428",
            card: "#060e4f",
            cardLight: "#0c186b",
            border: "#1a2785",
          },
          vinotinto: {
            DEFAULT: "#882445",
            hover: "#9f2c52",
            dark: "#681934",
            glow: "rgba(136, 36, 69, 0.4)",
          },
          gold: {
            DEFAULT: "#FFAF3F",
            hover: "#ffbf5c",
            light: "#ffd58a",
            glow: "rgba(255, 175, 63, 0.35)",
          },
        },
      },
      fontFamily: {
        rockwell: ["'Rockwell'", "'Rockwell Nova'", "'Clarendon'", "Georgia", "serif"],
        poppins: ["var(--font-poppins)", "'Poppins'", "sans-serif"],
      },
      boxShadow: {
        'brand-gold': '0 0 25px -5px rgba(255, 175, 63, 0.4)',
        'brand-vinotinto': '0 0 25px -5px rgba(136, 36, 69, 0.5)',
        'brand-glow': '0 10px 30px -10px rgba(255, 175, 63, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'marquee': 'marquee 35s linear infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
