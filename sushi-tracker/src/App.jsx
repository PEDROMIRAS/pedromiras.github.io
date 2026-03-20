import { useState } from 'react';
import Onboarding from './components/Onboarding';
import SushiCounter from './components/SushiCounter';

/* COMPONENTE RAÍZ (ROOT COMPONENT) */

/**
 * Componente App principal de la aplicación.
 * Actúa como el controlador de vistas, decidiendo si mostrar la pantalla de bienvenida
 * o la aplicación principal basándose en la existencia de los datos del usuario.
 * * @returns {JSX.Element} La estructura principal de la aplicación (layout mobile-first).
 */
function App() {
  
  /* --- Estado Global (Global State) --- */

  /**
   * Estado del nombre del jugador.
   * Utiliza Inicialización Perezosa (Lazy Initialization) mediante una función anónima.
   * Esto asegura que la lectura del localStorage (síncrona y bloqueante) ocurra 
   * SOLO durante el primer renderizado, evitando problemas de rendimiento.
   */
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('sushiPlayerName') || null;
  });

  /* MANEJADORES DE EVENTOS (EVENT HANDLERS) */

  /**
   * Actualiza el nombre del jugador tanto en la memoria (estado de React) 
   * como en el disco (LocalStorage del navegador).
   * * @param {string} name - El nombre introducido o modificado por el usuario.
   */
  const handleSaveName = (name) => {
    localStorage.setItem('sushiPlayerName', name);
    setPlayerName(name);
  };

  /* RENDERIZADO DE INTERFAZ (JSX) */

  return (
    // Wrapper exterior para centrar la "pantalla de móvil" en monitores de escritorio
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      
      {/* Contenedor principal de la App (Simula la pantalla de un móvil con max-w-md) */}
      <div className="w-full max-w-md min-h-screen bg-black shadow-2xl overflow-hidden relative">
        
        {/* ENRUTAMIENTO CONDICIONAL (Conditional Rendering):
          Si playerName es 'null' (usuario nuevo o reseteado), renderiza Onboarding.
          Si playerName tiene texto, renderiza SushiCounter.
        */}
        {!playerName ? (
          <Onboarding onSaveName={handleSaveName} />
        ) : (
          <SushiCounter 
            playerName={playerName} 
            onUpdateName={handleSaveName} 
          /> 
        )}

      </div>
    </div>
  );
}

export default App;