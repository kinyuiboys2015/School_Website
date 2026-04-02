/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Kinyui Boys' School Colors
        maroon: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f27e7e',
          500: '#e54848',
          600: '#c41e1e',
          700: '#a31515',
          800: '#800020',  // Primary Maroon
          900: '#5c0010',
          950: '#3a0008',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'ping-slow': 'ping-slow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'beam': 'beam 3s ease-in-out infinite',
        'beam-vertical': 'beam-vertical 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'underline': 'underline 2s ease-in-out infinite',
        'progress-ring': 'progress-ring 2s linear infinite',
        'bounce-dot': 'bounce-dot 0.6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.1)', opacity: '0.1' },
          '100%': { transform: 'scale(1)', opacity: '0.3' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'beam': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'beam-vertical': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0' },
          '25%': { transform: 'translateY(-20px) translateX(10px)', opacity: '0.5' },
          '50%': { transform: 'translateY(-40px) translateX(-10px)', opacity: '0.3' },
          '75%': { transform: 'translateY(-20px) translateX(5px)', opacity: '0.2' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'underline': {
          '0%': { width: '0%', opacity: '0', left: '50%' },
          '50%': { width: '100%', opacity: '1', left: '0%' },
          '100%': { width: '0%', opacity: '0', left: '50%' },
        },
        'progress-ring': {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: '0' },
        },
        'bounce-dot': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};