import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'RelifMesh',
        short_name: 'RelifMesh',
        description: 'Disaster Relief Coordination System',
        theme_color: '#1e40af',
        background_color: '#f9fafb',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  server: { host: true, port: 5173 },
})
