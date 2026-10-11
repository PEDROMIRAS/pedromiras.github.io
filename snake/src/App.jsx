import { useEffect, useRef, useState } from 'react';

const TAMANO_CELDA = 20;
const TAMANO_TABLERO = 600; // debe coincidir con el ancho/alto de #game-container (styles.css)

// Estado del juego (misma lógica que snake/js/snake.js): vive en un ref porque
// cambia en cada "tick" del intervalo, no en cada render de React.
export default function App() {
  const estado = useRef({
    snake: [{ x: 200, y: 200 }],
    food: { x: 0, y: 0 },
    dx: 0,
    dy: 0,
    rotacion: 0, // 0 = la imagen mira hacia abajo, igual que el original
  });
  const [, forzarRedibujo] = useState(0);

  const generarFruta = () => {
    estado.current.food = {
      x: Math.floor(Math.random() * (TAMANO_TABLERO / TAMANO_CELDA)) * TAMANO_CELDA,
      y: Math.floor(Math.random() * (TAMANO_TABLERO / TAMANO_CELDA)) * TAMANO_CELDA,
    };
  };

  // Bucle del juego: 10 fotogramas por segundo, igual que el setInterval original
  useEffect(() => {
    generarFruta();
    forzarRedibujo((n) => n + 1);

    const intervalo = setInterval(() => {
      const e = estado.current;
      const cabezaActual = e.snake[0];

      const chocaConsigoMisma = e.snake.slice(1).some((p) => p.x === cabezaActual.x && p.y === cabezaActual.y);
      if (chocaConsigoMisma) {
        clearInterval(intervalo);
        alert('Game Over!');
        window.location.reload();
        return;
      }

      // Mover la cabeza, atravesando los bordes del tablero (wrapping)
      let siguienteX = cabezaActual.x + e.dx;
      let siguienteY = cabezaActual.y + e.dy;
      if (siguienteX < 0) siguienteX = TAMANO_TABLERO - TAMANO_CELDA;
      else if (siguienteX >= TAMANO_TABLERO) siguienteX = 0;
      if (siguienteY < 0) siguienteY = TAMANO_TABLERO - TAMANO_CELDA;
      else if (siguienteY >= TAMANO_TABLERO) siguienteY = 0;

      const nuevaCabeza = { x: siguienteX, y: siguienteY };
      e.snake = [nuevaCabeza, ...e.snake];

      if (nuevaCabeza.x === e.food.x && nuevaCabeza.y === e.food.y) {
        generarFruta(); // ha comido: no quitamos la cola, la serpiente crece
      } else {
        e.snake.pop();
      }

      forzarRedibujo((n) => n + 1);
    }, 100);

    return () => clearInterval(intervalo);
  }, []);

  // Controles: flechas del teclado, sin permitir girar 180° sobre sí misma
  useEffect(() => {
    const alPulsarTecla = (ev) => {
      const e = estado.current;
      if (ev.key === 'ArrowUp' && e.dy === 0) {
        e.dx = 0;
        e.dy = -TAMANO_CELDA;
        e.rotacion = 180;
      }
      if (ev.key === 'ArrowDown' && e.dy === 0) {
        e.dx = 0;
        e.dy = TAMANO_CELDA;
        e.rotacion = 0;
      }
      if (ev.key === 'ArrowLeft' && e.dx === 0) {
        e.dx = -TAMANO_CELDA;
        e.dy = 0;
        e.rotacion = 90;
      }
      if (ev.key === 'ArrowRight' && e.dx === 0) {
        e.dx = TAMANO_CELDA;
        e.dy = 0;
        e.rotacion = 270;
      }
    };
    window.addEventListener('keydown', alPulsarTecla);
    return () => window.removeEventListener('keydown', alPulsarTecla);
  }, []);

  const { snake, food, rotacion } = estado.current;

  return (
    <div id="game-container">
      {snake.map((segmento, indice) => (
        <div
          key={indice}
          className={indice === 0 ? 'snake-head' : 'snake-body'}
          style={{
            left: `${segmento.x}px`,
            top: `${segmento.y}px`,
            transform: indice === 0 ? `rotate(${rotacion}deg)` : undefined,
          }}
        />
      ))}
      <div className="fruit" style={{ left: `${food.x}px`, top: `${food.y}px` }} />
    </div>
  );
}
