/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
  content: [
    "./src/**/*.{html,ts}",
    "./components/**/*.{html,ts}",
    "./libs/ui/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Bebas Neue"', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
