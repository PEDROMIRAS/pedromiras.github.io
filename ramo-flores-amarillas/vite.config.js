import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// viteSingleFile mete el JS y el CSS dentro de index.html:
// el resultado es un único archivo que puedes subir a cualquier hosting.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
});
