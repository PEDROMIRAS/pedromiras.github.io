import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command }) => {
  // Configuración dinámica para que funcione tanto en local como en GitHub Pages
  const isProduction = command === 'build'
  const basePath = isProduction ? '/sushi-tracker/dist/' : '/'

  return {
    base: basePath, 
    plugins: [
      react(),
      tailwindcss(), // ¡El plugin de Tailwind v4 activado!
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          cleanupOutdatedCaches: true,
          // Límite de 5MB para que acepte tus niguiris en alta definición
          maximumFileSizeToCacheInBytes: 5000000
        },
        manifest: {
          name: 'Sushi Tracker',
          short_name: 'SushiTracker',
          description: 'Lleva el registro exacto de tus comilonas de sushi.',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          scope: basePath,
          start_url: basePath,
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
  }
})