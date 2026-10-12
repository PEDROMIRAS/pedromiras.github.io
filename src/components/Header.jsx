import { useEffect, useState } from 'react';

const SECCIONES = [
  { id: 'about', nombre: 'About' },
  { id: 'experience', nombre: 'Experience' },
  { id: 'skills', nombre: 'Skills' },
  { id: 'projects', nombre: 'Projects' },
  { id: 'contact', nombre: 'Contact' },
];

function limpiarCookiesTraduccion() {
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  // Limpiamos la cookie también para el dominio actual (window.location.hostname)
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
}

// Cabecera fija: nombre (vuelve arriba), menú con la sección actual resaltada,
// botón de idioma (Google Translate) y botón de menú en pantallas estrechas.
export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState(null);
  // La etiqueta muestra el idioma actual desde el primer momento, cargue o no el traductor
  const [etiquetaIdioma, setEtiquetaIdioma] = useState(() =>
    localStorage.getItem('userLang') === 'es' ? 'ES' : 'EN'
  );

  // Sección actual: la que cruza la mitad de la pantalla
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActiva(e.target.id)),
      { rootMargin: '-50% 0px -50% 0px' }
    );
    document.querySelectorAll('main section[id]').forEach((s) => observador.observe(s));
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    limpiarCookiesTraduccion();
    const idiomaGuardado = localStorage.getItem('userLang') || 'en';

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,es', autoDisplay: false },
        'google_translate_element'
      );
      // Aplicamos el idioma guardado en cuanto el widget está listo
      setTimeout(() => {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          combo.value = idiomaGuardado === 'es' ? 'es' : '';
          if (idiomaGuardado === 'es') combo.dispatchEvent(new Event('change'));
          setEtiquetaIdioma(idiomaGuardado === 'en' ? 'EN' : 'ES');
        }
      }, 500);
    };

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  const cambiarIdioma = () => {
    const actual = localStorage.getItem('userLang') || 'en';
    localStorage.setItem('userLang', actual === 'en' ? 'es' : 'en');
    limpiarCookiesTraduccion();
    window.location.reload();
  };

  return (
    <header onKeyDown={(e) => e.key === 'Escape' && setAbierto(false)}>
      <a href="#home" className="brand notranslate" translate="no" onClick={() => setAbierto(false)}>
        Pedro Miras
      </a>

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

      <div className="header-actions">
        <button id="lang-toggle-btn" className="translate-btn" onClick={cambiarIdioma} aria-label="Cambiar idioma">
          {etiquetaIdioma}
        </button>
        <button
          type="button"
          className="menu-toggle notranslate"
          translate="no"
          aria-label={abierto ? 'Close menu' : 'Open menu'}
          aria-expanded={abierto}
          aria-controls="menu"
          onClick={() => setAbierto(!abierto)}
        >
          {abierto ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}
