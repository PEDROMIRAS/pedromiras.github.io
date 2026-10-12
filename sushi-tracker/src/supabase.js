import { createClient } from '@supabase/supabase-js';

// Clave pública: va en el navegador por diseño. Lo que protege los datos son las reglas
// de acceso por fila (RLS) de la tabla `sessions`, no esta clave.
export const supabase = createClient(
    'https://bytdwhavbmzynqxdcyuv.supabase.co',
    'sb_publishable_Vhyvhre2mZl2ioBWIV68yA_8EYbAv09'
);
