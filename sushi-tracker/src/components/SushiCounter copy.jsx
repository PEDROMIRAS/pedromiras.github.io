import { useState } from 'react';
import niguiriImage from '../assets/images/niguiri.png';
import niguiriImage1 from '../assets/images/niguiri1.png';

/* FUNCIONES AUXILIARES (HELPER FUNCTIONS) */

/**
 * Carga el historial de sesiones desde LocalStorage.
 * Se utiliza para la inicialización perezosa (lazy initialization) del estado 'history'.
 * @returns {Array} Array de objetos con las sesiones previas, o un array vacío si no hay datos.
 */
const loadInitialHistory = () => {
    const savedHistory = localStorage.getItem('sushiHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
};

/**
 * Carga el contador de la sesión actual desde LocalStorage.
 * Previene la pérdida de datos si el usuario recarga la página a mitad de una comida.
 * @returns {number} La cantidad de piezas de la sesión actual, o 0 por defecto.
 */
const loadCurrentSession = () => {
    const savedCount = localStorage.getItem('sushiCurrentCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
};

/* COMPONENTE PRINCIPAL */

/**
 * Componente SushiCounter
 * Gestiona la sesión actual de comida, el historial de sesiones pasadas y la configuración del usuario.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.playerName - Nombre del usuario actual.
 * @param {function} props.onUpdateName - Función callback para actualizar el nombre en el componente padre.
 */
export default function SushiCounter({ playerName, onUpdateName }) {

    /* Estados de Datos (Data States) */
    const [history, setHistory] = useState(loadInitialHistory);
    const [currentCount, setCurrentCount] = useState(loadCurrentSession);

    /* Estados de Interfaz (UI States) */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [newNameInput, setNewNameInput] = useState(playerName);

    // Estados para los modales de confirmación
    const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false);
    const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

    /* LÓGICA CORE: CONTROL DE SESIÓN */

    /**
     * Actualiza el contador de la sesión actual sumando o restando una cantidad.
     * @param {number} amount - Cantidad a sumar (positiva) o restar (negativa).
     */
    const updateSushiCount = (amount) => {
        const newCount = currentCount + amount;
        if (newCount < 0) return;

        setCurrentCount(newCount);
        localStorage.setItem('sushiCurrentCount', newCount.toString());

        //Añadimos vibracion para subir y bajar la cantidad del piezas del contador
        if (navigator.vibrate) {
            if (amount > 0) {
                // Si está sumando sushi: Vibración cortita y alegre (50ms)
                navigator.vibrate(50);
            } else {
                // Si está restando: Vibración un poco más pesada (100ms)
                navigator.vibrate(100);
            }
        }
    };

    /**
     * Ejecuta la lógica final para guardar la sesión. 
     * Esta función es llamada desde el modal de confirmación.
     */
    const confirmFinishSession = () => {
        const now = new Date();

        const newRecord = {
            id: Date.now(),
            date: now.toLocaleDateString('es-ES'),
            time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            cantidad: currentCount
        };

        const newHistory = [newRecord, ...history];

        setHistory(newHistory);
        localStorage.setItem('sushiHistory', JSON.stringify(newHistory));

        setCurrentCount(0);
        localStorage.setItem('sushiCurrentCount', '0');

        // Cerramos el modal tras guardar
        setIsFinishConfirmOpen(false);
    };

    /* LÓGICA SECUNDARIA: AJUSTES Y ACCIONES GLOBALES */

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (newNameInput.trim()) {
            onUpdateName(newNameInput.trim());
            setIsSettingsOpen(false);
        }
    };

    /**
     * Ejecuta el borrado total de los datos.
     * Esta función es llamada desde el modal de confirmación de borrado.
     */
    const confirmClearHistory = () => {
        localStorage.removeItem('sushiHistory');
        localStorage.removeItem('sushiCurrentCount');
        setHistory([]);
        setCurrentCount(0);

        // Cerramos todos los modales y menús
        setIsClearConfirmOpen(false);
        setIsSettingsOpen(false);
        setIsMenuOpen(false);
    };

    /**
   * Invoca la Web Share API nativa del sistema operativo para compartir estadísticas personalizadas.
   */
    const handleShare = async () => {
        const shareData = {
            title: 'Mi récord en Sushi Tracker',
            text: `¡Me acabo de zampar ${currentCount} piezas de sushi! 🍣 ¿Puedes superarlo?`,
            // OJO: Pon aquí la URL real de tu GitHub Pages
            url: 'https://pedromiras.github.io/sushi-tracker/dist/index.html'
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                alert('¡Récord copiado al portapapeles para que lo pegues donde quieras!');
            }
        } catch (err) {
            console.log('Error al compartir:', err);
        }
    };

    /* Cálculos Derivados (Derived State) --- */
    const totalSushi = history.reduce((total, record) => total + record.cantidad, 0);

    /* RENDERIZADO DE INTERFAZ (JSX) */

    return (
        <div className="flex flex-col h-full min-h-screen bg-black relative overflow-hidden text-white">

            {/* BARRA DE NAVEGACIÓN (HEADER) */}
            <header className="flex justify-between items-center p-6 bg-black border-b border-black">
                <button onClick={() => setIsSettingsOpen(true)} className="text-gray-400 hover:bg-gray-800 hover:text-white p-2 rounded-xl transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.528.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>
                <h2 className="text-xl font-black text-white">{playerName}</h2>
                <button onClick={() => setIsMenuOpen(true)} className="text-purple-400 hover:bg-gray-800 hover:text-purple-500 p-2 rounded-xl transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </header>

            {/* CONTENIDO PRINCIPAL (MAIN VIEW) */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-gray-100 font-bold uppercase tracking-widest text-sm mb-4">
                    Sesión Actual
                </h3>
                <div className="text-9xl font-black text-purple-600 mb-8 drop-shadow-[0_4px_10px_rgba(168,85,247,0.3)]">
                    {currentCount}
                </div>

                <img
                    src={niguiriImage}
                    alt="Añadir una pieza de sushi"
                    onClick={() => updateSushiCount(1)}
                    className="w-[90%] h-auto cursor-pointer select-none transform transition-transform hover:scale-110 active:scale-90"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                />

                <div className="mt-12 flex items-center bg-gray-900 rounded-full border border-gray-800 p-1 shadow-inner">
                    <button
                        onClick={() => updateSushiCount(-1)}
                        disabled={currentCount === 0}
                        className="w-14 h-14 flex items-center justify-center text-3xl font-black text-gray-400 hover:text-white hover:bg-gray-800 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95 cursor-pointer"
                    >
                        -
                    </button>
                    <span className="px-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Piezas</span>
                    <button
                        onClick={() => updateSushiCount(1)}
                        className="w-14 h-14 flex items-center justify-center text-3xl font-black text-purple-500 hover:text-purple-400 hover:bg-gray-800 rounded-full transition-all active:scale-95 cursor-pointer"
                    >
                        +
                    </button>
                </div>

                {currentCount > 0 && (
                    <button
                        // Abre el modal de confirmación en lugar de ejecutar la acción directa
                        onClick={() => setIsFinishConfirmOpen(true)}
                        className="mt-8 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-900/40 transition-all active:scale-95 uppercase tracking-wide text-sm cursor-pointer"
                    >
                        Terminar comilona
                    </button>
                )}
            </main>

            {/* SISTEMA DE MODALES (OVERLAYS) */}

            {/* MODAL: CONFIRMAR FIN DE SESIÓN (z-40) */}
            {isFinishConfirmOpen && (
                <div className="absolute inset-0 z-40 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" onClick={() => setIsFinishConfirmOpen(false)} />
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl z-10 w-full max-w-sm flex flex-col gap-6 text-center transform transition-all">

                        <div className="mx-auto mb-2">
                            <img
                                src={niguiriImage1}
                                alt="Niguiri delicioso"
                                className="w-24 h-auto object-contain drop-shadow-[0_4px_10px_rgba(168,85,247,0.4)] transform hover:scale-110 transition-transform duration-300"
                            />
                        </div>

                        <h3 className="text-2xl font-black text-white">¡Buen provecho!</h3>
                        <p className="text-gray-400 font-medium">¿Has terminado? Guardaremos estas {currentCount} piezas en tu historial.</p>
                        <div className="flex gap-3 mt-2">
                            <button onClick={() => setIsFinishConfirmOpen(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors cursor-pointer">Cancelar</button>
                            <button onClick={confirmFinishSession} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/40 transition-colors cursor-pointer">Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: AJUSTES (z-30) - Pantalla completa en móviles */}
            {isSettingsOpen && (
                /* 
                    Sustituimos 'flex items-center justify-center p-6' por 'bg-gray-900 flex-col'.
                    En móviles, ahora es una columna opaca y sin paddings exteriores que ocupa todo el espacio.
                    Usamos 'fixed' para asegurarnos de que cubra toda la pantalla incluso con scroll.
                */
                <div className="fixed inset-0 z-30 bg-gray-900 flex flex-col p-6 transform transition-all duration-300 ease-in-out">

                    {/* Cabecera del modal a pantalla completa */}
                    <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-800">
                        <h3 className="text-3xl font-black text-white">Ajustes</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white font-bold p-3 rounded-full hover:bg-gray-800 transition-colors cursor-pointer text-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Contenedor central para el contenido de ajustes */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Formulario para actualización de nombre */}
                        <form onSubmit={handleNameSubmit} className="flex flex-col gap-3">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cambiar nombre</label>

                            {/* Estructura de columna para máxima compatibilidad móvil */}
                            <div className="flex flex-col gap-3">
                                <input
                                    value={newNameInput}
                                    onChange={e => setNewNameInput(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 text-lg"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold transition-colors cursor-pointer text-lg shadow-lg shadow-purple-900/40"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>

                        {/* Botón de Compartir Premium a ancho completo */}
                        <button
                            onClick={handleShare}
                            className="w-full flex items-center justify-center gap-3 bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 font-bold py-4 rounded-xl transition-colors border border-blue-900/50 cursor-pointer text-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                            Compartir estadísticas
                        </button>
                    </div>

                    {/* Pie del modal con la Zona de Peligro a ancho completo */}
                    <div className="border-t border-gray-800 pt-8 mt-auto">
                        <button
                            onClick={() => setIsClearConfirmOpen(true)}
                            className="w-full flex items-center justify-center gap-3 bg-red-900/30 text-red-400 hover:bg-red-900/50 font-bold py-4 rounded-xl transition-colors border border-red-900/50 cursor-pointer text-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                            Borrar historial completo
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: CONFIRMAR BORRADO (z-50) - ¡NUEVO! Mantener centrado, pero blindar contra desbordamiento */}
            {isClearConfirmOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" onClick={() => setIsClearConfirmOpen(false)} />
                    {/* Cambiado 'w-full' por 'w-[96%]' para asegurar margen lateral en móvil */}
                    <div className="bg-gray-900 border border-red-900/50 p-8 rounded-3xl shadow-2xl z-10 w-[96%] max-w-sm flex flex-col gap-6 text-center transform transition-all">
                        <div className="mx-auto bg-red-900/20 text-red-500 p-4 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-white">¡Atención!</h3>
                        <p className="text-gray-400 font-medium">Estás a punto de borrar todo tu historial y tu sesión actual. Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3 mt-2">
                            <button onClick={() => setIsClearConfirmOpen(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors cursor-pointer">Cancelar</button>
                            <button onClick={confirmClearHistory} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/40 transition-colors cursor-pointer">Sí, borrar todo</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MENÚ LATERAL DESPLEGABLE (HISTORY DRAWER) */}
            {isMenuOpen && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 transition-opacity cursor-pointer" onClick={() => setIsMenuOpen(false)} />}

            <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-black shadow-2xl z-20 flex flex-col transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex justify-between items-center border-b border-black">
                    <h3 className="text-xl font-bold text-white">Tu Historial</h3>
                    <button onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-gray-800 hover:text-purple-500 w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all cursor-pointer">✕</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Aún no hay registros. ¡A comer!</p>
                    ) : (
                        <ul className="space-y-4">
                            {history.map((record) => (
                                <li key={record.id} className="flex justify-between items-center bg-gray-900 p-4 rounded-2xl border border-gray-800">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-100">{record.date}</span>
                                        <span className="text-xs text-gray-500 font-medium">{record.time}</span>
                                    </div>
                                    <span className="font-black text-purple-500 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-900/30">
                                        {record.cantidad}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-6 border-t border-black bg-gray-900">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Total Histórico</span>
                        <span className="text-2xl font-black text-purple-500">{totalSushi}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}