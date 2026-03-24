// src/components/HistoryDrawer.jsx

export default function HistoryDrawer({ isOpen, history, totalSushi, onClose }) {
    return (
        <>
            {/* OVERLAY: Fondo oscuro difuminado (solo aparece si el menú está abierto) */}
            {isOpen && (
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 transition-opacity cursor-pointer"
                    onClick={onClose}
                />
            )}

            {/* CAJÓN LATERAL: Siempre existe en el código, pero se mueve dentro/fuera de la pantalla con CSS */}
            <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-black shadow-2xl z-20 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Cabecera del menú */}
                <div className="p-6 flex justify-between items-center border-b border-black">
                    <h3 className="text-xl font-bold text-white">Tu Historial</h3>
                    <button onClick={onClose} className="text-gray-300 hover:bg-gray-800 hover:text-purple-500 w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all cursor-pointer">✕</button>
                </div>

                {/* Lista de registros con scroll */}
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

                {/* Pie del menú con el Total */}
                <div className="p-6 border-t border-black bg-gray-900">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Total Histórico</span>
                        <span className="text-2xl font-black text-purple-500">{totalSushi}</span>
                    </div>
                </div>
            </div>
        </>
    );
}