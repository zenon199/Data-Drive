/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        purple: {
          200: "#d9ddee",
          500: "#9492db",
          600: "#7164c0"
        },
        slate: {
          100: "#eeeeef",
          200: "#e6e9ed",
          600:"#95989c",
        }
      }
    },
  },
  plugins: [],
}

