// src/components/SettingsView.jsx
import { useState } from 'react';

export default function SettingsView({ playerName, onUpdateName, onShare, onClearHistory, onClose }) {
    // Estados que ahora viven solo donde se necesitan (aquí)
    const [newNameInput, setNewNameInput] = useState(playerName);
    const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (newNameInput.trim()) {
            onUpdateName(newNameInput.trim());
            onClose(); // Cerramos ajustes tras guardar
        }
    };

    const handleConfirmClear = () => {
        onClearHistory();
        setIsClearConfirmOpen(false);
        onClose();
    };

    return (
        <>
            {/* PANTALLA DE AJUSTES (A pantalla completa en móvil) */}
            <div className="fixed inset-0 z-30 bg-gray-900 flex flex-col p-6 transform transition-all duration-300 ease-in-out">

                <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-800">
                    <h3 className="text-3xl font-black text-white">Ajustes</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white font-bold p-3 rounded-full hover:bg-gray-800 transition-colors cursor-pointer text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 flex flex-col gap-8">
                    <form onSubmit={handleNameSubmit} className="flex flex-col gap-3">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cambiar nombre</label>
                        <div className="flex flex-col gap-3">
                            <input
                                value={newNameInput}
                                onChange={e => setNewNameInput(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 text-lg"
                                required
                                autoFocus
                            />
                            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold transition-colors cursor-pointer text-lg shadow-lg shadow-purple-900/40">
                                Guardar
                            </button>
                        </div>
                    </form>

                    <button onClick={onShare} className="w-full flex items-center justify-center gap-3 bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 font-bold py-4 rounded-xl transition-colors border border-blue-900/50 cursor-pointer text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                        Compartir estadísticas
                    </button>
                </div>

                <div className="border-t border-gray-800 pt-8 mt-auto">
                    <button onClick={() => setIsClearConfirmOpen(true)} className="w-full flex items-center justify-center gap-3 bg-red-900/30 text-red-400 hover:bg-red-900/50 font-bold py-4 rounded-xl transition-colors border border-red-900/50 cursor-pointer text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                        Borrar historial completo
                    </button>
                </div>
            </div>

            {/* MODAL: CONFIRMAR BORRADO (z-50) */}
            {isClearConfirmOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" onClick={() => setIsClearConfirmOpen(false)} />
                    <div className="bg-gray-900 border border-red-900/50 p-8 rounded-3xl shadow-2xl z-10 w-[96%] max-w-sm flex flex-col gap-6 text-center transform transition-all">
                        <div className="mx-auto bg-red-900/20 text-red-500 p-4 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-white">¡Atención!</h3>
                        <p className="text-gray-400 font-medium">Estás a punto de borrar todo tu historial y tu sesión actual. Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3 mt-2">
                            <button onClick={() => setIsClearConfirmOpen(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors cursor-pointer">Cancelar</button>
                            <button onClick={handleConfirmClear} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/40 transition-colors cursor-pointer">Sí, borrar todo</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}