import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' -> las rutas de los assets son relativas, así el sitio funciona
// tanto en la raíz (pedromiras.github.io) como si algún día cambia de ubicación.
export default defineConfig({
  plugins: [react()],
  base: './',
});
