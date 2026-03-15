/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          bg: '#0a0a0a',
          surface: '#111111',
          card: '#1a1a1a',
        },
        // Light theme colors  
        light: {
          bg: '#faf7f0',
          surface: '#f5efe0',
          card: '#ffffff',
        },
        // Gold accent colors (work in both themes)
        gold: {
          50: '#fdf9f0',
          100: '#f9f0d9',
          200: '#f0e0b3',
          300: '#e6cc85',
          400: '#d4b056',
          500: '#b8941f', // primary gold
          600: '#a0821a',
          700: '#856915',
          800: '#6b5412',
          900: '#4a3a0c',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
