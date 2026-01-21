// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aiwebsitebuilders.com',
  server: {
    port: 8002,
    host: true
  },
  vite: {
    plugins: [tailwindcss()]
  }
});