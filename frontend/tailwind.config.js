/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0A0F',
        'bg-card': '#12121A',
        'bg-elevated': '#1A1A26',
        border: '#2A2A3A',
        accent: '#6C63FF',
        'accent-hover': '#5A52E0',
        'accent-secondary': '#00D4AA',
        'text-primary': '#F0F0FF',
        'text-secondary': '#8888AA',
        success: '#00D4AA',
        warning: '#FFB547',
        danger: '#FF5470',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
