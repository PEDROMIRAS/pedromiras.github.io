import { motion } from 'motion/react';
import { TEXTO } from '../movimiento.js';

// Título de sección: el texto sube desde detrás de una máscara la primera vez que entra en pantalla.
// Se vigila el título entero y no el texto: el texto empieza recortado por su máscara
// y el navegador lo daría por invisible siempre, así que nunca llegaría a subir.
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
    </motion.h2>
  );
}
