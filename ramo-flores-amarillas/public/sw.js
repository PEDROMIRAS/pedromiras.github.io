// Service worker: permite instalar la página como app y abrirla sin conexión.
// Si cambias algo y publicas de nuevo, sube el número de VERSION para renovar la caché.
const VERSION = 'v1';
const CACHE = `ramo-flores-${VERSION}`;
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(
          claves.filter((c) => c.startsWith('ramo-flores-') && c !== CACHE).map((c) => caches.delete(c))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;
  const url = new URL(peticion.url);

  // Página: primero la red (así se ve lo último que publiques) y, sin conexión, la copia guardada.
  if (peticion.mode === 'navigate') {
    evento.respondWith(
      fetch(peticion)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copia));
          return respuesta;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Iconos, manifiesto y fuentes de Google: primero la copia guardada, y se actualiza por detrás.
  const propio = url.origin === self.location.origin;
  const fuentes = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (propio || fuentes) {
    evento.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const guardada = await cache.match(peticion);
        const red = fetch(peticion)
          .then((respuesta) => {
            if (respuesta.ok || respuesta.type === 'opaque') cache.put(peticion, respuesta.clone());
            return respuesta;
          })
          .catch(() => guardada);
        return guardada || red;
      })
    );
  }
});
