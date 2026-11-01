import type { Config } from '@react-router/dev/config';

// Fully static output for Azure Static Web Apps: no runtime SSR, but every
// route is prerendered to real HTML at build time so crawlers never depend
// on JavaScript.
export default {
  appDirectory: 'src',
  ssr: false,
  prerender: ['/', '/about', '/connect', '/404'],
} satisfies Config;
