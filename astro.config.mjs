// Astro config: wires the Tailwind v4 Vite plugin into the build.
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://pepszi.github.io',
  base: '/BSIS',
  vite: {
    plugins: [tailwindcss()]
  }
});
