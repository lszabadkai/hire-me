/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GoTo-inspired warm tone palette
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Source Sans 3', 'Segoe UI', 'sans-serif'],
        serif: ['Spectral', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'paper': '2px 4px 12px rgba(0,0,0,0.15)',
        'paper-hover': '4px 8px 24px rgba(0,0,0,0.20)',
      },
      keyframes: {
        'slide-in-right': {
          '0%':   { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'stamp-in': {
          '0%':   { opacity: '0', transform: 'scale(2) rotate(-12deg)' },
          '60%':  { opacity: '1', transform: 'scale(0.95) rotate(-12deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-12deg)' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1)',
        'stamp-in':       'stamp-in 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
}
