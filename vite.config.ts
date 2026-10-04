import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { inkPlugin } from './tools/ink/vitePluginInk';

export default defineConfig({
  base: './',
  plugins: [inkPlugin(fileURLToPath(new URL('./story', import.meta.url)))],
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
