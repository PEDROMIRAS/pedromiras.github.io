import { useEffect, useRef, useState } from 'react';

// Las apps de los móviles, en el orden del carrusel. Las capturas se sacan de las apps publicadas.
const APPS = [
  { imagen: './assets/img/movil-sushi.webp', url: './sushi-tracker/' },
  { imagen: './assets/img/movil-todo.webp', url: './todoApp/' },
  { imagen: './assets/img/movil-snake.webp', url: './snake/' },
];

// Sin 3D: quien pide menos movimiento, quien ahorra datos o un navegador sin WebGL2.
// Se decide antes de pintar: así el hueco del lienzo nunca aparece de golpe y no mueve la página.
const conTresD = () =>
  'WebGL2RenderingContext' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !navigator.connection?.saveData;

// Móviles en 3D con las apps, junto al texto de la portada. Es decoración: las mismas apps están en
// Projects como enlaces normales, así que el lienzo se oculta a los lectores de pantalla.
export default function Hero3D() {
  const lienzo = useRef(null);
  const [activo, setActivo] = useState(conTresD);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!activo) return;
    const movimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
    const alCambiar = () => movimiento.matches && setActivo(false);
    movimiento.addEventListener('change', alCambiar);

    let parar;
    let cancelado = false;
    // three.js se pide cuando la página ya está cargada y el navegador queda libre
    const empezar = () =>
      import('../three/moviles.js')
        .then(({ iniciar }) => {
          if (!cancelado) parar = iniciar(lienzo.current, APPS, () => setListo(true));
        })
        .catch(() => setActivo(false));
    const conEspera = 'requestIdleCallback' in window;
    const espera = conEspera ? requestIdleCallback(empezar, { timeout: 2000 }) : setTimeout(empezar, 300);

    return () => {
      cancelado = true;
      if (conEspera) cancelIdleCallback(espera);
      else clearTimeout(espera);
      parar?.();
      movimiento.removeEventListener('change', alCambiar);
    };
  }, [activo]);

  if (!activo) return null;
  return <canvas ref={lienzo} className={listo ? 'home-3d listo' : 'home-3d'} aria-hidden="true" />;
}
