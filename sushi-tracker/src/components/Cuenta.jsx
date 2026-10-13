// src/components/Cuenta.jsx
import { useState } from 'react';
import { cargarSupabase } from '../supabase';

const ERRORES = {
    'Invalid login credentials': 'Correo o contraseña incorrectos.',
    'User already registered': 'Ya hay una cuenta con ese correo. Prueba a entrar.',
    'Email not confirmed': 'Aún no has confirmado tu correo. Revisa tu bandeja de entrada.',
    'New password should be different from the old password.': 'La contraseña nueva tiene que ser distinta de la anterior.',
};

const CAMPO = 'w-full bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 text-lg';
const BOTON = 'disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-colors cursor-pointer text-lg';
// El enlace de los correos (confirmar cuenta, cambiar contraseña) devuelve a esta misma app
const VUELTA = window.location.origin + import.meta.env.BASE_URL;

/**
 * Cuenta opcional: con ella el historial se guarda en la nube. Sin ella la app funciona igual,
 * guardando en el dispositivo.
 * @param {Object|null} props.usuario - Usuario con sesión iniciada, o null.
 * @param {number} props.pendientes - Sesiones guardadas en el dispositivo que aún no se han subido.
 * @param {boolean} props.recuperando - Se ha llegado desde el correo de "he olvidado la contraseña".
 * @param {Function} props.onRecuperada - Aviso de que ya se ha puesto la contraseña nueva.
 */
export default function Cuenta({ usuario, pendientes, recuperando, onRecuperada }) {
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [confirmando, setConfirmando] = useState(false);

    /** Lanza una petición de la cuenta y deja en pantalla el error o el mensaje de que ha ido bien. */
    const pedir = async (peticion, siVaBien) => {
        setOcupado(true);
        setMensaje('');
        const { data, error } = await peticion(await cargarSupabase());
        setOcupado(false);
        if (error) setMensaje(ERRORES[error.message] || 'No se ha podido completar. Inténtalo de nuevo.');
        else setMensaje(siVaBien(data));
    };

    const enviar = (crear) => {
        const credenciales = { email: correo.trim(), password: clave };
        pedir(
            (supabase) => crear
                ? supabase.auth.signUp({ ...credenciales, options: { emailRedirectTo: VUELTA } })
                : supabase.auth.signInWithPassword(credenciales),
            (data) => data.session ? '' : 'Te hemos enviado un correo para confirmar la cuenta.'
        );
    };

    const olvidada = () => {
        if (!correo.trim()) return setMensaje('Escribe tu correo arriba y vuelve a pulsar.');
        pedir(
            (supabase) => supabase.auth.resetPasswordForEmail(correo.trim(), { redirectTo: VUELTA }),
            // El mismo mensaje exista o no la cuenta: no se revela qué correos están registrados
            () => 'Si hay una cuenta con ese correo, te hemos enviado un enlace para cambiar la contraseña.'
        );
    };

    const cambiarClave = (e) => {
        e.preventDefault();
        pedir((supabase) => supabase.auth.updateUser({ password: clave }), () => {
            setClave('');
            onRecuperada();
            return 'Contraseña cambiada.';
        });
    };

    // La función de la base de datos borra al usuario que la llama, y con él sus sesiones
    const borrarCuenta = () => pedir((supabase) => supabase.rpc('delete_own_account'), () => {
        setConfirmando(false);
        cargarSupabase().then((supabase) => supabase.auth.signOut({ scope: 'local' }));
        return 'Cuenta borrada.';
    });

    if (usuario && recuperando) {
        return (
            <form onSubmit={cambiarClave} className="flex flex-col gap-3">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nueva contraseña</span>
                <p className="text-sm text-gray-500 break-all">Para la cuenta {usuario.email}</p>
                <input type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="Contraseña nueva (mínimo 8)" aria-label="Contraseña nueva" autoComplete="new-password" minLength={8} className={CAMPO} required />
                <button type="submit" disabled={ocupado} className={`w-full bg-purple-600 hover:bg-purple-500 ${BOTON}`}>Guardar contraseña</button>
                <p role="status" className="text-sm text-gray-300 min-h-5">{mensaje}</p>
            </form>
        );
    }

    if (usuario) {
        return (
            <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cuenta</span>
                <p className="text-gray-300 break-all">{usuario.email}</p>
                <p className="text-sm text-gray-500">Tu historial se guarda en tu cuenta y lo verás en cualquier dispositivo.</p>
                {pendientes > 0 && (
                    <p className="text-sm text-amber-400">
                        {pendientes === 1 ? 'Hay 1 sesión guardada' : `Hay ${pendientes} sesiones guardadas`} solo en este dispositivo. Se subirán cuando vuelva la conexión.
                    </p>
                )}
                <button onClick={() => cargarSupabase().then((supabase) => supabase.auth.signOut())} className={`w-full bg-gray-800 hover:bg-gray-700 ${BOTON}`}>Cerrar sesión</button>
                {confirmando ? (
                    <div className="flex flex-col gap-3 border border-red-900/50 rounded-xl p-4">
                        <p className="text-sm text-gray-300">Se borrarán tu cuenta y el historial guardado en ella. No se puede deshacer.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmando(false)} className={`flex-1 bg-gray-800 hover:bg-gray-700 ${BOTON}`}>Cancelar</button>
                            <button disabled={ocupado} onClick={borrarCuenta} className={`flex-1 bg-red-600 hover:bg-red-500 ${BOTON}`}>Borrar</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setConfirmando(true)} className="self-start text-sm text-red-400 hover:text-red-300 underline cursor-pointer">Borrar mi cuenta</button>
                )}
                <p role="status" className="text-sm text-gray-300 min-h-5">{mensaje}</p>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); enviar(false); }} className="flex flex-col gap-3">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cuenta (opcional)</span>
            <p className="text-sm text-gray-500">Con una cuenta, tu historial se guarda en la nube y lo verás en cualquier dispositivo.</p>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="Correo" aria-label="Correo" autoComplete="email" className={CAMPO} required />
            <input type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="Contraseña (mínimo 8)" aria-label="Contraseña" autoComplete="current-password" minLength={8} className={CAMPO} required />
            <div className="flex gap-3">
                <button type="submit" disabled={ocupado} className={`flex-1 bg-purple-600 hover:bg-purple-500 ${BOTON}`}>Entrar</button>
                {/* type="button": crea la cuenta sin pasar por el envío del formulario, pero con su misma validación */}
                <button type="button" disabled={ocupado} onClick={(e) => e.currentTarget.form.reportValidity() && enviar(true)} className={`flex-1 bg-gray-800 hover:bg-gray-700 ${BOTON}`}>Crear cuenta</button>
            </div>
            <button type="button" disabled={ocupado} onClick={olvidada} className="self-start text-sm text-gray-400 hover:text-white underline cursor-pointer disabled:opacity-60">He olvidado la contraseña</button>
            <p role="status" className="text-sm text-gray-300 min-h-5">{mensaje}</p>
        </form>
    );
}
