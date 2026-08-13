// Tailwind theme for the BSIS design system: custom colors and PT Sans fonts.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          main: '#002e76',
          dark: '#004cc2',
        },
        surface: {
          tint: '#e6f0ff',
          white: '#ffffff',
          grey: '#f3f3f3',
        },
        body: {
          dark: '#333333',
          light: '#ffffff',
        },
        border: {
          subtle: '#dddddd',
        },
      },
      fontFamily: {
        sans: ['"PT Sans"', 'sans-serif'],
        heading: ['"PT Sans"', 'sans-serif'],
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
};
