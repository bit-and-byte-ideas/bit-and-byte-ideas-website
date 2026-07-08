/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import react from '@vitejs/plugin-react';

// The react-router plugin owns dev/build; Vitest gets the plain React plugin
// because the framework plugin cannot run inside the test environment.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'test' ? [react()] : [reactRouter()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    css: false,
    // Playwright specs in e2e/ run via `pnpm test:e2e`, not Vitest.
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
