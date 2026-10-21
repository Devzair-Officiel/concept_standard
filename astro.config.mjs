import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://concept-standard.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  // Keep scripts and styles external so the CSP needs no unsafe-inline allowance.
  build: { inlineStylesheets: 'never' },
  vite: { server: { strictPort: true }, build: { assetsInlineLimit: 0 } },
});
