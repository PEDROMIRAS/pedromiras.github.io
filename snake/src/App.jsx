import { useEffect, useRef, useState } from 'react';
import { CELDAS, DIRECCIONES, avanzar, entre, estadoInicial, girar } from './juego.js';

const TICK = 100; // ms por casilla: la velocidad del juego (10 casillas por segundo)

const celdas = (n) => `calc(var(--celda) * ${n})`;

// Giro de la cola para que su lado ancho mire al segmento anterior (0 = el anterior está arriba).
// El módulo cubre el caso en que la serpiente está cruzando un borde.
function giroCola(cola, anterior) {
  const mx = (anterior.x - cola.x + CELDAS) % CELDAS;
  const my = (anterior.y - cola.y + CELDAS) % CELDAS;
  if (mx === 1) return 90;
  if (mx === CELDAS - 1) return 270;
  return my === 1 ? 180 : 0;
}

// Estado del juego: vive en un ref porque cambia en cada "tick" del bucle,
// no en cada render de React.
export default function App() {
  const estado = useRef(null);
  estado.current ??= estadoInicial();
  // La serpiente en el tick anterior y cuánto falta para el siguiente (0 a 1): con eso se dibuja deslizándose
  const anterior = useRef(estado.current.snake);
  const progreso = useRef(0);
  const [, forzarRedibujo] = useState(0);
  const [fin, setFin] = useState(false);
  const [record, setRecord] = useState(() => Number(localStorage.getItem('snakeRecord')) || 0);

  useEffect(() => {
    localStorage.setItem('snakeRecord', record);
  }, [record]);

  // Bucle del juego: la lógica avanza una casilla cada TICK, y se dibuja en cada fotograma de la pantalla
  // (60 fps o lo que dé) con la serpiente a medio camino entre casillas. Parado durante el Game Over.
  useEffect(() => {
    if (fin) return;
    let acumulado = 0;
    let ultimo = performance.now();
    let fotograma;
    const bucle = (ahora) => {
      acumulado += Math.min(ahora - ultimo, 250); // tras volver de otra pestaña, no recupera todos los ticks perdidos
      ultimo = ahora;
      const e = estado.current;
      while (acumulado >= TICK) {
        acumulado -= TICK;
        anterior.current = e.snake;
        if (!avanzar(e)) {
          setRecord((r) => Math.max(r, e.snake.length - 1));
          setFin(true);
          progreso.current = 1;
          forzarRedibujo((n) => n + 1);
          return;
        }
      }
      progreso.current = acumulado / TICK;
      forzarRedibujo((n) => n + 1);
      fotograma = requestAnimationFrame(bucle);
    };
    fotograma = requestAnimationFrame(bucle);
    return () => cancelAnimationFrame(fotograma);
  }, [fin]);

  // Controles: flechas del teclado o deslizar el dedo por la pantalla
  useEffect(() => {
    let inicio = null;
    const alPulsarTecla = (ev) => {
      const d = DIRECCIONES[ev.key];
      if (!d) return;
      ev.preventDefault(); // que las flechas no muevan la página
      girar(estado.current, d);
    };
    const alTocar = (ev) => (inicio = { x: ev.clientX, y: ev.clientY });
    const alSoltar = (ev) => {
      if (!inicio) return;
      const mx = ev.clientX - inicio.x;
      const my = ev.clientY - inicio.y;
      inicio = null;
      if (Math.max(Math.abs(mx), Math.abs(my)) < 20) return; // un toque, no un deslizamiento
      const tecla = Math.abs(mx) > Math.abs(my) ? (mx > 0 ? 'ArrowRight' : 'ArrowLeft') : my > 0 ? 'ArrowDown' : 'ArrowUp';
      girar(estado.current, DIRECCIONES[tecla]);
    };
    window.addEventListener('keydown', alPulsarTecla);
    window.addEventListener('pointerdown', alTocar);
    window.addEventListener('pointerup', alSoltar);
    return () => {
      window.removeEventListener('keydown', alPulsarTecla);
      window.removeEventListener('pointerdown', alTocar);
      window.removeEventListener('pointerup', alSoltar);
    };
  }, []);

  const reiniciar = () => {
    estado.current = estadoInicial();
    anterior.current = estado.current.snake;
    progreso.current = 0;
    setFin(false);
  };

  const { snake, food, rotacion, dx, dy, siguiente } = estado.current;
  const puntos = snake.length - 1;
  const ultimo = snake.length - 1;
  const parado = dx === 0 && dy === 0 && !siguiente;

  return (
    <div className="juego">
      <a href="../#projects" className="volver-portfolio">
        ← Portfolio
      </a>
      <p className="marcador">
        Score: {puntos} · Best: {Math.max(record, puntos)}
      </p>
      <div id="game-container">
        {snake.map((segmento, indice) => {
          const { x, y } = entre(anterior.current[indice], segmento, progreso.current);
          return (
            <div
              key={indice}
              className={indice === 0 ? 'snake-head' : indice === ultimo ? 'snake-tail' : 'snake-body'}
              style={{
                // translate en vez de left/top: moverlo cada fotograma no obliga a recalcular la maqueta
                translate: `${celdas(x)} ${celdas(y)}`,
                transform:
                  indice === 0
                    ? `rotate(${rotacion}deg)`
                    : indice === ultimo
                      ? `rotate(${giroCola(segmento, snake[ultimo - 1])}deg)`
                      : undefined,
              }}
            />
          );
        })}
        <div className="fruit" style={{ left: celdas(food.x), top: celdas(food.y) }} />
        {parado && !fin && <p className="ayuda">Use the arrow keys or swipe to move</p>}
        {fin && (
          <div className="fin">
            <h2>Game Over</h2>
            <p>Score: {puntos}</p>
            <button type="button" autoFocus onClick={reiniciar}>
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
