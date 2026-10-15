import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { CATEGORIAS } from './Skills.jsx';

// Las de Backend, Data y Frontend: las herramientas de trabajo no dicen nada pasando en grande
const PALABRAS = CATEGORIAS.slice(0, 3).flatMap((categoria) => categoria.items.map((item) => item.nombre));
const VELOCIDAD = 2; // % del ancho de la pista por segundo, sin hacer scroll

// Lleva v al tramo [min, max): la pista vuelve al principio sin que se note el salto
const envolver = (min, max, v) => ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min;

// Cinta de tecnologías que pasa en bucle y acelera mientras se hace scroll. Es decoración: las mismas
// tecnologías están en Skills, así que se oculta a los lectores de pantalla.
export default function Cinta() {
  const quieta = useReducedMotion();
  const posicion = useMotionValue(0);
  const { scrollY } = useScroll();
  const rapidez = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const extra = useTransform(rapidez, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(posicion, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (quieta) return;
    const segundos = Math.min(delta, 100) / 1000;
    // La pista lleva la lista dos veces: al recorrer la mitad, vuelve al inicio y queda igual
    posicion.set(envolver(-50, 0, posicion.get() - (VELOCIDAD + Math.abs(extra.get())) * segundos));
  });

  return (
    <div className="cinta" aria-hidden="true">
      <motion.div className="cinta-pista" style={{ x }}>
        {[0, 1].map((copia) => (
          <span key={copia} className="cinta-grupo">
            {PALABRAS.map((palabra) => (
              <span key={palabra}>{palabra}</span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
