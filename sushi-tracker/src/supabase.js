import { createClient } from '@supabase/supabase-js';

// Se llega desde el enlace de "he olvidado la contraseña". Se mira antes de crear el cliente,
// que al arrancar consume y borra esa parte de la dirección.
export const vieneDeRecuperar = window.location.hash.includes('type=recovery');

// Clave pública: va en el navegador por diseño. Lo que protege los datos son las reglas
// de acceso por fila (RLS) de la tabla `sessions`, no esta clave.
export const supabase = createClient(
    'https://bytdwhavbmzynqxdcyuv.supabase.co',
    'sb_publishable_Vhyvhre2mZl2ioBWIV68yA_8EYbAv09'
);
