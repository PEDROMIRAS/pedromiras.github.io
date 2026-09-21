import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { enModoApp, esIOS, gastarEvento, obtenerEstado, suscribir } from './instalacion.js';

// Instrucciones para iPhone/iPad, donde el navegador no deja instalar con un botón.
function Ayuda({ onCerrar }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, []);
  return (
    <dialog ref={ref} className="ayuda" onClose={onCerrar} aria-labelledby="titulo-ayuda">
      <h2 id="titulo-ayuda">Añadir a la pantalla de inicio</h2>
      <ol>
        <li>Toca el botón Compartir de tu navegador.</li>
        <li>Elige «Añadir a pantalla de inicio».</li>
        <li>Toca «Añadir».</li>
      </ol>
      <button type="button" className="entendido" onClick={() => ref.current.close()}>
        Entendido
      </button>
    </dialog>
  );
}

// Botón "Instalar" (esquina superior derecha). Solo aparece si se puede instalar
// y la página no se está usando ya como app.
export default function Instalar() {
  const { evento, instalada } = useSyncExternalStore(suscribir, obtenerEstado);
  const [ayuda, setAyuda] = useState(false);
  const ios = esIOS();

  if (instalada || enModoApp() || (!evento && !ios)) return null;

  const pulsar = async () => {
    if (!evento) {
      setAyuda(true);
      return;
    }
    evento.prompt();
    try {
      await evento.userChoice;
    } catch {
      /* el usuario cerró el aviso */
    }
    gastarEvento();
  };

  return (
    <>
      <button type="button" className="instalar entra" onClick={pulsar}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Instalar
      </button>
      {ayuda && <Ayuda onCerrar={() => setAyuda(false)} />}
    </>
  );
}
