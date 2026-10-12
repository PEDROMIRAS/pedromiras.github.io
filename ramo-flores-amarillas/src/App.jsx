import { useEffect, useRef, useState } from 'react';
import { generarRamo } from './generarRamo.js';
import { PALETAS } from './paletas.js';
import Ramo from './Ramo.jsx';
import Brote from './Brote.jsx';
import Colores from './Colores.jsx';
import Volver from './Volver.jsx';
import Instalar from './Instalar.jsx';
import { enModoApp } from './instalacion.js';

const SALIDA_MS = 450;
const TEMA_INICIAL = PALETAS.amarillas.tema;

// Permite compartir el enlace con un color ya elegido: ?color=rojas
// (salta la pantalla de elegir color; sigue pudiéndose volver a ella).
function colorInicial() {
  const c = new URLSearchParams(window.location.search).get('color');
  return c && Object.hasOwn(PALETAS, c) ? c : null;
}

export default function App() {
  const [color, setColor] = useState(colorInicial);
  const [ramo, setRamo] = useState(null);
  const [saliendo, setSaliendo] = useState(false);
  const temporizador = useRef(null);
  const colorActual = useRef(color);
  colorActual.current = color;
  const ultimoColor = useRef(null);
  const teclado = useRef(false);

  // Tres pantallas: elegir color -> mensaje del color -> ramo
  const pantalla = ramo ? 'ramo' : color ? 'mensaje' : 'color';
  const paleta = color ? PALETAS[color] : null;

  useEffect(() => () => clearTimeout(temporizador.current), []);

  // Recordamos si la última interacción fue con teclado o con toque/ratón:
  // el foco automático solo se usa con teclado (con toque dejaría un aro de foco visible).
  useEffect(() => {
    const conTeclado = () => (teclado.current = true);
    const conPuntero = () => (teclado.current = false);
    window.addEventListener('keydown', conTeclado, true);
    window.addEventListener('pointerdown', conPuntero, true);
    return () => {
      window.removeEventListener('keydown', conTeclado, true);
      window.removeEventListener('pointerdown', conPuntero, true);
    };
  }, []);

  // El fondo, el halo y el texto siguen al color elegido
  useEffect(() => {
    const { fondo, halo, texto } = color ? PALETAS[color].tema : TEMA_INICIAL;
    const estilo = document.documentElement.style;
    estilo.setProperty('--fondo', fondo);
    estilo.setProperty('--halo', halo);
    estilo.setProperty('--texto', texto);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', fondo);
  }, [color]);

  // Al cambiar de pantalla, el elemento que tenía el foco desaparece:
  // con teclado, se lo damos a la acción principal de la pantalla nueva.
  const anterior = useRef(pantalla);
  useEffect(() => {
    if (anterior.current === pantalla) return;
    anterior.current = pantalla;
    if (teclado.current) document.querySelector('[data-foco]')?.focus({ preventScroll: true });
  }, [pantalla]);

  const recibir = () => setRamo(generarRamo(undefined, colorActual.current));

  const empezar = () => {
    if (saliendo) return;
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sinMovimiento) return recibir();
    setSaliendo(true);
    temporizador.current = setTimeout(() => {
      setSaliendo(false);
      recibir();
    }, SALIDA_MS);
  };

  // Volver lleva siempre a la pantalla de elegir color, desde el mensaje o desde el ramo
  const volver = () => {
    clearTimeout(temporizador.current);
    ultimoColor.current = colorActual.current;
    setSaliendo(false);
    setRamo(null);
    setColor(null);
  };

  return (
    <main className="pantalla">
      {pantalla !== 'color' && <Volver onClick={volver} foco={pantalla === 'ramo'} />}

      {pantalla === 'color' && (
        <>
          {/* Instalada como app no hay portfolio al que volver: el enlace saldría de la app */}
          {!enModoApp() && (
            <a href="../#projects" className="volver">
              ← Portfolio
            </a>
          )}
          <Instalar />
          <Colores onElegir={setColor} foco={ultimoColor.current} />
        </>
      )}

      {pantalla === 'mensaje' && (
        <button
          type="button"
          data-foco=""
          className={`bienvenida entra${saliendo ? ' sale' : ''}`}
          onClick={empezar}
        >
          <span className="mensaje">Toca para recibir tu ramo de flores {paleta.nombre}</span>
          <Brote color={paleta.muestra} />
        </button>
      )}

      {pantalla === 'ramo' && (
        <section className="escenario">
          {/* key = id del ramo: cada ramo nuevo vuelve a ejecutar la animación de florecer */}
          <Ramo key={ramo.id} ramo={ramo} />
        </section>
      )}
    </main>
  );
}
