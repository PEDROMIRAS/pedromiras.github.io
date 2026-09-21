// Generador procedural de ramos de flores.
// Cada llamada devuelve un ramo distinto (composición, tipos de flor, tonos, tamaños, hojas).
// generarRamo(semilla, 'rojas'): con la misma semilla y paleta sale siempre el mismo ramo.

import { hsl, tono } from './color.js';
import { PALETAS } from './paletas.js';

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;

// Punto de la curva de Bézier cuadrática y su tangente
function puntoCurva(B, C, A, t) {
  const u = 1 - t;
  return {
    x: u * u * B.x + 2 * u * t * C.x + t * t * A.x,
    y: u * u * B.y + 2 * u * t * C.y + t * t * A.y,
    dx: 2 * u * (C.x - B.x) + 2 * t * (A.x - C.x),
    dy: 2 * u * (C.y - B.y) + 2 * t * (A.y - C.y),
  };
}

const RADIOS = {
  girasol: [50, 62],
  margarita: [38, 48],
  rosa: [38, 48],
  tulipan: [34, 42],
  narciso: [36, 45],
  ranunculo: [36, 45],
  boton: [18, 25],
  mimosa: [28, 36],
};

export function generarRamo(semilla = Math.floor(Math.random() * 2 ** 32), clave = 'amarillas') {
  const paleta = PALETAS[clave] ?? PALETAS.amarillas;
  const rnd = mulberry32(semilla);
  const entre = (a, b) => a + rnd() * (b - a);
  const entero = (a, b) => Math.floor(entre(a, b + 1));
  const elegir = (arr) => arr[Math.floor(rnd() * arr.length)];
  const barajar = (arr) => {
    const c = [...arr];
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    return c;
  };

  // --- Ambiente del ramo: cada ramo se inclina hacia un tono de la paleta.
  // En "todos los colores" cada ramo mezcla 4 familias distintas.
  const ambienteRamo = elegir(paleta.ambientes);
  const familias = paleta.mezcla ? barajar(paleta.ambientes).slice(0, 4) : null;
  const ambienteDe = (tipo) => {
    if (familias) return tipo === 'girasol' ? elegir(paleta.calidos) : elegir(familias);
    return ambienteRamo;
  };

  const colorFlor = (amb, dorado = 0) => {
    const tope = amb.tope ?? 92;
    const dl = amb.dl ?? 6;
    const h = amb.h + entre(-5, 6) - dorado;
    const s = entre(amb.s[0], amb.s[1]);
    const l = Math.min(tope, amb.l + entre(-dl, dl + 2) - dorado * 1.2);
    return {
      base: hsl(h, s, l),
      claro: hsl(h + 2, s, Math.min(l + (amb.aclara ?? 13), tope)),
      oscuro: hsl(h - 5, s, l - (amb.oscurece ?? 13)),
    };
  };

  const colorRelleno = () => {
    const p = paleta.relleno;
    const l = entre(p.l[0], p.l[1]);
    return {
      base: hsl(p.h, p.s, l),
      claro: hsl(p.h + 2, p.s, Math.min(l + 20, 97)),
      oscuro: hsl(p.h - 4, p.s, l - 10),
    };
  };

  const verdeHoja = () => hsl(entre(128, 152), entre(36, 52), entre(34, 46));

  // --- Qué flores lleva este ramo
  const disponibles = paleta.tipos;
  const principales = barajar(disponibles).slice(0, entero(3, Math.min(5, disponibles.length)));
  const tipos = [...principales];
  const nPrincipales = entero(8, 10);
  while (tipos.length < nPrincipales) {
    let t = elegir(principales);
    if (t === 'girasol' && tipos.filter((x) => x === 'girasol').length >= 2) {
      const otros = principales.filter((x) => x !== 'girasol');
      if (otros.length) t = elegir(otros);
    }
    tipos.push(t);
  }
  const nRellenos = entero(4, 7);
  for (let i = 0; i < nRellenos; i++) tipos.push(rnd() < 0.5 ? 'mimosa' : 'boton');

  // --- Colocación en forma de cúpula, sin amontonar demasiado
  const orden = tipos
    .map((tipo) => ({ tipo, r: entre(...RADIOS[tipo]) }))
    .sort((a, b) => b.r - a.r);

  const colocadas = [];
  for (const f of orden) {
    let pos = null;
    let holgura = 0.74;
    for (let intento = 0; intento < 700 && !pos; intento++) {
      if (intento > 0 && intento % 100 === 0) holgura -= 0.06;
      const ang = entre(0, Math.PI * 2);
      const rad = Math.sqrt(rnd());
      const x = 200 + Math.cos(ang) * rad * 122;
      const y = 200 + Math.sin(ang) * rad * 122;
      if (y > 285) continue;
      if (colocadas.every((o) => Math.hypot(o.x - x, o.y - y) >= (o.r + f.r) * holgura)) {
        pos = { x, y };
      }
    }
    if (!pos) pos = { x: 200 + entre(-110, 110), y: entre(90, 280) };
    colocadas.push({ ...f, ...pos });
  }

  // De arriba hacia abajo: las de abajo tapan un poco a las de arriba
  colocadas.sort((a, b) => a.y - b.y);

  // --- Datos de cada flor + su tallo
  const flores = [];
  const tallos = [];
  const hojasTallo = [];

  colocadas.forEach((c, i) => {
    const esTulipan = c.tipo === 'tulipan';
    const relleno = c.tipo === 'mimosa' || c.tipo === 'boton';
    const ax = c.x;
    const ay = esTulipan ? c.y + c.r * 0.75 : c.y;
    const dist = Math.hypot(c.x - 200, c.y - 205);

    const f = {
      id: `f${i}`,
      tipo: c.tipo,
      r: r1(c.r),
      ax: r1(ax),
      ay: r1(ay),
      rot: r1(esTulipan ? entre(-12, 12) : c.tipo === 'mimosa' ? 0 : entre(-30, 30)),
      color:
        c.tipo === 'mimosa'
          ? colorRelleno()
          : colorFlor(ambienteDe(c.tipo), c.tipo === 'girasol' ? 5 : 0),
      petalas:
        c.tipo === 'girasol' ? entero(14, 20) : c.tipo === 'margarita' ? entero(11, 16) : 0,
      giro: r1(entre(0, 60)),
    };

    if (c.tipo === 'mimosa') {
      f.bolitas = Array.from({ length: entero(12, 18) }, () => {
        const a = entre(0, Math.PI * 2);
        const d = Math.sqrt(rnd()) * c.r * 0.85;
        return { x: r1(Math.cos(a) * d), y: r1(Math.sin(a) * d), r: r1(entre(4.5, 7.5)) };
      });
    }

    const retrasoTallo = 0.25 + (dist / 200) * 0.45 + entre(0, 0.12);
    f.retraso = r2(retrasoTallo + 0.7 + entre(0, 0.1));

    // Tallo: curva desde el punto de atado hasta la flor
    const B = { x: 200 + entre(-12, 12), y: 456 };
    const A = { x: ax, y: ay };
    const C = {
      x: B.x + (A.x - B.x) * 0.25 + entre(-14, 14),
      y: B.y + (A.y - B.y) * 0.55,
    };
    tallos.push({
      id: `t${i}`,
      d: `M${r1(B.x)} ${r1(B.y)} Q${r1(C.x)} ${r1(C.y)} ${r1(A.x)} ${r1(A.y)}`,
      color: hsl(entre(130, 150), entre(34, 46), entre(26, 34)),
      grosor: c.tipo === 'girasol' ? 5.5 : relleno ? 3 : 4,
      retraso: r2(retrasoTallo),
    });

    // Hoja pegada al tallo (la mayoría de las veces)
    if (!relleno && rnd() < 0.75) {
      for (let intento = 0; intento < 6; intento++) {
        const t = entre(0.35, 0.8);
        const p = puntoCurva(B, C, A, t);
        if (p.y > 350) continue;
        const lado = rnd() < 0.5 ? -1 : 1;
        const angTangente = (Math.atan2(p.dx, -p.dy) * 180) / Math.PI;
        hojasTallo.push({
          id: `h${i}`,
          x: r1(p.x),
          y: r1(p.y),
          rot: r1(angTangente + lado * entre(38, 62)),
          largo: r1(entre(34, 60)),
          ancho: r1(entre(9, 15)),
          color: verdeHoja(),
          retraso: r2(retrasoTallo + 0.45),
        });
        break;
      }
    }

    flores.push(f);
  });

  // --- Hojas grandes de fondo, detrás de todo
  const hojasFondo = Array.from({ length: entero(6, 9) }, (_, i) => {
    const lado = i % 2 === 0 ? -1 : 1;
    const giro = entre(10, 58);
    return {
      id: `g${i}`,
      x: r1(200 + entre(-10, 10)),
      y: r1(420 + entre(-10, 10)),
      rot: r1(lado * giro),
      largo: r1(entre(200, 270) * (1 - giro / 170)),
      ancho: r1(entre(20, 32)),
      color: verdeHoja(),
      retraso: r2(entre(0.05, 0.4)),
    };
  });

  const cinta = paleta.tema.cinta;
  return {
    id: semilla,
    nombre: paleta.nombre,
    tema: { cinta, cintaOscura: tono(cinta, -14), cintaClara: tono(cinta, 16) },
    hojasFondo,
    tallos,
    hojasTallo,
    flores,
  };
}
