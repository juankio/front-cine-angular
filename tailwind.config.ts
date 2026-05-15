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
        sans: ['"Lora"', 'serif'],
        body: ['"Lora"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        velvet: {
          500: '#A31515',
          700: '#7A0000',
          900: '#4A0000',
        }
      }
    },
  },
  plugins: [],
}
