import { useEffect, useRef, useSyncExternalStore } from 'react';

// Interruptor de "pausar animaciones" (botón de la cabecera): para todo lo que se mueve solo y sin fin,
// la aurora, la cinta y los vídeos en bucle (WCAG 2.2.2). Se recuerda en este navegador; si no se puede
// guardar, dura hasta recargar.
const CLAVE = 'pausarAnimaciones';
const avisos = new Set();
let pausado = (() => {
  try {
    return localStorage.getItem(CLAVE) === '1';
  } catch {
    return false;
  }
})();

export function alternarPausa() {
  pausado = !pausado;
  try {
    localStorage.setItem(CLAVE, pausado ? '1' : '0');
  } catch {
    /* sin almacenamiento: la pausa vale para esta visita */
  }
  avisos.forEach((avisar) => avisar());
}

const suscribir = (avisar) => {
  avisos.add(avisar);
  return () => avisos.delete(avisar);
};

export const usePausa = () => useSyncExternalStore(suscribir, () => pausado);

// Para o reanuda un vídeo en bucle cuando se pulsa el botón. Al cargar no hace nada: ahí decide autoPlay,
// y así el navegador sigue parando por su cuenta los vídeos que quedan fuera de pantalla
export function useVideoPausado(video, parado) {
  const antes = useRef(parado);
  useEffect(() => {
    if (antes.current === parado) return;
    antes.current = parado;
    const v = video.current;
    if (!v) return;
    if (parado) v.pause();
    // Se vuelve a cargar con autoPlay en vez de play(): así el navegador sigue parando el que no se ve.
    // Sin vídeo cargado todavía (un clip lejos de la pantalla), ya arrancará solo al cargarse
    else if (v.currentSrc) v.load();
  }, [video, parado]);
}
