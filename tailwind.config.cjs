/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js}',
    './index.js',
    './preload.js'
  ],
  theme: {
    extend: {
      colors: {
        brand: '#d81b60',
        brandHover: '#c2185b'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
