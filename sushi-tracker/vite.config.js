import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // ¡EL TRUCO DEFINITIVO! 'base' relativo. 
  // Así los archivos siempre se encontrarán estén donde estén.
  base: './', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Esto fuerza al Service Worker a limpiar cachés viejas
        cleanupOutdatedCaches: true, 
      },
      manifest: {
        name: 'Sushi Tracker',
        short_name: 'SushiTracker',
        description: 'Lleva el registro exacto de tus comilonas de sushi.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        // Mantenemos el scope explícito para GitHub Pages
        scope: '/sushi-tracker/dist/',
        start_url: '/sushi-tracker/dist/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})