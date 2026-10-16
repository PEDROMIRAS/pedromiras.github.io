import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import Icono from './Icono.jsx';
import { SUBIDA, aparece } from '../movimiento.js';

const MUELLE = { stiffness: 220, damping: 18 };
const TIRON = 0.15; // fracción de la distancia al centro que el botón sigue al ratón

// Botón que se deja llevar un poco hacia el ratón mientras está encima. Solo con ratón: en el móvil no hay cursor
function Magnetico({ className, href, children }) {
  const quieta = useReducedMotion();
  const x = useSpring(0, MUELLE);
  const y = useSpring(0, MUELLE);
  const mover = (e) => {
    if (quieta || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * TIRON);
    y.set((e.clientY - r.top - r.height / 2) * TIRON);
  };
  const soltar = () => {
    x.set(0);
    y.set(0);
  };
  // whileTap en vez del :active de .btn: el transform en línea de Motion taparía el del CSS
  return (
    <motion.a href={href} className={className} style={{ x, y }} onPointerMove={mover} onPointerLeave={soltar} whileTap={{ scale: 0.97 }}>
      {children}
    </motion.a>
  );
}

export default function Home() {
  const portada = useRef(null);
  const quieta = useReducedMotion();
  // 0 con la portada arriba del todo, 1 cuando ya ha salido de pantalla por arriba
  const { scrollYProgress } = useScroll({ target: portada, offset: ['start start', 'end start'] });
  const haciaIzquierda = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const haciaDerecha = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const desvanece = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bajaFoto = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section id="home" className="home" ref={portada}>
      {/* Aurora: tres luces de la paleta que se mueven despacio por detrás de todo (solo CSS, home.css) */}
      <div className="home-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {/* Decoración: la misma foto está en About con su texto alternativo. Baja algo más lento que la página */}
      <motion.img
        className="home-foto"
        src="./assets/img/portfolio-image.webp"
        alt=""
        width="560"
        height="560"
        style={quieta ? undefined : { y: bajaFoto }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />
      <div className="home-content">
        <h1 className="home-nombre">
          <motion.span className="home-saludo" {...aparece(0)}>
            Hello, I’m{' '}
          </motion.span>
          {/* Cada línea sube desde detrás de su máscara y, al bajar por la página, se va hacia un lado */}
          {['Pedro', 'Miras'].map((linea, i) => (
            <motion.span
              key={linea}
              className="mascara home-linea"
              style={quieta ? undefined : { x: i === 0 ? haciaIzquierda : haciaDerecha, opacity: desvanece }}
            >
              <motion.span
                className="mascara-texto"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ ...SUBIDA, delay: 0.15 + i * 0.12 }}
              >
                {linea}
                {i === 0 ? ' ' : ''}
              </motion.span>
            </motion.span>
          ))}
        </h1>

        <motion.p className="home-puesto" {...aparece(0.55)}>
          Web Developer<span className="home-sep"> · </span>
          <span className="home-empresa">NTT DATA</span>
        </motion.p>
        <motion.p {...aparece(0.65)}>I build and maintain web applications, from the database to the interface.</motion.p>

        <motion.div className="home-actions" {...aparece(0.75)}>
          <Magnetico href="#projects" className="btn btn-primary">
            View my projects
          </Magnetico>
          <Magnetico href="#contact" className="btn btn-outline">
            Contact me
          </Magnetico>
        </motion.div>

        <motion.ul className="home-social" {...aparece(0.85)}>
          <li>
            <a href="https://github.com/PEDROMIRAS" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Icono nombre="github" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/pedro-miras/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Icono nombre="linkedin" />
            </a>
          </li>
        </motion.ul>
      </div>

    </section>
  );
}
