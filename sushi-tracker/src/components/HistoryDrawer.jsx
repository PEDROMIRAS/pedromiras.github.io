// src/components/HistoryDrawer.jsx

/**
 * Componente que muestra el historial de sesiones de la aplicación.
 * Ocupa el 100% del alto y ancho disponible mediante Flexbox.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.history - Lista de registros de sesiones guardadas.
 * @param {number} props.totalSushi - Sumatoria total de piezas consumidas en todas las sesiones.
 * @param {Function} props.onClose - Función callback para cerrar la vista del historial y volver al inicio.
 * @param {Function} props.onDeleteRecord - Función callback para eliminar un registro específico del historial.
 */
export default function HistoryDrawer({ history, totalSushi, onClose, onDeleteRecord }) {
    return (
        /* Contenedor principal: flex-1 asegura que ocupe todo el espacio vertical de su padre */
        <div className="flex-1 flex flex-col w-full h-full bg-black overflow-hidden">

            {/* Cabecera del historial. shrink-0 evita que se comprima si falta espacio. */}
            <div className="p-6 flex justify-between items-center border-b border-gray-900 bg-gray-950 shrink-0">
                <h3 className="text-2xl font-black text-white">Tu Historial</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white hover:bg-gray-800 w-12 h-12 flex items-center justify-center rounded-full font-bold transition-all cursor-pointer text-xl"
                >
                    ✕
                </button>
            </div>

            {/* Contenedor de la lista. flex-1 y overflow-y-auto permiten el scroll interno. */}
            <div className="p-6 overflow-y-auto flex-1 bg-black">
                {history.length === 0 ? (
                    <p className="text-gray-500 text-center mt-16 font-medium">
                        Aún no hay registros.<br />¡A comer sushi!
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {history.map((record) => (
                            <li key={record.id} className="flex flex-col bg-gray-900 p-5 rounded-3xl border border-gray-800 group gap-3 shadow-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-100 text-lg">{record.date}</span>
                                        <span className="text-sm text-gray-500 font-medium">{record.time}</span>
                                    </div>
                                    <button
                                        onClick={() => onDeleteRecord(record.id)}
                                        className="text-gray-600 hover:text-red-500 p-2 transition-colors cursor-pointer active:scale-90"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2.5 mt-2 bg-black/40 p-4 rounded-2xl border border-gray-800/50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-400">{record.player1Name || 'Tú'}</span>
                                        <span className="font-black text-purple-500 bg-purple-900/20 px-4 py-1.5 rounded-full border border-purple-900/40 text-sm">
                                            {record.cantidad}
                                        </span>
                                    </div>
                                    {record.isMultiplayer && (
                                        <div className="flex justify-between items-center border-t border-gray-800/60 pt-2.5 mt-1.5">
                                            <span className="text-sm font-bold text-gray-400">{record.player2Name || 'Rival'}</span>
                                            <span className="font-black text-blue-500 bg-blue-900/20 px-4 py-1.5 rounded-full border border-blue-900/40 text-sm">
                                                {record.player2Count}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Pie de página. mt-auto lo empuja al fondo. shrink-0 mantiene su altura fija. */}
            <div className="p-8 border-t border-gray-900 bg-gray-950 shrink-0 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Total Histórico</span>
                    <span className="text-3xl font-black text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">{totalSushi}</span>
                </div>
            </div>

        </div>
    );
}