import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Fondo de la sección Skills: cintas de luz de la paleta del portfolio ondulando sobre el negro.
// Cada onda da un número entero de vueltas en la duración del vídeo: el último fotograma empalma con el
// primero y el bucle no salta.
const ONDAS = [
  { color: "#6a4cf5", y: 0.3, amplitud: 0.09, longitud: 1.1, vueltas: 1, grosor: 140 },
  { color: "#d44df0", y: 0.45, amplitud: 0.12, longitud: 0.8, vueltas: -1, grosor: 110 },
  { color: "#ff7a3d", y: 0.62, amplitud: 0.08, longitud: 1.4, vueltas: 2, grosor: 90 },
  { color: "#ff5577", y: 0.75, amplitud: 0.1, longitud: 0.9, vueltas: -2, grosor: 70 },
  { color: "#6a4cf5", y: 0.88, amplitud: 0.06, longitud: 1.7, vueltas: 1, grosor: 120 },
];

const PUNTOS = 48; // tramos de cada curva: de sobra para que se vea lisa

export const Ondas: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const avance = (frame / durationInFrames) * Math.PI * 2;

  const camino = (o: (typeof ONDAS)[number]) =>
    Array.from({ length: PUNTOS + 1 }, (_, i) => {
      const x = (i / PUNTOS) * width;
      const y =
        (o.y + o.amplitud * Math.sin((i / PUNTOS) * Math.PI * 2 * o.longitud + avance * o.vueltas)) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: "#090909" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="difuminado" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="38" />
          </filter>
        </defs>
        <g filter="url(#difuminado)" opacity={0.55}>
          {ONDAS.map((o, i) => (
            <path key={i} d={camino(o)} stroke={o.color} strokeWidth={o.grosor} strokeLinecap="round" fill="none" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
