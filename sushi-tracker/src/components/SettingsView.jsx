// src/components/SettingsView.jsx
import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Cuenta from './Cuenta';

export default function SettingsView({ playerName, usuario, pendientes, recuperando, onRecuperada, onUpdateName, onClearHistory, onClose }) {
    const [newNameInput, setNewNameInput] = useState(playerName);
    const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (newNameInput.trim()) {
            onUpdateName(newNameInput.trim());
            onClose();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-950 p-6 relative">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-800">
                <h3 className="text-3xl font-black text-white">Ajustes</h3>
                <button onClick={onClose} aria-label="Cerrar ajustes" className="text-gray-400 hover:text-white font-bold p-3 rounded-full hover:bg-gray-800 transition-colors cursor-pointer text-xl">✕</button>
            </div>

            <div className="flex-1 flex flex-col gap-8 overflow-y-auto">
                <form onSubmit={handleNameSubmit} className="flex flex-col gap-3">
                    <label htmlFor="nombre" className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cambiar nombre</label>
                    <div className="flex flex-col gap-3">
                        <input id="nombre" value={newNameInput} onChange={e => setNewNameInput(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 text-lg" required />
                        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold transition-colors cursor-pointer text-lg">Guardar</button>
                    </div>
                </form>

                <Cuenta usuario={usuario} pendientes={pendientes} recuperando={recuperando} onRecuperada={onRecuperada} />
            </div>

            <div className="border-t border-gray-800 pt-8 mt-auto">
                <button onClick={() => setIsClearConfirmOpen(true)} className="w-full flex items-center justify-center gap-3 bg-red-900/30 text-red-400 hover:bg-red-900/50 font-bold py-4 rounded-xl transition-colors border border-red-900/50 cursor-pointer text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    Borrar historial completo
                </button>
            </div>

            {/* Modal de confirmación de borrado */}
            <AnimatePresence>
                {isClearConfirmOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/90">
                        <motion.div role="alertdialog" aria-modal="true" aria-labelledby="aviso-borrar" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gray-900 border border-red-900/50 p-8 rounded-3xl shadow-2xl w-[96%] max-w-sm flex flex-col gap-6 text-center">
                            <h3 id="aviso-borrar" className="text-2xl font-black text-white">¡Atención!</h3>
                            <p className="text-gray-400 font-medium">Estás a punto de borrar todo tu historial{usuario ? ', también el guardado en tu cuenta' : ''}. Esta acción no se puede deshacer.</p>
                            <div className="flex gap-3 mt-2">
                                <button onClick={() => setIsClearConfirmOpen(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl cursor-pointer">Cancelar</button>
                                <button onClick={() => { onClearHistory(); setIsClearConfirmOpen(false); onClose(); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl cursor-pointer">Borrar</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}