import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  darkMode: "class",

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        poppy: "#f34213",
        "b-grey": {
          0: "#FBFBFB",
          1: "#F4F2F7",
          2: "#E0DAEA",
          3: "#B3AEBC",
          5: "#78757F",
          6: "#CEBEE7",
        },
        "b-purple": {
          1: "#3D2E5B",
          3: "#9580BF",
          4: "#3A2B59",
          5: "#382A52",
          6: "#2F2346",
        },
        "b-black": {
          1: "#000009",
          2: "#1A1A1A",
        },
        "b-red": {
          1: "#F34213",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        xxs: "10px",
      },
      height: {
        22: "88px",
      },
      letterSpacing: {
        spaced: ".02em",
        expanded: ".04em",
      },
      screens: {
        xs: "430px",
        sm: "640px",
        md: "1024px",
        lg: "1366px",
        xl: "1440px",
        "2xl": "1920px",
      },
      width: {
        22: "88px",
      },
    },
  },
  plugins: [],
};
export default config;
