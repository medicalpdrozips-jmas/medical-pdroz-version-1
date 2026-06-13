import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['crh-mark.svg'],
      manifest: {
        name: 'CRH Health Intelligence',
        short_name: 'CRH Health',
        description: 'Plataforma inteligente para IPS con lectura clinica, financiera y operativa.',
        theme_color: '#0D6EFD',
        background_color: '#F2F4F7',
        display: 'standalone',
        start_url: '/dashboard',
        scope: '/',
        icons: [
          {
            src: '/crh-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/crh-mark.svg',
            sizes: 'any',
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
