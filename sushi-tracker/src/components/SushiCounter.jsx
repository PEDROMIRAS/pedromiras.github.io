import { useState } from 'react';
import niguiriImage from '../assets/images/niguiri.png';

/* FUNCIONES AUXILIARES (Fuera del componente):
    Las declaramos aquí fuera para que React no las vuelva a crear en memoria
    cada vez que el componente se repinta (re-render).
*/
const getTodayDate = () => new Date().toLocaleDateString('es-ES');

const loadInitialHistory = () => {
    const savedHistory = localStorage.getItem('sushiHistory');
  // Si hay datos, los convertimos de texto (JSON) a objeto/array de JavaScript.
    return savedHistory ? JSON.parse(savedHistory) : [];
};

export default function SushiCounter({ playerName }) {
    /*
        ESTADOS PRINCIPALES:
        Ambos usan inicialización lazy para evitar advertencias de rendimiento
        y llamadas a localStorage redundantes tras el primer render.
    */
    const [history, setHistory] = useState(loadInitialHistory);

    const [todayCount, setTodayCount] = useState(() => {
        const today = getTodayDate();
        const currentHistory = loadInitialHistory(); 
        // Buscamos si el día de hoy ya existe en el historial
        const todayRecord = currentHistory.find(record => record.fecha === today);
        // Si existe, devolvemos su cantidad. Si no, empezamos en 0.
        return todayRecord ? todayRecord.cantidad : 0;
    });

  // Estado para controlar la visibilidad del menú lateral (drawer)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    /*
        LÓGICA CORE: SUMAR PIEZAS
    */
    const handleAddSushi = () => {
        const today = getTodayDate();
    
        // REGLA DE REACT: Nunca modificar el estado directamente.
        // Creamos una copia superficial del array (spread operator)
        let currentHistory = [...history]; 
        
        // Buscamos el índice (posición en el array) del registro de hoy
        let todayIndex = currentHistory.findIndex(record => record.fecha === today);

        if (todayIndex >= 0) {
        // Si el índice existe (es 0 o mayor), sumamos a ese día específico
        currentHistory[todayIndex].cantidad += 1;
        } else {
        // Si no existe (-1), empujamos un nuevo objeto al array
        currentHistory.push({ fecha: today, cantidad: 1 });
        }

        // Persistencia: Convertimos el array a String para guardarlo
        localStorage.setItem('sushiHistory', JSON.stringify(currentHistory));
        
        // Sincronizamos la interfaz
        setHistory(currentHistory);
        // Usamos el valor previo (prev) para asegurarnos de que la suma es precisa
        setTodayCount(prev => prev + 1);
    };

    /*
        LÓGICA DE RECUPERACIÓN: REINICIAR CONTADOR DE HOY
    */
const handleResetToday = () => {
    // window.confirm detiene la ejecución y pide confirmación nativa al usuario
    if (window.confirm('¿Seguro que quieres poner el contador de hoy a cero?')) {
        const today = getTodayDate();
        let currentHistory = [...history]; 
        let todayIndex = currentHistory.findIndex(record => record.fecha === today);

        if (todayIndex >= 0) {
            currentHistory[todayIndex].cantidad = 0; // Reseteamos a 0
            
            localStorage.setItem('sushiHistory', JSON.stringify(currentHistory));
            setHistory(currentHistory);
            setTodayCount(0);
        }
    }
};

    /*
        CÁLCULO DERIVADO: TOTAL HISTÓRICO
        Usamos reduce() para iterar todo el array. Empieza con un total de 0,
        y por cada 'record', le suma la 'record.cantidad' a ese total.
    */
const totalSushi = history.reduce((total, record) => total + record.cantidad, 0);

return (
    <div className="flex flex-col h-full min-h-screen bg-black relative overflow-hidden text-white">
      {/* Cabecera con el botón para abrir el menú (cambia isMenuOpen a true) */}
        <header className="flex justify-between items-center p-6 bg-black border-b border-black">
            <h2 className="text-xl font-black text-white">¡A comer, {playerName}!</h2>
            <button 
                onClick={() => setIsMenuOpen(true)}
                className="text-purple-400 hover:bg-gray-800 hover:text-purple-500 p-2 rounded-xl transition-colors cursor-pointer"
                aria-label="Abrir menú de historial"
            >
                {/* Icono vectorial (SVG) ligero y escalable */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </header>

      {/* Zona principal */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-gray-100 font-bold uppercase tracking-widest text-sm mb-4">
            Piezas de hoy
            </h3>
        
            <div className="text-9xl font-black text-purple-600 mb-12 drop-shadow-[0_4px_10px_rgba(168,85,247,0.3)]">
                {todayCount}
            </div>

        {/* Imagen principal que actúa como botón al recibir onClick */}
            <img 
                src={niguiriImage}
                alt="Botón gigante de niguiri sushi"
                onClick={handleAddSushi}
                className="w-[90%] h-auto cursor-pointer select-none transform transition-transform hover:scale-110 active:scale-90"
                style={{ WebkitTapHighlightColor: 'transparent' }}
            />
        
            <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-gray-300 font-medium bg-gray-700 py-2 px-4 rounded-full">
                    ¡Toca el sushi para sumar!
                </p>
                
                {/* RENDERIZADO CONDICIONAL: Solo existe si hay > 0 piezas */}
                {todayCount > 0 && (
                    <button 
                    onClick={handleResetToday}
                    className="text-sm text-red-400 hover:text-red-500 underline underline-offset-4 transition-colors font-medium cursor-pointer"
                    >
                    Empezar de cero hoy
                    </button>
                )}
            </div>
        </main>

        {/* MENÚ DESPLEGABLE (DRAWER)
        Se basa en clases absolutas sobrepuestas mediante el z-index.
        */}

        {/* CAPA DE FONDO (Overlay): Si está abierto, muestra un fondo semitransparente */}
        {isMenuOpen && (
            <div 
                className="absolute inset-0 bg-black/40 z-10 transition-opacity cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
            />
        )}

        {/* PANEL DEL MENÚ: 
            Siempre existe en el DOM, pero usamos translate-x para moverlo fuera 
            de la pantalla cuando isMenuOpen es false, creando la animación de deslizamiento.
        */}
        <div 
            className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-black shadow-2xl z-20 flex flex-col transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
        <div className="p-6 flex justify-between items-center border-b border-black">
            <h3 className="text-xl font-bold text-white">Tu Historial</h3>
            <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:bg-gray-800 hover:text-purple-500 w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all"
            >
                ✕
            </button>
        </div>

        {/* CONTENIDO DEL HISTORIAL */}
        <div className="p-6 overflow-y-auto flex-1">
            {history.length === 0 ? (
            <p className="text-gray-300 text-center mt-10">Aún no hay registros. ¡A comer!</p>
            ) : (
            <ul className="space-y-4">
                {/* slice() crea una copia para no mutar el array original.
                    reverse() le da la vuelta para que el día más reciente salga arriba.
                    map() itera sobre cada elemento para transformarlo en código HTML.
                */}
                {history.slice().reverse().map((record, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-900 p-4 rounded-2xl">
                    <span className="font-semibold text-gray-100">{record.fecha}</span>
                    <span className="font-black text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                        {record.cantidad}
                    </span>
                    </li>
                ))}
                </ul>
            )}
            </div>

            {/* PIE DEL MENÚ */}
            <div className="p-6 border-t border-black bg-gray-800">
            <div className="flex justify-between items-center">
                <span className="text-gray-300 font-bold uppercase text-xs tracking-wider">Total Histórico</span>
                {/* Mostramos la variable totalSushi calculada previamente */}
                <span className="text-2xl font-black text-purple-500">{totalSushi}</span>
            </div>
            </div>
        </div>

        </div>
    );
}