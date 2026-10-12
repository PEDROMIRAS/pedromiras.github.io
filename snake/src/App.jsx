import { useEffect, useRef, useState } from 'react';
import { CELDAS, DIRECCIONES, avanzar, estadoInicial, girar } from './juego.js';

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

// Estado del juego: vive en un ref porque cambia en cada "tick" del intervalo,
// no en cada render de React.
export default function App() {
  const estado = useRef(null);
  estado.current ??= estadoInicial();
  const [, forzarRedibujo] = useState(0);
  const [fin, setFin] = useState(false);
  const [record, setRecord] = useState(() => Number(localStorage.getItem('snakeRecord')) || 0);

  useEffect(() => {
    localStorage.setItem('snakeRecord', record);
  }, [record]);

  // Bucle del juego: 10 fotogramas por segundo, parado mientras se muestra el Game Over
  useEffect(() => {
    if (fin) return;
    const intervalo = setInterval(() => {
      const e = estado.current;
      if (!avanzar(e)) {
        setRecord((r) => Math.max(r, e.snake.length - 1));
        setFin(true);
      }
      forzarRedibujo((n) => n + 1);
    }, 100);
    return () => clearInterval(intervalo);
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
        {snake.map((segmento, indice) => (
          <div
            key={indice}
            className={indice === 0 ? 'snake-head' : indice === ultimo ? 'snake-tail' : 'snake-body'}
            style={{
              left: celdas(segmento.x),
              top: celdas(segmento.y),
              transform:
                indice === 0
                  ? `rotate(${rotacion}deg)`
                  : indice === ultimo
                    ? `rotate(${giroCola(segmento, snake[ultimo - 1])}deg)`
                    : undefined,
            }}
          />
        ))}
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
