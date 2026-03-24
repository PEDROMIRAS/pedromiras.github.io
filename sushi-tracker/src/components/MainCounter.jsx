// src/components/MainCounter.jsx
import niguiriImage from '../assets/images/niguiri.png';

export default function MainCounter({ currentCount, onUpdateSushi, onFinishSession }) {
    return (
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-gray-100 font-bold uppercase tracking-widest text-sm mb-4">
                Sesión Actual
            </h3>

            {/* Contador Gigante */}
            <div className="text-9xl font-black text-purple-600 mb-8 drop-shadow-[0_4px_10px_rgba(168,85,247,0.3)]">
                {currentCount}
            </div>

            {/* Imagen del Niguiri central (Click para sumar) */}
            <img
                src={niguiriImage}
                alt="Añadir una pieza de sushi"
                onClick={() => onUpdateSushi(1)}
                className="w-[90%] h-auto cursor-pointer select-none transform transition-transform hover:scale-110 active:scale-90"
                style={{ WebkitTapHighlightColor: 'transparent' }}
            />

            {/* Botones de + y - */}
            <div className="mt-12 flex items-center bg-gray-900 rounded-full border border-gray-800 p-1 shadow-inner">
                <button
                    onClick={() => onUpdateSushi(-1)}
                    disabled={currentCount === 0}
                    className="w-14 h-14 flex items-center justify-center text-3xl font-black text-gray-400 hover:text-white hover:bg-gray-800 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95 cursor-pointer"
                >
                    -
                </button>
                <span className="px-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Piezas</span>
                <button
                    onClick={() => onUpdateSushi(1)}
                    className="w-14 h-14 flex items-center justify-center text-3xl font-black text-purple-500 hover:text-purple-400 hover:bg-gray-800 rounded-full transition-all active:scale-95 cursor-pointer"
                >
                    +
                </button>
            </div>

            {/* Botón de Terminar Comilona (Solo aparece si hay > 0 sushis) */}
            {currentCount > 0 && (
                <button
                    onClick={onFinishSession}
                    className="mt-8 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-900/40 transition-all active:scale-95 uppercase tracking-wide text-sm cursor-pointer"
                >
                    Terminar comilona
                </button>
            )}
        </main>
    );
}