(async () => {
  // Piloto automático: una decisión por casilla, hacia la fruta por el camino libre (sin muros ni su cuerpo)
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  const N = 30;
  const tablero = document.querySelector('#game-container');
  // Posición dibujada en casillas (con decimales: la serpiente se desliza entre casillas)
  const dibujada = (el) => {
    const t = tablero.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const c = tablero.clientWidth / N;
    return { x: (r.left - t.left - tablero.clientLeft) / c, y: (r.top - t.top - tablero.clientTop) / c };
  };
  const redonda = (p) => ({ x: Math.round(p.x), y: Math.round(p.y) });
  const DIR = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
  const pulsar = (key) => window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  let real = 'ArrowRight'; // la dirección en la que se mueve de verdad
  pulsar(real);
  let ultima = null; // casilla en la que se tomó la última decisión
  const fin = performance.now() + 11000;
  while (performance.now() < fin && !document.querySelector('.fin')) {
    const d = dibujada(document.querySelector('.snake-head'));
    // La cabeza lógica va por delante de la dibujada: se redondea hacia donde avanza
    const [dx, dy] = DIR[real];
    const cabeza = {
      x: dx > 0 ? Math.ceil(d.x - 0.01) : dx < 0 ? Math.floor(d.x + 0.01) : Math.round(d.x),
      y: dy > 0 ? Math.ceil(d.y - 0.01) : dy < 0 ? Math.floor(d.y + 0.01) : Math.round(d.y),
    };
    if (!ultima || cabeza.x !== ultima.x || cabeza.y !== ultima.y) {
      ultima = cabeza;
      const cuerpo = [...document.querySelectorAll('.snake-body, .snake-tail')].map((el) => redonda(dibujada(el)));
      const f = redonda(dibujada(document.querySelector('.fruit')));
      const libre = ([ix, iy]) => {
        const x = cabeza.x + ix;
        const y = cabeza.y + iy;
        return x >= 0 && y >= 0 && x < N && y < N && !cuerpo.some((c) => c.x === x && c.y === y);
      };
      const contrario = (k) => DIR[k][0] === -dx && DIR[k][1] === -dy;
      const distancia = (k) => Math.abs(cabeza.x + DIR[k][0] - f.x) + Math.abs(cabeza.y + DIR[k][1] - f.y);
      const mejor = Object.keys(DIR)
        .filter((k) => !contrario(k) && libre(DIR[k]))
        .sort((a, b) => distancia(a) - distancia(b))[0];
      if (mejor && mejor !== real) {
        pulsar(mejor);
        real = mejor;
      }
    }
    await esperar(16);
  }
  await esperar(400);
  return document.querySelector('.fin') ? 'murió' : document.querySelectorAll('.snake-body, .snake-tail').length;
})()
