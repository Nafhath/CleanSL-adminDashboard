/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Bree Serif"', 'serif'],
      },
      colors: {
        theme: {
          main: 'var(--bg-main)',
          sidebar: 'var(--bg-sidebar)',
          card: 'var(--bg-card)',
          dark: 'var(--bg-card-dark)',
          text: 'var(--text-dark)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent)',
        }
      }
    },
  },
  plugins: [],
}
