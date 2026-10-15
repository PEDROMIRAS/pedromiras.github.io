import { useEffect, useRef, useState } from 'react';

const SECCIONES = [
  { id: 'about', nombre: 'About' },
  { id: 'projects', nombre: 'Projects' },
  { id: 'experience', nombre: 'Experience' },
  { id: 'skills', nombre: 'Skills' },
  { id: 'contact', nombre: 'Contact' },
];

// Cabecera fija: nombre (vuelve arriba), menú con la sección actual resaltada
// y botón de menú en pantallas estrechas.
export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef(null);
  const [activa, setActiva] = useState(null);

  // Sección actual: la que cruza la mitad de la pantalla
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActiva(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' }
    );
    document.querySelectorAll('main section[id]').forEach((s) => observador.observe(s));
    return () => observador.disconnect();
  }, []);

  // Al cerrar con Escape el foco vuelve al botón: si no, se queda en un enlace que ya no se ve
  const cerrarConEscape = (e) => {
    if (e.key !== 'Escape' || !abierto) return;
    setAbierto(false);
    botonMenu.current.focus();
  };

  return (
    <header onKeyDown={cerrarConEscape}>
      <a href="#home" className="brand" onClick={() => setAbierto(false)}>
        Pedro Miras
      </a>

      {/* En el HTML va antes del menú (orden de tabulación); en pantalla, al final */}
      <button
        type="button"
        ref={botonMenu}
        className="menu-toggle"
        aria-label={abierto ? 'Close menu' : 'Open menu'}
        aria-expanded={abierto}
        aria-controls="menu"
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? '✕' : '☰'}
      </button>

      <nav id="menu" className={`menu${abierto ? ' abierto' : ''}`} aria-label="Main Navigation">
        <ul>
          {SECCIONES.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={activa === s.id ? 'activo' : undefined}
                aria-current={activa === s.id ? 'location' : undefined}
                onClick={() => setAbierto(false)}
              >
                {s.nombre}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
