/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#171717',
          primary: '#0f766e',
          accent: '#d97706',
          light: '#f6f7f3',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2563eb33 0deg, #3b82f633 180deg, #2563eb33 360deg)',
      }
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
