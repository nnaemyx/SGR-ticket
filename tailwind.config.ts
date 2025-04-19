import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        gilmerbold: ["Gilmer Bold", 'sans-serif'],
        gilmerregular: ["Gilmer Regular", 'sans-serif'],
        gilmerlight: ["Gilmer Light", 'sans-serif'],
        gilmermedium: ["Gilmer Medium", 'sans-serif'],
        greconian: ["Greconian", 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config; 