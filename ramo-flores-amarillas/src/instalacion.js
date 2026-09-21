// Estado de la instalación como app.
// Chrome, Edge y Samsung Internet avisan con "beforeinstallprompt" cuando se puede instalar;
// Safari (iPhone/iPad) no tiene ese aviso: allí solo se pueden dar instrucciones.

export const enModoApp = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

export const esIOS = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

let estado = { evento: null, instalada: enModoApp() };
const oyentes = new Set();

function cambiar(parcial) {
  estado = { ...estado, ...parcial };
  oyentes.forEach((f) => f());
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // guardamos el aviso para lanzarlo desde nuestro botón
  cambiar({ evento: e });
});
window.addEventListener('appinstalled', () => cambiar({ evento: null, instalada: true }));

export const suscribir = (f) => {
  oyentes.add(f);
  return () => oyentes.delete(f);
};
export const obtenerEstado = () => estado;
export const gastarEvento = () => cambiar({ evento: null }); // el aviso solo se puede usar una vez
