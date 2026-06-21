import type { Config } from "tailwindcss";

/**
 * Tailwind is used for layout utilities only. The visual identity comes from the
 * design-system CSS variables (see src/app/globals.css). Brand colors are mapped
 * here so utilities like `text-azblue` / `bg-azblue` resolve to the tokens.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azblue: {
          DEFAULT: "#006AFF",
          hover: "#0055CC",
          active: "#004BB5",
          50: "#F0F6FF",
          100: "#E8F0FE",
        },
        azink: "#2A2A33",
        azgray: { 700: "#54545C", 600: "#74747C", 400: "#A7A6AD" },
        azborder: { DEFAULT: "#D1D1D6", hairline: "#E8E8EB", strong: "#B8B8C0" },
        azsuccess: "#008060",
        azwarning: "#FFB100",
        azerror: "#D6005C",
        azviolet: "#9059FF",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      maxWidth: { content: "1280px" },
      boxShadow: {
        "az-xs": "0 1px 2px rgba(0,0,0,0.06)",
        "az-sm": "0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
        "az-md": "0 4px 12px rgba(0,0,0,0.12)",
        "az-lg": "0 8px 24px rgba(0,0,0,0.16)",
      },
    },
  },
  corePlugins: {
    // The design system supplies its own reset (base.css). Disable Tailwind's
    // Preflight so it doesn't fight the DS resets / element defaults.
    preflight: false,
  },
  plugins: [],
};

export default config;
