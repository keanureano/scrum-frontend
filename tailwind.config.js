/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    margin: {
      '1': '8px',
      '2': '12px',
      '3': '16px',
      '4': '24px',
      '5': '32px',
      '6': '48px',
      '100':'1700px'
    },
    extend: {
      colors: {
        primary: {
          50: "#FDF9F1",
          100: "#FBF1DF",
          200: "#F7E2BA",
          300: "#F3D296",
          400: "#EEC16C",
          500: "#E8AA33",
          600: "#D79518",
          700: "#BC8215",
          800: "#936511",
          900: "#5C3F0A",
          950: "#251904",
        },
        secondary: {
          50: "#EBF3FE",
          100: "#D8E6FD",
          200: "#B1CEFB",
          300: "#8AB5FA",
          400: "#639CF8",
          500: "#3B82F6",
          600: "#0B60EA",
          700: "#0848B0",
          800: "#053075",
          900: "#03183B",
          950: "#010C1D",
        },
      },
    },
  },
  plugins: [],
};
