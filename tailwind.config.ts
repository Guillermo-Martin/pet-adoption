import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        grandstander: ["var(--font-grandstander)"]
      },
      screens: {
        xs: "420px",
        sm: "576px",
        md: "767px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1400px"
      }
    },
    
  },
  plugins: [],
} satisfies Config;
