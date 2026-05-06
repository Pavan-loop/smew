import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        gold: '#b8860b',
        'gold-light': '#e8d89a',
        'gold-bg': '#faf6ed',
        dark: '#0f0f0f',
        border: '#e4e0da',
        bg: '#f8f7f4',
      },
    },
  },
  plugins: [],
};

export default config;
