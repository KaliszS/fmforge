import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    // Mirror SvelteKit's $lib alias so tests can import the same paths as the app.
    alias: {
      $lib: resolve(__dirname, 'src/lib'),
    },
    // Use the browser entry points of Svelte so stores/components behave as in the app.
    conditions: ['browser'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,js}'],
  },
});
