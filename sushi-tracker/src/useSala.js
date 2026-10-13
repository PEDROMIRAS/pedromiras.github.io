import { useEffect, useRef } from 'react';
import { cargarSupabase } from './supabase';

// Sin letras ni números que se confundan al dictarlo (O/0, I/1)
const LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
export const nuevaSala = () => Array.from(crypto.getRandomValues(new Uint8Array(4)), (n) => LETRAS[n % LETRAS.length]).join('');

/**
 * Duelo en dos móviles: los dos entran en el mismo canal y cada uno avisa de lo que lleva.
 * No se guarda nada en el servidor ni hace falta cuenta.
 * shortcut: quien sepa el código puede entrar en la sala y no se avisa si el rival pierde la
 * conexión; si hiciera falta, canales privados con cuenta y presencia.
 * @param {string|null} sala - Código de la sala, o null si no hay duelo en línea.
 * @param {{id: string, nombre: string, cuenta: number}} yo - Lo que se cuenta al rival.
 * @param {Function} alRecibir - Recibe cada mensaje del rival.
 * @returns {Function} Envía mi estado con los campos extra que se le pasen.
 */
export function useSala(sala, yo, alRecibir) {
    const enviar = useRef(null);
    const ultimo = useRef({ yo, alRecibir });
    useEffect(() => { ultimo.current = { yo, alRecibir }; });

    useEffect(() => {
        if (!sala) return;
        let canal, cancelado = false;
        cargarSupabase().then((supabase) => {
            if (cancelado) return;
            canal = supabase.channel(`duelo-${sala}`);
            const mandar = (extra) => canal.send({ type: 'broadcast', event: 'cuenta', payload: { ...ultimo.current.yo, ...extra } });
            canal
                .on('broadcast', { event: 'cuenta' }, ({ payload }) => {
                    // Quien acaba de entrar no sabe cuánto llevo: se lo digo
                    if (payload.hola) mandar();
                    ultimo.current.alRecibir(payload);
                })
                .subscribe((estado) => {
                    if (estado !== 'SUBSCRIBED') return;
                    enviar.current = mandar;
                    mandar({ hola: true });
                });
        });
        return () => {
            cancelado = true;
            enviar.current = null;
            if (canal) cargarSupabase().then((supabase) => supabase.removeChannel(canal));
        };
    }, [sala]);

    useEffect(() => { enviar.current?.(); }, [yo.cuenta, yo.nombre]);

    return (extra) => enviar.current?.(extra);
}
