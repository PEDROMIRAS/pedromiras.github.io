import { useEffect, useRef, useState } from 'react';

function limpiarCookiesTraduccion() {
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  // Limpiamos la cookie también para el dominio actual (window.location.hostname)
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
}

// Cabecera fija: menú, botón de idioma (Google Translate) y ocultarse al bajar
// (mismo comportamiento que antes tenían js/nav.js y js/translate.js).
export default function Header() {
  const [oculto, setOculto] = useState(false);
  const [etiquetaIdioma, setEtiquetaIdioma] = useState('ES');
  const ultimoScroll = useRef(0);

  useEffect(() => {
    const alHacerScroll = () => {
      const actual = window.scrollY;
      if (actual <= 0) {
        setOculto(false);
      } else {
        setOculto(actual > ultimoScroll.current);
      }
      ultimoScroll.current = actual;
    };
    window.addEventListener('scroll', alHacerScroll);
    return () => window.removeEventListener('scroll', alHacerScroll);
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
    <header className={oculto ? 'nav-hidden' : ''}>
      <nav className="menu" aria-label="Main Navigation">
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#skills">Skills</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
      <div>
        <button id="lang-toggle-btn" className="translate-btn" onClick={cambiarIdioma} aria-label="Cambiar idioma">
          {etiquetaIdioma}
        </button>
      </div>
    </header>
  );
}
