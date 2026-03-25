// src/components/SushiCounter.jsx
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import MainCounter from './MainCounter';
import HistoryDrawer from './HistoryDrawer';
import SettingsView from './SettingsView';

/**
 * Componente principal que gestiona el estado global de la aplicación.
 * Actúa como controlador de vistas utilizando un enrutamiento condicional.
 */
export default function SushiCounter() {
    /* -------------------------------------------------------------------------- */
    /* ESTADOS DE DATOS                               */
    /* -------------------------------------------------------------------------- */

    const [currentCount, setCurrentCount] = useState(() => parseInt(localStorage.getItem('sushiCurrentCount')) || 0);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sushiHistory')) || []);
    const [playerName, setPlayerName] = useState(() => localStorage.getItem('sushiPlayerName') || 'Pedro');

    const [isSessionActive, setIsSessionActive] = useState(() => currentCount > 0);

    const [isMultiplayer, setIsMultiplayer] = useState(() => JSON.parse(localStorage.getItem('sushiIsMultiplayer')) || false);
    const [player2Name, setPlayer2Name] = useState(() => localStorage.getItem('sushiPlayer2Name') || 'Rival');
    const [player2Count, setPlayer2Count] = useState(() => parseInt(localStorage.getItem('sushiPlayer2Count')) || 0);

    /* -------------------------------------------------------------------------- */
    /* ESTADOS DE VISTA                              */
    /* -------------------------------------------------------------------------- */

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    }, [currentCount, player2Count, isMultiplayer]);

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

        localStorage.setItem('sushiPlayerName', playerName);
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

        const updatedHistory = [newRecord, ...history];

        setHistory(updatedHistory);
        localStorage.setItem('sushiHistory', JSON.stringify(updatedHistory));

        setCurrentCount(0);
        setPlayer2Count(0);
        setIsSessionActive(false);
    };

    /**
     * Borra permanentemente el historial y reinicia el estado de la aplicación.
     */
    const confirmClearHistory = () => {
        localStorage.clear();
        setHistory([]);
        setCurrentCount(0);
        setPlayer2Count(0);
        setIsSessionActive(false);
    };

    /**
     * Elimina un registro específico del historial mediante su ID.
     * @param {number} idToRemove - Identificador único del registro.
     */
    const deleteHistoryRecord = (idToRemove) => {
        const updatedHistory = history.filter(record => record.id !== idToRemove);
        setHistory(updatedHistory);
        localStorage.setItem('sushiHistory', JSON.stringify(updatedHistory));
    };

    const totalSushi = history.reduce((acc, record) => acc + record.cantidad + (record.isMultiplayer ? record.player2Count : 0), 0);

    /* -------------------------------------------------------------------------- */
    /* RENDERIZADO                                  */
    /* -------------------------------------------------------------------------- */

    return (
        /* Se utiliza h-[100dvh] para forzar la altura máxima visible en el navegador móvil */
        <div className="flex flex-col h-[100dvh] w-full bg-black overflow-hidden font-sans">
            <AnimatePresence mode="wait">
                {
                    /* VISTA 1: HISTORIAL */
                    isMenuOpen ? (
                        /* Se utiliza flex-1 para que el contenedor animado ceda todo el espacio a su hijo */
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
                                    onUpdateName={setPlayerName}
                                    onShare={() => { }}
                                    onClearHistory={confirmClearHistory}
                                    onClose={() => setIsSettingsOpen(false)}
                                />
                            </motion.div>
                        ) :

                            /* VISTA 3: PANTALLA PRINCIPAL */
                            (
                                <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col w-full h-full overflow-hidden">

                                    <Header
                                        playerName={playerName}
                                        onOpenSettings={() => setIsSettingsOpen(true)}
                                        onOpenHistory={() => setIsMenuOpen(true)}
                                    />

                                    <main className="flex-1 flex flex-col relative overflow-hidden">
                                        {!isSessionActive ? (
                                            /* SUBVISTA 3.1: CONFIGURACIÓN INICIAL */
                                            <div className="h-full flex flex-col items-center justify-center p-6">
                                                <h2 className="text-3xl font-black text-white mb-8">¿Nueva Comilona?</h2>

                                                <div className="w-full max-w-sm space-y-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Jugador 1</label>
                                                        <input
                                                            value={playerName}
                                                            onChange={e => setPlayerName(e.target.value)}
                                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                                                        />
                                                    </div>

                                                    <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-gray-300">MODO DUELO</span>
                                                            <button
                                                                onClick={() => setIsMultiplayer(!isMultiplayer)}
                                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${isMultiplayer ? 'bg-blue-600' : 'bg-gray-700'}`}
                                                            >
                                                                <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${isMultiplayer ? 'translate-x-6' : ''}`} />
                                                            </button>
                                                        </div>

                                                        {isMultiplayer && (
                                                            <div className="mt-4 pt-4 border-t border-gray-800">
                                                                <label className="text-xs font-bold text-blue-500 uppercase mb-2 block">Rival</label>
                                                                <input
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
                                                </div>
                                            </div>
                                        ) : (
                                            /* SUBVISTA 3.2: CONTADOR ACTIVO */
                                            <div className="flex-1 flex flex-col h-full overflow-hidden">
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