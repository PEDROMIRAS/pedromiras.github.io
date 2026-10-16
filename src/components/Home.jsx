import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Icono from './Icono.jsx';
import { SUBIDA, aparece } from '../movimiento.js';
import { usePausa } from '../pausa.js';

export default function Home() {
  const portada = useRef(null);
  const quieta = useReducedMotion();
  const enPantalla = useInView(portada); // fuera de pantalla, la aurora se para y no gasta
  const pausado = usePausa();
  // 0 con la portada arriba del todo, 1 cuando ya ha salido de pantalla por arriba
  const { scrollYProgress } = useScroll({ target: portada, offset: ['start start', 'end start'] });
  const haciaIzquierda = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const haciaDerecha = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const desvanece = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bajaFoto = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section id="home" className="home" ref={portada}>
      {/* Aurora: tres luces de la paleta que se mueven despacio por detrás de todo (solo CSS, home.css) */}
      <div className={`home-aurora${enPantalla && !pausado ? '' : ' en-pausa'}`} aria-hidden="true">
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
          Web Developer at NTT DATA
        </motion.p>
        <motion.p {...aparece(0.65)}>I build and maintain web applications, from the database to the interface.</motion.p>

        <motion.div className="home-actions" {...aparece(0.75)}>
          <a href="#projects" className="btn btn-primary">
            View my projects
          </a>
          <a href="#contact" className="btn btn-outline">
            Contact me
          </a>
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
