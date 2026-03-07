import { useState } from 'react';
import niguiriImage from '../assets/images/niguiri.png';
import niguiri1Image from '../assets/images/niguiri1.png';

/* Recibimos 'onSaveName' por destructuración de los props. 
    Es la función que nos mandó App.jsx.
*/
export default function Onboarding({ onSaveName }) {
    // Estado local para controlar lo que el usuario escribe en el input
    const [name, setName] = useState('');

    /*
        MANEJADOR DEL FORMULARIO:
        Se ejecuta al pulsar "Enter" o hacer click en el botón tipo "submit".
    */
    const handleSubmit = (e) => {
        // Previene el comportamiento por defecto de HTML (recargar la página entera)
        e.preventDefault(); 
        
        // name.trim() elimina espacios en blanco al principio y al final.
        // Si después de eso hay texto, llamamos a la función del padre.
        if (name.trim()) {
            onSaveName(name.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen bg-black p-6">
            <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-800 w-full max-w-sm text-center">
            
            {/* Cabecera visual con imágenes transformadas (rotadas) mediante CSS */}
            <div className="flex justify-center items-center gap-2 mb-6">
                <img 
                    src={niguiriImage} 
                    alt="Niguiri" 
                    className="w-16 h-auto drop-shadow-lg transform -rotate-12" 
                />
                <img 
                    src={niguiri1Image} 
                    alt="Niguiri" 
                    className="w-16 h-auto drop-shadow-lg transform rotate-12" 
                />
            </div>
            
            <h1 className="text-3xl font-black text-white mb-2">Sushi Tracker</h1>
            <p className="text-gray-400 mb-8 font-medium">¿Quién va a devorar hoy?</p>

            {/* Formulario semántico */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* INPUT CONTROLADO:
                    Su valor está atado al estado 'name' de React.
                    El onChange actualiza ese estado cada vez que se pulsa una tecla.
                */}
                <input
                    type="text"
                    placeholder="Tu nombre..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-900/30 text-white placeholder-gray-500 text-lg transition-all"
                    required
                    autoFocus
                />
                
                <button
                    type="submit"
                    className="bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 active:transform active:scale-95 transition-all text-lg shadow-lg shadow-purple-900/40"
                >
                    Empezar a contar
                </button>
            </form>

            </div>
        </div>
    );
}