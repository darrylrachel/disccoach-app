import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'DiscCoach',
        short_name: 'DiscCoach',
        description: 'The personal training platform for disc golfers.',
        theme_color: '#0A0A0A',
        background_color: '#0A0A0A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        // Placeholder brand mark (green ring / gold disc). Swap for real
        // production app icons (incl. maskable PNGs) in Phase 5 polish.
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        // Cache-first for static assets and the disc catalog reference data;
        // navigation/API calls stay network-first via default runtime behavior.
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
      },
    }),
  ],
})
