/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
        'soft': '0 4px 20px -2px rgba(21, 46, 34, 0.06)',
        'elevated': '0 12px 36px -4px rgba(21, 46, 34, 0.1)',
        'premium': '0 20px 48px -8px rgba(21, 46, 34, 0.14)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        }
      }
    },
  },
  plugins: [],
}
