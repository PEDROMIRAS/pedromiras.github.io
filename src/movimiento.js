// La curva de toda la web: arranca rápido y frena suave, como algo que sube y se asienta
export const SUBIDA = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };

/** Texto dentro de .mascara: empieza por debajo de su borde y sube. Se dispara desde el padre (variantes). */
export const TEXTO = { oculto: { y: '110%' }, visible: { y: 0, transition: SUBIDA } };

/** Entrada de un bloque: aparece subiendo un poco, `retraso` segundos después de cargar. */
export const aparece = (retraso) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { ...SUBIDA, duration: 0.6, delay: retraso },
});
