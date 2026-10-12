// src/components/Cuenta.jsx
import { useState } from 'react';
import { supabase } from '../supabase';

const ERRORES = {
    'Invalid login credentials': 'Correo o contraseña incorrectos.',
    'User already registered': 'Ya hay una cuenta con ese correo. Prueba a entrar.',
    'Email not confirmed': 'Aún no has confirmado tu correo. Revisa tu bandeja de entrada.',
};

/**
 * Cuenta opcional: con ella el historial se guarda en la nube. Sin ella la app funciona igual,
 * guardando en el dispositivo.
 * @param {Object|null} props.usuario - Usuario con sesión iniciada, o null.
 */
export default function Cuenta({ usuario }) {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const enviar = async (crear) => {
        setOcupado(true);
        setMensaje('');
        const credenciales = { email: correo.trim(), password: clave };
        const { data, error } = crear
            ? await supabase.auth.signUp({
                ...credenciales,
                // El enlace del correo de confirmación devuelve a esta misma app
                options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL },
            })
            : await supabase.auth.signInWithPassword(credenciales);
        setOcupado(false);
        if (error) setMensaje(ERRORES[error.message] || 'No se ha podido completar. Inténtalo de nuevo.');
        else if (!data.session) setMensaje('Te hemos enviado un correo para confirmar la cuenta.');
    };

    if (usuario) {
        return (
            <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cuenta</span>
                <p className="text-gray-300 break-all">{usuario.email}</p>
                <p className="text-sm text-gray-500">Tu historial se guarda en tu cuenta y lo verás en cualquier dispositivo.</p>
                <button onClick={() => supabase.auth.signOut()} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold transition-colors cursor-pointer text-lg">Cerrar sesión</button>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); enviar(false); }} className="flex flex-col gap-3">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cuenta (opcional)</span>
            <p className="text-sm text-gray-500">Con una cuenta, tu historial se guarda en la nube y lo verás en cualquier dispositivo.</p>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="Correo" aria-label="Correo" autoComplete="email" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 text-lg" required />
            <input type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="Contraseña (mínimo 8)" aria-label="Contraseña" autoComplete="current-password" minLength={8} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 text-lg" required />
            <div className="flex gap-3">
                <button type="submit" disabled={ocupado} className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-colors cursor-pointer text-lg">Entrar</button>
                {/* type="button": crea la cuenta sin pasar por el envío del formulario, pero con su misma validación */}
                <button type="button" disabled={ocupado} onClick={(e) => e.currentTarget.form.reportValidity() && enviar(true)} className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-colors cursor-pointer text-lg">Crear cuenta</button>
            </div>
            <p role="status" className="text-sm text-gray-300 min-h-5">{mensaje}</p>
        </form>
    );
}
