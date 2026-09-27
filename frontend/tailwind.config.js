/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mango: {
          50: '#FFF7E8',
          100: '#FFECC2',
          400: '#F7B733',
          500: '#F4A125',
          600: '#DB8A12',
        },
        papaya: {
          500: '#F2542D',
          600: '#D6431F',
        },
        lime: {
          400: '#A4CE4E',
          500: '#8BC53F',
          600: '#6FA22E',
        },
        teal: {
          800: '#123A3A',
          900: '#0D2B2B',
        },
        cream: '#FFF9EE',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px -8px rgba(13, 43, 43, 0.25)',
      },
    },
  },
  plugins: [],
};
