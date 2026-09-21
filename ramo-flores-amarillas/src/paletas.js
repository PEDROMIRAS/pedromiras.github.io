// Paletas de color del ramo.
// - etiqueta, muestra, centro, petalos: cómo se ve el color en la pantalla de elegir
// - tema:      colores de la página y del lazo para que las flores destaquen
// - ambientes: familias de tono de las flores (h = matiz, s = saturación, l = luminosidad)
// - tipos:     flores que tienen sentido en ese color
// - relleno:   color de las bolitas de relleno (mimosa / gipsófila)

const AMARILLO = [
  { h: 46, s: [88, 100], l: 55 },
  { h: 51, s: [88, 100], l: 59 },
  { h: 56, s: [88, 100], l: 65 },
];
const NARANJA = [
  { h: 24, s: [90, 100], l: 54 },
  { h: 30, s: [90, 100], l: 56 },
  { h: 18, s: [88, 100], l: 54 },
];
const ROJO = [
  { h: 0, s: [75, 90], l: 46 },
  { h: 355, s: [75, 90], l: 43 },
  { h: 6, s: [78, 92], l: 50 },
];
const ROSA = [
  { h: 335, s: [70, 90], l: 68 },
  { h: 345, s: [70, 90], l: 74 },
  { h: 325, s: [60, 80], l: 64 },
];
const MORADO = [
  { h: 275, s: [55, 75], l: 62 },
  { h: 262, s: [55, 75], l: 66 },
  { h: 290, s: [50, 70], l: 64 },
];
const AZUL = [
  { h: 215, s: [70, 90], l: 60 },
  { h: 225, s: [70, 90], l: 65 },
  { h: 200, s: [70, 90], l: 58 },
];
const BLANCO = [
  { h: 50, s: [25, 55], l: 93, dl: 3, tope: 99, aclara: 6, oscurece: 12 },
  { h: 40, s: [30, 60], l: 92, dl: 3, tope: 99, aclara: 6, oscurece: 12 },
  { h: 60, s: [25, 50], l: 94, dl: 3, tope: 99, aclara: 5, oscurece: 12 },
];

const TODAS = ['girasol', 'margarita', 'rosa', 'tulipan', 'narciso', 'ranunculo'];
const BOLITAS_AMARILLAS = { h: 50, s: 100, l: [54, 62] };
const BOLITAS_BLANCAS = { h: 0, s: 0, l: [93, 98] };

export const PALETAS = {
  amarillas: {
    nombre: 'amarillas',
    muestra: '#FFD400',
    etiqueta: 'Amarillas',
    centro: '#7A4E24',
    tema: { fondo: '#1F2A5C', halo: '#2A388A', texto: '#FFD84A', cinta: '#E4572E' },
    ambientes: AMARILLO,
    tipos: TODAS,
    relleno: BOLITAS_AMARILLAS,
  },
  naranjas: {
    nombre: 'naranjas',
    muestra: '#FF8A1F',
    etiqueta: 'Naranjas',
    centro: '#7A4E24',
    tema: { fondo: '#12356B', halo: '#1B4B8F', texto: '#FFB066', cinta: '#D6336C' },
    ambientes: NARANJA,
    tipos: ['girasol', 'margarita', 'rosa', 'tulipan', 'ranunculo'],
    relleno: BOLITAS_AMARILLAS,
  },
  rojas: {
    nombre: 'rojas',
    muestra: '#E5383B',
    etiqueta: 'Rojas',
    centro: '#FFD23F',
    tema: { fondo: '#0F3D4C', halo: '#175668', texto: '#FF9A8B', cinta: '#E0A72B' },
    ambientes: ROJO,
    tipos: ['rosa', 'tulipan', 'ranunculo', 'margarita'],
    relleno: BOLITAS_BLANCAS,
  },
  rosas: {
    nombre: 'rosas',
    muestra: '#FF7EB6',
    etiqueta: 'Rosas',
    centro: '#FFD23F',
    tema: { fondo: '#3A1A4A', halo: '#54296A', texto: '#FFB8D4', cinta: '#2BA39B' },
    ambientes: ROSA,
    tipos: ['rosa', 'tulipan', 'ranunculo', 'margarita', 'narciso'],
    relleno: BOLITAS_BLANCAS,
  },
  moradas: {
    nombre: 'moradas',
    muestra: '#9B6BFF',
    etiqueta: 'Moradas',
    centro: '#FFD23F',
    tema: { fondo: '#2E2117', halo: '#45321F', texto: '#D9B8FF', cinta: '#F2C230' },
    ambientes: MORADO,
    tipos: ['rosa', 'tulipan', 'ranunculo', 'margarita'],
    relleno: { h: 270, s: 60, l: [88, 94] },
  },
  azules: {
    nombre: 'azules',
    muestra: '#4C8DFF',
    etiqueta: 'Azules',
    centro: '#FFD23F',
    tema: { fondo: '#4A1D2E', halo: '#692A40', texto: '#A9CCFF', cinta: '#F08A3C' },
    ambientes: AZUL,
    tipos: ['margarita', 'ranunculo', 'rosa', 'tulipan'],
    relleno: BOLITAS_BLANCAS,
  },
  blancas: {
    nombre: 'blancas',
    muestra: '#F6F2EA',
    etiqueta: 'Blancas',
    centro: '#F2A20C',
    tema: { fondo: '#3B1626', halo: '#562339', texto: '#FFF4E8', cinta: '#E4572E' },
    ambientes: BLANCO,
    tipos: ['rosa', 'tulipan', 'margarita', 'narciso', 'ranunculo'],
    relleno: { h: 52, s: 85, l: [80, 88] },
  },
  multi: {
    nombre: 'de todos los colores',
    muestra: '#FF7EB6',
    etiqueta: 'Mezcla',
    centro: '#F2A20C',
    petalos: ['#FFD400', '#FF8A1F', '#E5383B', '#FF7EB6', '#9B6BFF', '#4C8DFF'],
    fondoMuestra:
      'conic-gradient(#FFD400, #FF8A1F, #E5383B, #FF7EB6, #9B6BFF, #4C8DFF, #F6F2EA, #FFD400)',
    tema: { fondo: '#1D2B33', halo: '#2B4350', texto: '#FFE9A8', cinta: '#E4572E' },
    // Una familia de cada color; cada ramo mezcla 4 de ellas
    ambientes: [AMARILLO[1], NARANJA[0], ROJO[0], ROSA[0], MORADO[0], AZUL[0], BLANCO[0]],
    calidos: [AMARILLO[1], NARANJA[0]], // para los girasoles
    mezcla: true,
    tipos: TODAS,
    relleno: BOLITAS_AMARILLAS,
  },
};

export const ORDEN = ['amarillas', 'naranjas', 'rojas', 'rosas', 'moradas', 'azules', 'blancas', 'multi'];
