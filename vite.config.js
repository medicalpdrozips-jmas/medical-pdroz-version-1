import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-medical-pdroz.png'],
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
            src: '/logo-medical-pdroz.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/logo-medical-pdroz.png',
            sizes: '512x512',
            type: 'image/png',
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
