/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a1a',
        'dark-card': '#2d2d2d',
        'dark-border': '#404040',
        'dark-text': '#e0e0e0',
        'dark-text-secondary': '#a0a0a0',
        'accent': '#10b981',
        'accent-dark': '#059669',
        'warning': '#f59e0b',
        'danger': '#ef4444',
      }
    },
  },
  plugins: [],
}

