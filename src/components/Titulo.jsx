// Título de sección. Sin animación de entrada: el único momento animado de la página es la portada
export default function Titulo({ children, className = '', ...resto }) {
  return (
    <h2 className={`section-title ${className}`.trim()} {...resto}>
      {children}
    </h2>
  );
}
