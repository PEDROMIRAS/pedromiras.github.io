import { useState } from 'react';
import Onboarding from './components/Onboarding';
import SushiCounter from './components/SushiCounter';

function App() {
  /* ESTADO DEL JUGADOR: 
    Usamos "Inicialización Perezosa" (pasando una función a useState).
    Esto es crucial para el rendimiento: React solo ejecutará esta función 
    la primera vez que la app cargue, leyendo el localStorage de forma síncrona.
    Si pasáramos un valor por defecto y luego usáramos un useEffect, 
    provocaríamos un doble renderizado innecesario.
  */
  const [playerName, setPlayerName] = useState(() => {
    const savedName = localStorage.getItem('sushiPlayerName');
    return savedName || null;
  });

  /*
    FUNCIÓN DE GUARDADO:
    Esta función se la pasamos como "prop" (propiedad) al componente Onboarding.
    Cuando el usuario envía el formulario allí, esta función se ejecuta aquí,
    guardando el dato en el disco (localStorage) y actualizando la memoria (state).
  */
  const handleSaveName = (name) => {
    localStorage.setItem('sushiPlayerName', name);
    setPlayerName(name);
  };

  return (
    // Contenedor principal: Ocupa toda la pantalla (min-h-screen) y centra el contenido
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      {/* Contenedor tipo móvil: Ancho máximo definido (max-w-md) y oculta el desbordamiento (overflow-hidden) */}
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl overflow-hidden relative">
        
        {/* RENDERIZADO CONDICIONAL: 
          Si playerName es null o vacío (!playerName), mostramos el Onboarding.
          Si tiene datos, mostramos el contador principal y le pasamos el nombre.
        */}
        {!playerName ? (
          <Onboarding onSaveName={handleSaveName} />
        ) : (
          <SushiCounter playerName={playerName} />
        )}

      </div>
    </div>
  );
}

export default App;