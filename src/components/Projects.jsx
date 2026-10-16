import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useSpring } from 'motion/react';
import { SUBIDA } from '../movimiento.js';
import Titulo from './Titulo.jsx';

// Datos de cada proyecto. Todos son mini-apps aparte (su propia carpeta, su propio
// build), enlazadas por ruta relativa: el flujo de trabajo de GitHub Actions las
// compila y las coloca junto a este sitio, cada una en su propia carpeta.
const REPO = 'https://github.com/PEDROMIRAS/pedromiras.github.io/tree/main';

const MUELLE = { stiffness: 220, damping: 22 };

// Entrada al llegar a Projects: cada tarjeta un poco después de la anterior (i), y su captura se descubre
// de arriba abajo. Solo opacidad y recorte: la inclinación ya usa transform en la misma tarjeta.
const TARJETA = { oculto: { opacity: 0 }, visible: (i) => ({ opacity: 1, transition: { duration: 0.6, delay: i * 0.12 } }) };
const CORTINA = {
  oculto: { clipPath: 'inset(0 0 100% 0)' },
  visible: (i) => ({ clipPath: 'inset(0 0 0% 0)', transition: { ...SUBIDA, delay: i * 0.12 + 0.1 } }),
};

/**
 * Tarjeta que se inclina hacia el ratón con un muelle y vuelve recta al salir. Con el dedo no se inclina
 * (no hay puntero que seguir), ni para quien pide menos movimiento. El brillo lo pinta el CSS con --x e --y.
 */
function Tarjeta({ indice, children }) {
  const tarjeta = useRef(null);
  const quieta = useReducedMotion();
  const giroX = useSpring(0, MUELLE);
  const giroY = useSpring(0, MUELLE);

  // El giro se aplica a mano: el componente animado de Motion añadiría unos 30 KB a la carga inicial
  useEffect(() => {
    const pintar = () => {
      if (tarjeta.current) tarjeta.current.style.transform = `perspective(900px) rotateX(${giroX.get()}deg) rotateY(${giroY.get()}deg)`;
    };
    const quitarX = giroX.on('change', pintar);
    const quitarY = giroY.on('change', pintar);
    return () => { quitarX(); quitarY(); };
  }, [giroX, giroY]);

  const mover = (e) => {
    if (quieta || e.pointerType !== 'mouse') return;
    const caja = e.currentTarget.getBoundingClientRect();
    // Posición del puntero sobre la tarjeta, de -0.5 a 0.5
    const px = (e.clientX - caja.left) / caja.width - 0.5;
    const py = (e.clientY - caja.top) / caja.height - 0.5;
    giroX.set(py * -8);
    giroY.set(px * 8);
    e.currentTarget.style.setProperty('--x', px.toFixed(3));
    e.currentTarget.style.setProperty('--y', py.toFixed(3));
  };
  const soltar = (e) => {
    giroX.set(0);
    giroY.set(0);
    e.currentTarget.style.removeProperty('--x');
    e.currentTarget.style.removeProperty('--y');
  };

  return (
    <motion.article
      ref={tarjeta}
      className="project glass-card"
      onPointerMove={mover}
      onPointerLeave={soltar}
      custom={indice}
      variants={TARJETA}
      initial={quieta ? false : 'oculto'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.article>
  );
}

// Ramo de flores sigue en el repositorio y publicado en su carpeta, pero no se enseña aquí
const PROYECTOS = [
  {
    nombre: 'Todo App',
    descripcion: `A task manager: add, complete and delete tasks, filter them and see live statistics.
      Everything is saved in the browser.`,
    etiquetas: ['React', 'localStorage', 'UI in Spanish'],
    carpeta: 'todoApp',
    imagen: { src: './assets/img/todo-app.webp', ancho: 1280, alto: 720 },
    alt: 'Task list application',
  },
  {
    nombre: 'Sushi Tracker',
    descripcion: `A mobile-first counter for sushi nights, with a single-player mode, a two-player duel on a
      split screen and a history of past sessions that an optional account keeps in the cloud.
      Installable, and it works offline.`,
    etiquetas: ['React', 'Tailwind CSS', 'Supabase', 'PWA', 'UI in Spanish'],
    carpeta: 'sushi-tracker',
    imagen: { src: './assets/img/sushi-tracker.webp', ancho: 1280, alto: 720 },
    alt: 'Sushi counter application',
  },
  {
    nombre: 'Snake',
    descripcion: `The classic game. Move with the arrow keys or by swiping on a phone, eat fruit to grow and
      cross the edges of the board. It keeps your score and your best result.`,
    etiquetas: ['React', 'JavaScript'],
    carpeta: 'snake',
    imagen: { src: './assets/img/snake.webp', ancho: 1280, alto: 720 },
    alt: 'Snake game board',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <Titulo id="projects-title">Projects</Titulo>
      <p className="projects-intro">
        Small apps I build in my own time to try ideas out. My day-to-day work is back end and data, and it stays
        private.
      </p>

      <div className="projects-container">
        {PROYECTOS.map((p, i) => (
          <Tarjeta key={p.nombre} indice={i}>
            <motion.a
              custom={i}
              variants={CORTINA}
              className="project-image"
              href={`./${p.carpeta}/`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <img src={p.imagen.src} alt={p.alt} width={p.imagen.ancho} height={p.imagen.alto} loading="lazy" />
            </motion.a>
            <div className="project-body">
              <h3 className="project-name">{p.nombre}</h3>
              <p>{p.descripcion}</p>
              <ul className="tags" aria-label="Technologies">
                {p.etiquetas.map((etiqueta) => (
                  <li key={etiqueta}>{etiqueta}</li>
                ))}
              </ul>
              <div className="project-links">
                <a
                  href={`./${p.carpeta}/`}
                  className="btn btn-primary"
                  aria-label={`Live demo: ${p.nombre}`}
                >
                  Live demo
                </a>
                <a
                  href={`${REPO}/${p.carpeta}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  aria-label={`Source code: ${p.nombre}`}
                >
                  Source code
                </a>
              </div>
            </div>
          </Tarjeta>
        ))}
      </div>
    </section>
  );
}
