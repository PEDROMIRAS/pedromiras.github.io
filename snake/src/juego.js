// Lógica del juego sin React, en coordenadas de celda: así se puede probar con "npm test".

export const CELDAS = 30; // celdas por lado; el tamaño en píxeles lo decide --celda (styles.css)

export const DIRECCIONES = {
  ArrowUp: { dx: 0, dy: -1, rotacion: 180 },
  ArrowDown: { dx: 0, dy: 1, rotacion: 0 }, // 0 = la imagen mira hacia abajo, igual que el original
  ArrowLeft: { dx: -1, dy: 0, rotacion: 90 },
  ArrowRight: { dx: 1, dy: 0, rotacion: 270 },
};

function frutaLibre(snake) {
  // shortcut: bucle sin fin si la serpiente llena las 900 celdas; elegir entre las libres si alguien llega
  let f;
  do {
    f = { x: Math.floor(Math.random() * CELDAS), y: Math.floor(Math.random() * CELDAS) };
  } while (snake.some((p) => p.x === f.x && p.y === f.y));
  return f;
}

export function estadoInicial() {
  const snake = [{ x: 10, y: 10 }];
  return { snake, food: frutaLibre(snake), dx: 0, dy: 0, rotacion: 0, siguiente: null };
}

// Guarda el giro para el próximo tick. Se compara con la dirección del último movimiento real,
// así dos teclas rápidas no pueden girar la serpiente 180° sobre sí misma.
export function girar(e, d) {
  if (d.dx !== -e.dx || d.dy !== -e.dy) e.siguiente = d;
}

// Avanza un tick. Devuelve false si la serpiente ha chocado con un muro o consigo misma.
export function avanzar(e) {
  if (e.siguiente) {
    Object.assign(e, e.siguiente);
    e.siguiente = null;
  }
  if (e.dx === 0 && e.dy === 0) return true; // aún no ha empezado a moverse

  const cabeza = { x: e.snake[0].x + e.dx, y: e.snake[0].y + e.dy };
  const fuera = (v) => v < 0 || v >= CELDAS;
  if (fuera(cabeza.x) || fuera(cabeza.y)) return false; // los bordes del tablero son muros
  const come = cabeza.x === e.food.x && cabeza.y === e.food.y;
  const cuerpo = come ? e.snake : e.snake.slice(0, -1); // si no come, la cola se aparta
  if (cuerpo.some((p) => p.x === cabeza.x && p.y === cabeza.y)) return false;

  e.snake = [cabeza, ...cuerpo];
  if (come) e.food = frutaLibre(e.snake);
  return true;
}

// Dónde dibujar un segmento entre dos ticks: con t=0 donde estaba y con t=1 donde está ahora.
export function entre(antes, ahora, t) {
  if (!antes) return ahora; // segmento que acaba de nacer al comer: aún no se mueve
  return { x: antes.x + (ahora.x - antes.x) * t, y: antes.y + (ahora.y - antes.y) * t };
}
