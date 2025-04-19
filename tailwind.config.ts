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
        gilmer: ['var(--font-gilmer)'],
        greconian: ['var(--font-greconian)'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config; 