// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vcelyy.github.io',
  base: '/ai-website-builders',
  integrations: [sitemap()],
  server: {
    port: 8002,
    host: true
  },
  vite: {
    plugins: [tailwindcss()]
  }
});