import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const MINI_APPS = ['todoApp', 'snake', 'sushi-tracker', 'ramo-flores-amarillas'];
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

// En `npm run dev` solo se compila el sitio principal: sin esto, /todoApp/ devolvía otra vez el portfolio
// y cada clic en una tarjeta añadía otra carpeta a la dirección. Sirve la última compilación de cada
// mini-app (su dist/) o, si no la hay, explica cómo tenerla.
const miniAppsEnDesarrollo = {
  name: 'mini-apps-en-desarrollo',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const ruta = decodeURIComponent(req.url.split('?')[0]);
      const app = MINI_APPS.find((nombre) => ruta === `/${nombre}` || ruta.startsWith(`/${nombre}/`));
      if (!app) return next();
      if (ruta === `/${app}`) {
        res.writeHead(301, { Location: `/${app}/` }).end();
        return;
      }
      const dist = join(process.cwd(), app, 'dist');
      // normalize + startsWith: una ruta con ../ no puede salir de dist/
      let archivo = normalize(join(dist, ruta.slice(app.length + 2)));
      if (!archivo.startsWith(dist)) return next();
      if (!existsSync(archivo) || statSync(archivo).isDirectory()) archivo = join(dist, 'index.html');
      if (!existsSync(archivo)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<p>«${app}» no está compilada. Ejecuta <code>npm run build:sitio</code> una vez y recarga.</p>`);
        return;
      }
      res.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] ?? 'application/octet-stream' });
      res.end(readFileSync(archivo));
    });
  },
};

// base: './' -> las rutas de los assets son relativas, así el sitio funciona
// tanto en la raíz (pedromiras.github.io) como si algún día cambia de ubicación.
export default defineConfig({
  plugins: [react(), miniAppsEnDesarrollo],
  base: './',
});
