// Se llega desde el enlace de "he olvidado la contraseña". Se mira antes de crear el cliente,
// que al arrancar consume y borra esa parte de la dirección.
export const vieneDeRecuperar = window.location.hash.includes('type=recovery');

/**
 * Hay que conectar con la cuenta nada más abrir: ya hay una sesión guardada en este dispositivo,
 * o se vuelve de un enlace de correo (confirmar la cuenta, cambiar la contraseña).
 */
export const haySesion = () =>
    window.location.hash.includes('access_token=') || localStorage.getItem('sb-bytdwhavbmzynqxdcyuv-auth-token') !== null;

let cliente;
/**
 * El cliente de Supabase. La librería pesa más que el resto de la app y la mayoría de la gente
 * no tiene cuenta: se descarga la primera vez que alguien la necesita.
 * Clave pública: va en el navegador por diseño. Lo que protege los datos son las reglas
 * de acceso por fila (RLS) de la tabla `sessions`, no esta clave.
 */
export const cargarSupabase = () => (cliente ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(
    'https://bytdwhavbmzynqxdcyuv.supabase.co',
    'sb_publishable_Vhyvhre2mZl2ioBWIV68yA_8EYbAv09'
)));
