/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',   // Slate-900: 沉稳的主色调
          primary: '#2563eb', // Blue-600: 交互色
          accent: '#3b82f6',    // Blue-500: 视觉焦点/高亮 (Previously Amber)
          light: '#f8fafc',   // Slate-50: 背景底色
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
