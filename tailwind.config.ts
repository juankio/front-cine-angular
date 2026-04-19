import hlmPreset from '@spartan-ng/ui-core/hlm-tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [hlmPreset],
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
