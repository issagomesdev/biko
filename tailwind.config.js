/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f5ef52",
        secondary: "#000000",
        background: "#FFFFFF",
        background_contraste: "#F5F5F5",
        dark: {
          background: "#0A0A0A",
          background_contraste: "#1A1A1A",
          text: "#E5E5E5",
        }
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}