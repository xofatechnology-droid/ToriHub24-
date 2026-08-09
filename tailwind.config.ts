import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12130F',
        paper: '#F6F2E9',
        paperdim: '#EDE7D8',
        rule: '#D8D0BC',
        wire: '#B8401E',
        wiredark: '#8F2F14',
        moss: '#3E4C3A',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      maxWidth: {
        content: '1240px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
