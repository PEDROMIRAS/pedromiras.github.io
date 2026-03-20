import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Ponemos la ruta exacta donde GitHub Pages lee tu index.html
  base: '/sushi-tracker/dist/', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sushi Tracker',
        short_name: 'SushiTracker',
        description: 'Lleva el registro exacto de tus comilonas de sushi.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        // El scope y la url de inicio deben coincidir con la base
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