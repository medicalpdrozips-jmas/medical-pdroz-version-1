import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-medical.svg', 'icons/icon-medical-mask.svg', 'brand/medical-pdroz-logo.svg'],
      manifest: {
        name: 'MEDICAL PDROZ IPS',
        short_name: 'MEDICAL PDROZ',
        description: 'Plataforma clinica y administrativa modular para la gestion integral de IPS.',
        theme_color: '#0D6EFD',
        background_color: '#F2F4F7',
        display: 'standalone',
        start_url: '/dashboard',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-medical.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icons/icon-medical-mask.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
