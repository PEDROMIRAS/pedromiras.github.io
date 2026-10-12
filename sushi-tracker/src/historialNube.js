// Traducción entre un registro del historial de la app y una fila de la tabla `sessions`.
// La tabla rechaza nombres vacíos o de más de 40 caracteres y cuentas fuera de 0-10000.

const cuenta = (n) => Math.min(10000, Math.max(0, Math.trunc(Number(n)) || 0));
const nombre = (texto, porDefecto) => (String(texto ?? '').trim() || porDefecto).slice(0, 40);

/** Registro guardado en el dispositivo -> fila para insertar (su `id` es el instante en que se terminó). */
export function aFila(registro) {
    return {
        played_at: new Date(registro.id).toISOString(),
        pieces: cuenta(registro.cantidad),
        is_multiplayer: Boolean(registro.isMultiplayer),
        player1_name: nombre(registro.player1Name, 'Tú'),
        player2_name: registro.isMultiplayer ? nombre(registro.player2Name, 'Rival') : null,
        player2_pieces: registro.isMultiplayer ? cuenta(registro.player2Count) : null,
    };
}

/** Fila de la tabla -> registro con la forma que pinta el historial. `nube` lo distingue de los locales. */
export function aRegistro(fila) {
    const fecha = new Date(fila.played_at);
    return {
        id: fila.id,
        nube: true,
        date: fecha.toLocaleDateString(),
        time: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cantidad: fila.pieces,
        isMultiplayer: fila.is_multiplayer,
        player2Count: fila.player2_pieces ?? 0,
        player1Name: fila.player1_name,
        player2Name: fila.player2_name ?? 'Rival',
    };
}
