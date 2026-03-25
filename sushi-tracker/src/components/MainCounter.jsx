// src/components/MainCounter.jsx

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import niguiriImage from '../assets/images/niguiri.png';
import niguiriImage1 from '../assets/images/niguiri1.png';


export default function MainCounter({
    currentCount,
    onUpdateSushi,
    onFinishSession,
    // --- PROPS PARA EL MODO MULTIJUGADOR ---
    player2Count = 0,
    onUpdateSushi2 = () => { },
    player1Name = "Tú",
    player2Name = "Rival",
    isMultiplayer = false
}) {

    // ==========================================
    // VISTA 2 JUGADORES (PANTALLA DIVIDIDA)
    // ==========================================
    if (isMultiplayer) {
        return (
            <main className="flex-1 flex flex-col w-full relative overflow-hidden">

                {/* JUGADOR 2 (MITAD SUPERIOR - GIRADA 180 GRADOS) */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center rotate-180 bg-gray-900/30">
                    <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">
                        {player2Name}
                    </h3>
                    <motion.div
                        key={`p2-${player2Count}`}
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}
                        className="text-7xl font-black text-blue-500 mb-2 drop-shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                    >
                        {player2Count}
                    </motion.div>

                    <motion.img
                        src={niguiriImage1} onClick={() => onUpdateSushi2(1)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.85 }}
                        className="w-32 h-auto cursor-pointer select-none drop-shadow-2xl mb-4"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    />

                    <div className="flex items-center bg-black/50 rounded-full border border-gray-800 p-1">
                        <motion.button onClick={() => onUpdateSushi2(-1)} disabled={player2Count === 0} className="w-12 h-12 flex items-center justify-center text-3xl font-black text-gray-600 hover:text-white rounded-full disabled:opacity-30 cursor-pointer active:scale-95">-</motion.button>
                        <span className="px-4 text-gray-600 font-bold uppercase tracking-widest text-[10px]">Piezas</span>
                        <motion.button onClick={() => onUpdateSushi2(1)} className="w-12 h-12 flex items-center justify-center text-3xl font-black text-blue-500 hover:text-blue-400 rounded-full cursor-pointer active:scale-95">+</motion.button>
                    </div>
                </div>

                {/* LÍNEA DIVISORIA Y BOTÓN CENTRAL */}
                <div className="h-1 bg-gray-800 flex items-center justify-center relative z-10 w-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onFinishSession}
                        className="absolute bg-gray-100 hover:bg-white text-black font-black py-3 px-6 rounded-full shadow-2xl transition-colors uppercase tracking-widest text-xs cursor-pointer border-4 border-gray-900 z-20"
                    >
                        Terminar Duelo
                    </motion.button>
                </div>

                {/* JUGADOR 1 (MITAD INFERIOR - NORMAL) */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                        {player1Name}
                    </h3>
                    <motion.div
                        key={`p1-${currentCount}`}
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}
                        className="text-7xl font-black text-purple-500 mb-2 drop-shadow-[0_4px_10px_rgba(168,85,247,0.3)]"
                    >
                        {currentCount}
                    </motion.div>

                    <motion.img
                        src={niguiriImage} onClick={() => onUpdateSushi(1)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.85 }}
                        className="w-32 h-auto cursor-pointer select-none drop-shadow-2xl mb-4"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    />

                    <div className="flex items-center bg-gray-900 rounded-full border border-gray-800 p-1">
                        <motion.button onClick={() => onUpdateSushi(-1)} disabled={currentCount === 0} className="w-12 h-12 flex items-center justify-center text-3xl font-black text-gray-500 hover:text-white rounded-full disabled:opacity-30 cursor-pointer active:scale-95">-</motion.button>
                        <span className="px-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Piezas</span>
                        <motion.button onClick={() => onUpdateSushi(1)} className="w-12 h-12 flex items-center justify-center text-3xl font-black text-purple-500 hover:text-purple-400 rounded-full cursor-pointer active:scale-95">+</motion.button>
                    </div>
                </div>

            </main>
        );
    }

    // ==========================================
    // VISTA 1 JUGADOR (EL DISEÑO ORIGINAL)
    // ==========================================
    return (
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-gray-100 font-bold uppercase tracking-widest text-sm mb-4">
                Sesión Actual
            </h3>
            <motion.div
                key={currentCount}
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                className="text-9xl font-black text-purple-600 mb-8 drop-shadow-[0_4px_10px_rgba(168,85,247,0.3)]"
            >
                {currentCount}
            </motion.div>
            <motion.img
                src={niguiriImage} alt="Añadir una pieza de sushi" onClick={() => onUpdateSushi(1)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.85 }}
                className="w-[90%] max-w-xs h-auto cursor-pointer select-none drop-shadow-2xl"
                style={{ WebkitTapHighlightColor: 'transparent' }}
            />
            <div className="mt-12 flex items-center bg-gray-900 rounded-full border border-gray-800 p-1 shadow-inner">
                <motion.button onClick={() => onUpdateSushi(-1)} disabled={currentCount === 0} className="w-14 h-14 flex items-center justify-center text-3xl font-black text-gray-400 hover:text-white hover:bg-gray-800 rounded-full disabled:opacity-30 transition-all active:scale-95 cursor-pointer">-</motion.button>
                <span className="px-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Piezas</span>
                <motion.button onClick={() => onUpdateSushi(1)} className="w-14 h-14 flex items-center justify-center text-3xl font-black text-purple-500 hover:text-purple-400 hover:bg-gray-800 rounded-full transition-all active:scale-95 cursor-pointer">+</motion.button>
            </div>
            {currentCount > 0 && (
                <motion.button
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onFinishSession}
                    className="mt-8 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-900/40 transition-colors uppercase tracking-wide text-sm cursor-pointer"
                >
                    Terminar comilona
                </motion.button>
            )}
        </main>
    );
}