// src/components/SushiCounter.jsx
import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import MainCounter from './MainCounter';
import HistoryDrawer from './HistoryDrawer';
import SettingsView from './SettingsView';
import { cargarSupabase, haySesion, vieneDeRecuperar } from '../supabase';
import { aFila, aRegistro, cuenta, nombre } from '../historialNube';
import { useSala, nuevaSala } from '../useSala';

const Interruptor = ({ activo, alCambiar, etiqueta }) => (
    <button
        role="switch"
        aria-checked={activo}
        aria-label={etiqueta}
        onClick={() => alCambiar(!activo)}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${activo ? 'bg-blue-600' : 'bg-gray-700'}`}
    >
        <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${activo ? 'translate-x-6' : ''}`} />
    </button>
);

// Un dato guardado que no se puede leer cuenta como si no hubiera nada: la app tiene que arrancar igual
const leerGuardado = (clave, porDefecto) => {
    try {
        return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
    } catch {
        return porDefecto;
    }
};
const leerLocales = () => {
    const lista = leerGuardado('sushiHistory', []);
    return Array.isArray(lista) ? lista : [];
};

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
    // Sin sesión guardada no se conecta con la cuenta hasta que se abren los Ajustes, que es donde se entra
    const [conCuenta, setConCuenta] = useState(haySesion);
    const history = [...locales, ...nube];
    const [playerName, setPlayerName] = useState(() => localStorage.getItem('sushiPlayerName') || 'Pedro');

    // Duelo en dos móviles: código de la sala en la que se está, o null
    const [sala, setSala] = useState(() => localStorage.getItem('sushiSala'));
    const [dosMoviles, setDosMoviles] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [miId] = useState(() => crypto.randomUUID());
    const [rivalId, setRivalId] = useState(null);

    const [isSessionActive, setIsSessionActive] = useState(() => currentCount > 0 || Boolean(sala));

    const [isMultiplayer, setIsMultiplayer] = useState(() => leerGuardado('sushiIsMultiplayer', false) === true);
    const [nombreRival, setPlayer2Name] = useState(() => localStorage.getItem('sushiPlayer2Name') || 'Rival');
    const [piezasRival, setPlayer2Count] = useState(() => parseInt(localStorage.getItem('sushiPlayer2Count')) || 0);

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
        localStorage.setItem('sushiPlayer2Count', piezasRival);
        localStorage.setItem('sushiIsMultiplayer', JSON.stringify(isMultiplayer));
        // Un nombre vacío no se guarda: al recargar, App volvería a mostrar la bienvenida
        if (playerName.trim()) localStorage.setItem('sushiPlayerName', playerName);
        if (sala) localStorage.setItem('sushiSala', sala);
        else localStorage.removeItem('sushiSala');
    }, [currentCount, piezasRival, isMultiplayer, playerName, sala]);

    const guardarLocales = (lista) => {
        setLocales(lista);
        localStorage.setItem('sushiHistory', JSON.stringify(lista));
    };

    // Sesión de la cuenta: también avisa al cargar la página si ya había una iniciada
    useEffect(() => {
        if (!conCuenta) return;
        let suscripcion, cancelado = false;
        cargarSupabase().then((supabase) => {
            if (cancelado) return;
            suscripcion = supabase.auth.onAuthStateChange((_evento, sesion) => setUsuario(sesion?.user ?? null)).data.subscription;
        });
        return () => {
            cancelado = true;
            suscripcion?.unsubscribe();
        };
    }, [conCuenta]);

    /**
     * Sube a la cuenta lo que haya pendiente en el dispositivo y recarga el historial de la nube.
     * Las llamadas van en cola: dos a la vez subirían dos veces los mismos registros.
     * Si algo falla (sin conexión), lo pendiente se queda en el dispositivo para el siguiente intento.
     */
    const cola = useRef(Promise.resolve());
    const sincronizar = () => {
        cola.current = cola.current.then(async () => {
            const supabase = await cargarSupabase();
            const pendientes = leerLocales();
            if (pendientes.length > 0) {
                const { error } = await supabase.from('sessions').insert(pendientes.map(aFila));
                if (error) return;
                // Solo lo subido: mientras tanto se puede haber terminado otra sesión, que sigue pendiente
                const subidos = new Set(pendientes.map((registro) => registro.id));
                guardarLocales(leerLocales().filter((registro) => !subidos.has(registro.id)));
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
        setRivalId(null);
        if (multiplayer && dosMoviles) setSala(codigo || nuevaSala());
        else if (multiplayer) {
            localStorage.setItem('sushiPlayer2Name', nombreRival);
        }
    };

    /**
     * Finaliza la sesión actual y guarda los datos en el historial si procede.
     * @param {Object} [rival] - Último mensaje del rival, si es él quien ha terminado el duelo en línea.
     */
    const handleFinishSession = (rival) => {
        if (sala && !rival) avisarSala({ fin: true });
        setSala(null);
        const player2Count = rival ? rival.cuenta : piezasRival;
        const player2Name = rival ? rival.nombre : nombreRival;
        if (currentCount === 0 && (!isMultiplayer || player2Count === 0)) {
            setIsSessionActive(false);
            return;
        }

        const newRecord = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cantidad: currentCount,
            // Una sala en la que no entró nadie se guarda como comilona en solitario
            isMultiplayer: isMultiplayer && (!sala || Boolean(rival || rivalId)),
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

    const avisarSala = useSala(sala, { id: miId, nombre: playerName, cuenta: currentCount }, (mensaje) => {
        // Sala de dos: manda el primero que llega, un tercero no cuenta
        if (rivalId && rivalId !== mensaje.id) return;
        const rival = { nombre: nombre(mensaje.nombre, 'Rival'), cuenta: cuenta(mensaje.cuenta) };
        setRivalId(mensaje.id);
        setPlayer2Name(rival.nombre);
        setPlayer2Count(rival.cuenta);
        if (mensaje.fin) handleFinishSession(rival);
    });

    /**
     * Borra permanentemente el historial y reinicia el estado de la aplicación.
     * @returns {Promise<boolean>} false si el historial de la cuenta no se ha podido borrar.
     */
    const confirmClearHistory = async () => {
        // Solo nuestra clave: el dominio se comparte con las otras apps del portfolio
        localStorage.removeItem('sushiHistory');
        setLocales([]);
        setCurrentCount(0);
        setPlayer2Count(0);
        setIsSessionActive(false);
        if (!usuario) return true;
        const { error } = await (await cargarSupabase()).from('sessions').delete().eq('user_id', usuario.id);
        if (!error) setNube([]);
        return !error;
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
        const { error } = await (await cargarSupabase()).from('sessions').delete().eq('id', idToRemove);
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
                                            onOpenSettings={() => { setIsSettingsOpen(true); setConCuenta(true); }}
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
                                                            <Interruptor activo={isMultiplayer} alCambiar={setIsMultiplayer} etiqueta="Modo duelo" />
                                                        </div>

                                                        {isMultiplayer && (
                                                            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                                                                <span className="text-sm font-bold text-gray-300">EN DOS MÓVILES</span>
                                                                <Interruptor activo={dosMoviles} alCambiar={setDosMoviles} etiqueta="En dos móviles" />
                                                            </div>
                                                        )}

                                                        {isMultiplayer && dosMoviles && (
                                                            <div className="mt-4">
                                                                <label htmlFor="sala" className="text-xs font-bold text-blue-500 uppercase mb-2 block">Código de sala</label>
                                                                <input
                                                                    id="sala"
                                                                    value={codigo}
                                                                    onChange={e => setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                                                                    placeholder="Vacío = sala nueva"
                                                                    autoComplete="off"
                                                                    autoCapitalize="characters"
                                                                    className="w-full bg-gray-900 border border-blue-900/30 rounded-xl p-3 text-white tracking-widest focus:border-blue-500 outline-none"
                                                                />
                                                                <p className="text-xs text-gray-500 mt-2">Uno crea la sala y le dice el código al otro. Cada uno cuenta en su móvil.</p>
                                                            </div>
                                                        )}

                                                        {isMultiplayer && !dosMoviles && (
                                                            <div className="mt-4">
                                                                <label htmlFor="rival" className="text-xs font-bold text-blue-500 uppercase mb-2 block">Rival</label>
                                                                <input
                                                                    id="rival"
                                                                    value={nombreRival}
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
                                                {sala && (
                                                    <p role="status" className="shrink-0 text-center text-sm text-gray-300 pt-10 px-4">
                                                        Sala <strong className="text-white tracking-widest">{sala}</strong>
                                                        {' · '}
                                                        {rivalId ? <>{nombreRival}: <strong className="text-blue-400">{piezasRival}</strong></> : 'esperando al rival…'}
                                                        {/* Sin piezas no aparece el botón de terminar: hace falta otra salida */}
                                                        {currentCount === 0 && <button onClick={() => handleFinishSession()} className="ml-3 underline text-gray-400 hover:text-white cursor-pointer">Salir</button>}
                                                    </p>
                                                )}
                                                <MainCounter
                                                    currentCount={currentCount}
                                                    onUpdateSushi={handleUpdateSushi}
                                                    onFinishSession={() => handleFinishSession()}
                                                    player2Count={piezasRival}
                                                    onUpdateSushi2={handleUpdateSushi2}
                                                    player1Name={playerName}
                                                    player2Name={nombreRival}
                                                    isMultiplayer={isMultiplayer && !sala}
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