import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  vite: { server: { strictPort: true } },
});
