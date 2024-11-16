/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // bright blue
          foreground: '#1e40af', // darker blue
          accent: '#3b82f6', // lighter blue
        },
        secondary: {
          DEFAULT: '#10b981', // emerald
          foreground: '#059669', // darker emerald
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#1f2937',
        },
        accent: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          teal: '#14b8a6',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out',
        'fade-in-up': 'fade-in-up 1s ease-out',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.appearance-textfield': {
          'appearance': 'textfield',
          '-webkit-appearance': 'textfield'
        }
      })
    })
  ],
}

