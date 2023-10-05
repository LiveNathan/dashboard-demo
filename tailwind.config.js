/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'base': ['Roboto', 'sans-serif'],
        'header': ['Orbitron', 'sans-serif'],
      }
    }
  },
  plugins: [],
}

