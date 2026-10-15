import { motion } from 'motion/react';
import { SUBIDA, TEXTO } from '../movimiento.js';

const RAYA = { oculto: { scaleX: 0 }, visible: { scaleX: 1, transition: { ...SUBIDA, duration: 0.6, delay: 0.35 } } };

// Título de sección: el texto sube desde detrás de una máscara y después se dibuja la raya, la primera
// vez que entra en pantalla. Se vigila el título entero y no el texto: el texto empieza recortado por
// su máscara y el navegador lo daría por invisible siempre, así que nunca llegaría a subir.
export default function Titulo({ children, className = '', ...resto }) {
  return (
    <motion.h2
      className={`section-title ${className}`.trim()}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      {...resto}
    >
      <span className="mascara">
        <motion.span className="mascara-texto" variants={TEXTO}>
          {children}
        </motion.span>
      </span>
      <motion.span className="titulo-raya" variants={RAYA} aria-hidden="true" />
    </motion.h2>
  );
}
