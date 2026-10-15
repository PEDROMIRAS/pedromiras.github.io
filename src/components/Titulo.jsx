import { motion } from 'motion/react';
import { SUBIDA } from '../movimiento.js';

const TEXTO = { oculto: { y: '110%' }, visible: { y: 0 } };

// Título de sección que sube desde detrás de una máscara la primera vez que entra en pantalla.
// Se vigila la máscara y no el texto: el texto empieza recortado por ella y el navegador lo daría
// por invisible siempre, así que nunca llegaría a subir.
export default function Titulo({ children, className = '', ...resto }) {
  return (
    <h2 className={`section-title ${className}`.trim()} {...resto}>
      <motion.span
        className="mascara"
        initial="oculto"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.span className="mascara-texto" variants={TEXTO} transition={SUBIDA}>
          {children}
        </motion.span>
      </motion.span>
    </h2>
  );
}
