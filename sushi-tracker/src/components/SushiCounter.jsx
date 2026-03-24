import { useState } from 'react';
import niguiriImage1 from '../assets/images/niguiri1.png';
import Header from './Header';
import MainCounter from './MainCounter';
import HistoryDrawer from './HistoryDrawer';
import SettingsView from './SettingsView';

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

    // Estados para los modales de confirmación
    const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false);

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

    /**
     * Ejecuta el borrado total de los datos.
     * Esta función es llamada desde el modal de confirmación de borrado.
     */
    const confirmClearHistory = () => {
        localStorage.removeItem('sushiHistory');
        localStorage.removeItem('sushiCurrentCount');
        setHistory([]);
        setCurrentCount(0);
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
            <Header
                playerName={playerName}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenHistory={() => setIsMenuOpen(true)}
            />

            {/* CONTENIDO PRINCIPAL (MAIN VIEW) */}
            <MainCounter
                currentCount={currentCount}
                onUpdateSushi={updateSushiCount}
                onFinishSession={() => setIsFinishConfirmOpen(true)}
            />

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

            {/* VISTA DE AJUSTES Y BORRADO */}
            {isSettingsOpen && (
                <SettingsView
                    playerName={playerName}
                    onUpdateName={onUpdateName}
                    onShare={handleShare}
                    onClearHistory={confirmClearHistory}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}

            {/* MENÚ LATERAL DESPLEGABLE (HISTORY DRAWER) */}
            <HistoryDrawer
                isOpen={isMenuOpen}
                history={history}
                totalSushi={totalSushi}
                onClose={() => setIsMenuOpen(false)}
            />

        </div>
    );
}