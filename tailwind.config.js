/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pollos': {
          yellow: '#F9D71C',
          orange: '#C14D00',
          dark: '#0F0F0F',
        },
        'status': {
          green: '#22C55E',
          yellow: '#F9D71C',
          red: '#EF4444',
        },
      },
    },
  },
  plugins: [],
}
