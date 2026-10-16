import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import Icono from './Icono.jsx';
import { SUBIDA, aparece } from '../movimiento.js';

export default function Home() {
  const portada = useRef(null);
  const quieta = useReducedMotion();
  // 0 con la portada arriba del todo, 1 cuando ya ha salido de pantalla por arriba
  const { scrollYProgress } = useScroll({ target: portada, offset: ['start start', 'end start'] });
  const haciaIzquierda = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const haciaDerecha = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const desvanece = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="home" className="home" ref={portada}>
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

      <a href="#about" className="home-scroll" aria-label="Scroll to About">
        <Icono nombre="chevron-down" />
      </a>
    </section>
  );
}
