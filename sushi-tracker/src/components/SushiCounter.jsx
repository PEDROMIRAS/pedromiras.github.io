// src/components/SushiCounter.jsx
import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import MainCounter from './MainCounter';
import HistoryDrawer from './HistoryDrawer';
import SettingsView from './SettingsView';
import { supabase, vieneDeRecuperar } from '../supabase';
import { aFila, aRegistro } from '../historialNube';

const leerLocales = () => JSON.parse(localStorage.getItem('sushiHistory')) || [];

/**
 * Componente principal que gestiona el estado global de la aplicación.
 * Actúa como controlador de vistas utilizando un enrutamiento condicional.
 */
export default function SushiCounter() {
    /* -------------------------------------------------------------------------- */
    /* ESTADOS DE DATOS                               */
    /* -------------------------------------------------------------------------- */

    const [currentCount, setCurrentCount] = useState(() => parseInt(localStorage.getItem('sushiCurrentCount')) || 0);
    // Historial: lo guardado en el dispositivo y, con cuenta, lo guardado en la nube.
    // Con sesión iniciada lo local es solo lo que aún no se ha podido subir (p. ej. sin conexión).
    const [locales, setLocales] = useState(leerLocales);
    const [nube, setNube] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const history = [...locales, ...nube];
    const [playerName, setPlayerName] = useState(() => localStorage.getItem('sushiPlayerName') || 'Pedro');

    const [isSessionActive, setIsSessionActive] = useState(() => currentCount > 0);

    const [isMultiplayer, setIsMultiplayer] = useState(() => JSON.parse(localStorage.getItem('sushiIsMultiplayer')) || false);
    const [player2Name, setPlayer2Name] = useState(() => localStorage.getItem('sushiPlayer2Name') || 'Rival');
    const [player2Count, setPlayer2Count] = useState(() => parseInt(localStorage.getItem('sushiPlayer2Count')) || 0);

    /* -------------------------------------------------------------------------- */
    /* ESTADOS DE VISTA                              */
    /* -------------------------------------------------------------------------- */

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Desde el correo de "he olvidado la contraseña" se abre Ajustes, que es donde se pone la nueva
    const [recuperando, setRecuperando] = useState(vieneDeRecuperar);
    const [isSettingsOpen, setIsSettingsOpen] = useState(vieneDeRecuperar);

    /* -------------------------------------------------------------------------- */
    /* EFECTOS                                      */
    /* -------------------------------------------------------------------------- */

    /**
     * Efecto de persistencia automática.
     * Guarda el progreso actual en LocalStorage cada vez que cambian los contadores o la configuración.
     */
    useEffect(() => {
        localStorage.setItem('sushiCurrentCount', currentCount);
        localStorage.setItem('sushiPlayer2Count', player2Count);
        localStorage.setItem('sushiIsMultiplayer', JSON.stringify(isMultiplayer));
        // Un nombre vacío no se guarda: al recargar, App volvería a mostrar la bienvenida
        if (playerName.trim()) localStorage.setItem('sushiPlayerName', playerName);
    }, [currentCount, player2Count, isMultiplayer, playerName]);

    const guardarLocales = (lista) => {
        setLocales(lista);
        localStorage.setItem('sushiHistory', JSON.stringify(lista));
    };

    // Sesión de la cuenta: también avisa al cargar la página si ya había una iniciada
    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => setUsuario(sesion?.user ?? null));
        return () => data.subscription.unsubscribe();
    }, []);

    /**
     * Sube a la cuenta lo que haya pendiente en el dispositivo y recarga el historial de la nube.
     * Las llamadas van en cola: dos a la vez subirían dos veces los mismos registros.
     * Si algo falla (sin conexión), lo pendiente se queda en el dispositivo para el siguiente intento.
     */
    const cola = useRef(Promise.resolve());
    const sincronizar = () => {
        cola.current = cola.current.then(async () => {
            const pendientes = leerLocales();
            if (pendientes.length > 0) {
                const { error } = await supabase.from('sessions').insert(pendientes.map(aFila));
                if (error) return;
                guardarLocales([]);
            }
            const { data, error } = await supabase.from('sessions').select('*').order('played_at', { ascending: false });
            if (!error) setNube(data.map(aRegistro));
        });
    };

    const idUsuario = usuario?.id;
    useEffect(() => {
        if (!idUsuario) return setNube([]);
        sincronizar();
        // Lo que se guardó sin conexión se sube al recuperarla
        window.addEventListener('online', sincronizar);
        return () => window.removeEventListener('online', sincronizar);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idUsuario]);

    /* -------------------------------------------------------------------------- */
    /* CONTROLADORES                                  */
    /* -------------------------------------------------------------------------- */

    /**
     * Actualiza el contador del jugador principal y activa el feedback háptico.
     * @param {number} amount - Cantidad a sumar o restar.
     */
    const handleUpdateSushi = (amount) => {
        setCurrentCount(prev => Math.max(0, prev + amount));
        if (navigator.vibrate) navigator.vibrate(50);
    };

    /**
     * Actualiza el contador del jugador secundario y activa el feedback háptico.
     * @param {number} amount - Cantidad a sumar o restar.
     */
    const handleUpdateSushi2 = (amount) => {
        setPlayer2Count(prev => Math.max(0, prev + amount));
        if (navigator.vibrate) navigator.vibrate(50);
    };

    /**
     * Inicializa una nueva sesión de conteo.
     * @param {boolean} multiplayer - Determina si la sesión incluye a un segundo jugador.
     */
    const startSession = (multiplayer) => {
        setIsMultiplayer(multiplayer);
        setIsSessionActive(true);
        setCurrentCount(0);
        setPlayer2Count(0);
        if (multiplayer) {
            localStorage.setItem('sushiPlayer2Name', player2Name);
        }
    };

    /**
     * Finaliza la sesión actual y guarda los datos en el historial si procede.
     */
    const handleFinishSession = () => {
        if (currentCount === 0 && (!isMultiplayer || player2Count === 0)) {
            setIsSessionActive(false);
            return;
        }

        const newRecord = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cantidad: currentCount,
            isMultiplayer,
            player2Count,
            player1Name: playerName,
            player2Name
        };

        guardarLocales([newRecord, ...locales]);
        if (usuario) sincronizar();

        setCurrentCount(0);
        setPlayer2Count(0);
        setIsSessionActive(false);
    };

    /**
     * Borra permanentemente el historial y reinicia el estado de la aplicación.
     */
    const confirmClearHistory = () => {
        // Solo nuestra clave: el dominio se comparte con las otras apps del portfolio
        localStorage.removeItem('sushiHistory');
        setLocales([]);
        if (usuario) {
            supabase.from('sessions').delete().eq('user_id', usuario.id).then(({ error }) => {
                if (!error) setNube([]);
            });
        }
        setCurrentCount(0);
        setPlayer2Count(0);
        setIsSessionActive(false);
    };

    /**
     * Elimina un registro específico del historial mediante su ID.
     * @param {number|string} idToRemove - Identificador único del registro.
     */
    const deleteHistoryRecord = async (idToRemove) => {
        if (locales.some(record => record.id === idToRemove)) {
            guardarLocales(locales.filter(record => record.id !== idToRemove));
            return;
        }
        // En la nube: solo desaparece de la lista si de verdad se ha borrado
        const { error } = await supabase.from('sessions').delete().eq('id', idToRemove);
        if (!error) setNube(actuales => actuales.filter(record => record.id !== idToRemove));
    };

    const totalSushi = history.reduce((acc, record) => acc + record.cantidad + (record.isMultiplayer ? record.player2Count : 0), 0);

    /* -------------------------------------------------------------------------- */
    /* RENDERIZADO                                  */
    /* -------------------------------------------------------------------------- */

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden font-sans">
            <AnimatePresence mode="wait">
                {
                    /* VISTA 1: HISTORIAL */
                    isMenuOpen ? (
                        <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col w-full h-full overflow-hidden">
                            <HistoryDrawer
                                history={history}
                                totalSushi={totalSushi}
                                onClose={() => setIsMenuOpen(false)}
                                onDeleteRecord={deleteHistoryRecord}
                            />
                        </motion.div>
                    ) :

                        /* VISTA 2: AJUSTES */
                        isSettingsOpen ? (
                            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col w-full h-full overflow-hidden">
                                <SettingsView
                                    playerName={playerName}
                                    usuario={usuario}
                                    pendientes={locales.length}
                                    recuperando={recuperando}
                                    onRecuperada={() => setRecuperando(false)}
                                    onUpdateName={setPlayerName}
                                    onClearHistory={confirmClearHistory}
                                    onClose={() => setIsSettingsOpen(false)}
                                />
                            </motion.div>
                        ) :

                            /* VISTA 3: PANTALLA PRINCIPAL */
                            (
                                <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col w-full h-full overflow-hidden">

                                    {/* Ocultamos el Header si estamos dentro de una sesión activa (1 o 2 jugadores) */}
                                    {!isSessionActive && (
                                        <Header
                                            playerName={playerName}
                                            onOpenSettings={() => setIsSettingsOpen(true)}
                                            onOpenHistory={() => setIsMenuOpen(true)}
                                        />
                                    )}

                                    <main className="flex-1 flex flex-col relative overflow-hidden">
                                        {!isSessionActive ? (
                                            /* SUBVISTA 3.1: CONFIGURACIÓN INICIAL */
                                            <div className="h-full flex flex-col items-center justify-center p-6">
                                                <h2 className="text-3xl font-black text-white mb-8">¿Nueva Comilona?</h2>

                                                <div className="w-full max-w-sm space-y-4">
                                                    <div>
                                                        <label htmlFor="jugador" className="text-xs font-bold text-gray-500 uppercase mb-2 block">Jugador Principal</label>
                                                        <input
                                                            id="jugador"
                                                            value={playerName}
                                                            onChange={e => setPlayerName(e.target.value)}
                                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                                        />
                                                    </div>

                                                    <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-gray-300">MODO DUELO</span>
                                                            <button
                                                                role="switch"
                                                                aria-checked={isMultiplayer}
                                                                aria-label="Modo duelo"
                                                                onClick={() => setIsMultiplayer(!isMultiplayer)}
                                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${isMultiplayer ? 'bg-blue-600' : 'bg-gray-700'}`}
                                                            >
                                                                <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${isMultiplayer ? 'translate-x-6' : ''}`} />
                                                            </button>
                                                        </div>

                                                        {isMultiplayer && (
                                                            <div className="mt-4 pt-4 border-t border-gray-800">
                                                                <label htmlFor="rival" className="text-xs font-bold text-blue-500 uppercase mb-2 block">Rival</label>
                                                                <input
                                                                    id="rival"
                                                                    value={player2Name}
                                                                    onChange={e => setPlayer2Name(e.target.value)}
                                                                    className="w-full bg-gray-900 border border-blue-900/30 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => startSession(isMultiplayer)}
                                                        className="w-full bg-purple-600 text-white font-black py-4 rounded-xl uppercase tracking-widest active:scale-95 transition-transform"
                                                    >
                                                        ¡A Comer!
                                                    </button>

                                                    <a href="../#projects" className="block text-center text-sm text-gray-500 hover:text-white pt-2">
                                                        ← Portfolio
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            /* SUBVISTA 3.2: CONTADOR ACTIVO */
                                            <div className="relative flex-1 flex flex-col h-full overflow-hidden">
                                                {/* Sin cabecera durante la sesión: el enlace va en la esquina libre (la cuenta queda guardada) */}
                                                <a href="../#projects" className="absolute top-3 left-4 z-10 text-xs text-gray-500 hover:text-white">
                                                    ← Portfolio
                                                </a>
                                                <MainCounter
                                                    currentCount={currentCount}
                                                    onUpdateSushi={handleUpdateSushi}
                                                    onFinishSession={handleFinishSession}
                                                    player2Count={player2Count}
                                                    onUpdateSushi2={handleUpdateSushi2}
                                                    player1Name={playerName}
                                                    player2Name={player2Name}
                                                    isMultiplayer={isMultiplayer}
                                                />
                                            </div>
                                        )}
                                    </main>
                                </motion.div>
                            )
                }
            </AnimatePresence>
        </div>
    );
}