import { ORDEN, PALETAS } from './paletas.js';
import { tono } from './color.js';

const n = (x) => Math.round(x * 10) / 10;
const petalo = (w, h) =>
  `M0 0 C${n(w * 1.35)} ${n(-h * 0.1)} ${n(w * 1.2)} ${n(-h)} 0 ${n(-h)} C${n(-w * 1.2)} ${n(-h)} ${n(-w * 1.35)} ${n(-h * 0.1)} 0 0Z`;
const PETALO = petalo(14, 44);

// Una flor sencilla del color de la opción
function Roseta({ clave }) {
  const p = PALETAS[clave];
  const colores = p.petalos ?? Array(6).fill(p.muestra);
  return (
    <svg className="roseta" viewBox="-50 -50 100 100" aria-hidden="true">
      {colores.map((c, i) => (
        <path
          key={i}
          d={PETALO}
          fill={c}
          stroke={tono(c, -16)}
          strokeWidth="1.2"
          strokeLinejoin="round"
          transform={`rotate(${i * 60})`}
        />
      ))}
      <circle r="11" fill={p.centro} />
    </svg>
  );
}

// Primera pantalla: mensaje genérico y los colores para elegir.
// `foco` es el color que se eligió antes, para devolver el foco al teclado al volver.
export default function Colores({ onElegir, foco }) {
  return (
    <section className="eleccion entra">
      <h1 className="mensaje">Toca para elegir el color de tu ramo de flores</h1>
      <ul className="colores" aria-label="Colores de flores">
        {ORDEN.map((clave) => (
          <li key={clave}>
            <button
              type="button"
              className="color"
              onClick={() => onElegir(clave)}
              data-foco={foco === clave ? '' : undefined}
            >
              <Roseta clave={clave} />
              <span className="color-nombre">{PALETAS[clave].etiqueta}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
