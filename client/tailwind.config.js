/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '375px',
        '2xl': '1440px',
      },
      colors: {
        forest: {
          950: '#0E1F16',
          900: '#152E22',
          800: '#1C3E2D',
          700: '#25543D',
          600: '#2E694D',
          500: '#3D8C66',
          400: '#52B788',
          300: '#74C69D',
          200: '#B7E4C7',
          100: '#D8F3DC',
          50: '#F0F7F4',
        },
        cream: {
          900: '#6E5C3E',
          800: '#8C7752',
          700: '#AA9368',
          600: '#C7AF81',
          500: '#DEC99E',
          400: '#EBDCB9',
          300: '#F2E8D3',
          200: '#F8F3E8',
          100: '#FAF7F0',
          50: '#FCFAF6',
        },
        earth: {
          900: '#4A2810',
          800: '#6B3C18',
          700: '#8C4F20',
          600: '#B36829',
          500: '#C97A35',
          400: '#DA9655',
          300: '#E7B47E',
          200: '#F3D2AC',
          100: '#FAECD9',
          50: '#FDF7EE',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(21, 46, 34, 0.06)',
        elevated: '0 12px 36px -4px rgba(21, 46, 34, 0.10)',
        premium: '0 20px 48px -8px rgba(21, 46, 34, 0.14)',
        glow: '0 10px 30px -6px rgba(46, 105, 77, 0.45)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-12px,0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translate3d(0,16px,0)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
