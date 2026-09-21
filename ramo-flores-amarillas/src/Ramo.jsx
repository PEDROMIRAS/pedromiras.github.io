// Dibuja un ramo (ver generarRamo.js) como un único SVG.

const rango = (n) => Array.from({ length: n }, (_, i) => i);
const n = (x) => Math.round(x * 10) / 10;

// Pétalo puntiagudo y pétalo redondeado, ambos apuntando hacia arriba desde (0,0)
const petalo = (w, h) =>
  `M0 0 C${n(w)} ${n(-h * 0.25)} ${n(w)} ${n(-h * 0.8)} 0 ${n(-h)} C${n(-w)} ${n(-h * 0.8)} ${n(-w)} ${n(-h * 0.25)} 0 0Z`;
const petaloRedondo = (w, h) =>
  `M0 0 C${n(w * 1.35)} ${n(-h * 0.1)} ${n(w * 1.2)} ${n(-h)} 0 ${n(-h)} C${n(-w * 1.2)} ${n(-h)} ${n(-w * 1.35)} ${n(-h * 0.1)} 0 0Z`;

/* ---------- Tipos de flor (todas centradas en 0,0; el tulipán nace en 0,0) ---------- */

function Girasol({ f }) {
  const { r, petalas, color } = f;
  const paso = 360 / petalas;
  const semillas = rango(30).map((k) => {
    const a = (k * 137.508 * Math.PI) / 180;
    const d = r * 0.32 * Math.sqrt((k + 0.5) / 30);
    return [n(Math.cos(a) * d), n(Math.sin(a) * d)];
  });
  return (
    <>
      {rango(petalas).map((i) => (
        <path
          key={`a${i}`}
          d={petalo(r * 0.16, r * 0.78)}
          fill={color.oscuro}
          transform={`rotate(${n(i * paso + paso / 2)}) translate(0 ${n(-r * 0.22)})`}
        />
      ))}
      {rango(petalas).map((i) => (
        <path
          key={`b${i}`}
          d={petalo(r * 0.15, r * 0.76)}
          fill={color.base}
          transform={`rotate(${n(i * paso)}) translate(0 ${n(-r * 0.22)})`}
        />
      ))}
      <circle r={r * 0.43} fill="#7A4E24" />
      <circle r={r * 0.37} fill="#4A2A10" />
      {semillas.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={r * 0.03} fill="#B98740" opacity="0.9" />
      ))}
    </>
  );
}

function Margarita({ f }) {
  const { r, petalas, color } = f;
  const paso = 360 / petalas;
  return (
    <>
      {rango(petalas).map((i) => (
        <path
          key={`a${i}`}
          d={petaloRedondo(r * 0.075, r * 0.96)}
          fill={color.oscuro}
          transform={`rotate(${n(i * paso + paso / 2)})`}
        />
      ))}
      {rango(petalas).map((i) => (
        <path
          key={`b${i}`}
          d={petaloRedondo(r * 0.075, r * 0.92)}
          fill={color.base}
          transform={`rotate(${n(i * paso)})`}
        />
      ))}
      <circle r={r * 0.26} fill="#F2A20C" />
      <circle cx={-r * 0.04} cy={-r * 0.04} r={r * 0.16} fill="#FFC93C" />
    </>
  );
}

function Rosa({ f }) {
  const { r, color, giro } = f;
  let espiral = '';
  for (let t = 0.4, i = 0; t <= 13; t += 0.4, i++) {
    const rad = r * 0.022 * t;
    espiral += `${i ? 'L' : 'M'}${n(Math.cos(t) * rad)} ${n(Math.sin(t) * rad)}`;
  }
  const capa = (cuantos, w, h, extra, relleno) =>
    rango(cuantos).map((i) => (
      <path
        key={`${cuantos}-${i}`}
        d={petaloRedondo(w, h)}
        fill={relleno}
        stroke={color.oscuro}
        strokeWidth="1"
        strokeLinejoin="round"
        transform={`rotate(${n(i * (360 / cuantos) + giro + extra)})`}
      />
    ));
  return (
    <>
      <circle r={r * 0.97} fill={color.oscuro} />
      {capa(6, r * 0.36, r * 0.97, 0, color.base)}
      {capa(5, r * 0.32, r * 0.74, 20, color.claro)}
      {capa(4, r * 0.26, r * 0.5, 45, color.base)}
      <path d={espiral} fill="none" stroke={color.oscuro} strokeWidth="1.3" strokeLinecap="round" />
    </>
  );
}

function Tulipan({ f }) {
  const { r: s, color } = f;
  const izq = `M0 0 C${n(-0.75 * s)} ${n(-0.05 * s)} ${n(-0.7 * s)} ${n(-0.85 * s)} ${n(-0.42 * s)} ${n(-1.45 * s)} C${n(-0.22 * s)} ${n(-1.1 * s)} ${n(-0.05 * s)} ${n(-0.7 * s)} 0 0Z`;
  const der = `M0 0 C${n(0.75 * s)} ${n(-0.05 * s)} ${n(0.7 * s)} ${n(-0.85 * s)} ${n(0.42 * s)} ${n(-1.45 * s)} C${n(0.22 * s)} ${n(-1.1 * s)} ${n(0.05 * s)} ${n(-0.7 * s)} 0 0Z`;
  const frente = `M0 ${n(0.05 * s)} C${n(-0.6 * s)} ${n(-0.05 * s)} ${n(-0.55 * s)} ${n(-0.95 * s)} 0 ${n(-1.55 * s)} C${n(0.55 * s)} ${n(-0.95 * s)} ${n(0.6 * s)} ${n(-0.05 * s)} 0 ${n(0.05 * s)}Z`;
  const brillo = `M${n(-0.14 * s)} ${n(-0.3 * s)} C${n(-0.24 * s)} ${n(-0.7 * s)} ${n(-0.14 * s)} ${n(-1.1 * s)} 0 ${n(-1.36 * s)}`;
  return (
    <>
      <path d={izq} fill={color.oscuro} />
      <path d={der} fill={color.oscuro} />
      <path d={frente} fill={color.base} />
      <path d={brillo} fill="none" stroke={color.claro} strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
    </>
  );
}

function Narciso({ f }) {
  const { r, color, giro } = f;
  return (
    <>
      {rango(6).map((i) => (
        <path
          key={i}
          d={petalo(r * 0.34, r)}
          fill={color.claro}
          stroke={color.base}
          strokeWidth="1"
          transform={`rotate(${n(i * 60 + giro)})`}
        />
      ))}
      {rango(12).map((i) => (
        <circle
          key={`v${i}`}
          cx={n(Math.cos((i * Math.PI) / 6) * r * 0.34)}
          cy={n(Math.sin((i * Math.PI) / 6) * r * 0.34)}
          r={r * 0.095}
          fill="#F4A31B"
        />
      ))}
      <circle r={r * 0.34} fill="#F4A31B" />
      <circle r={r * 0.24} fill="#E58A0B" />
      <circle r={r * 0.13} fill="#B85F05" />
    </>
  );
}

function Ranunculo({ f }) {
  const { r, color, giro } = f;
  const capa = (w, h, extra, relleno) =>
    rango(7).map((i) => (
      <path
        key={`${h}-${i}`}
        d={petaloRedondo(w, h)}
        fill={relleno}
        stroke={color.oscuro}
        strokeWidth="0.9"
        strokeLinejoin="round"
        transform={`rotate(${n(i * (360 / 7) + giro + extra)})`}
      />
    ));
  return (
    <>
      {capa(r * 0.34, r * 0.98, 0, color.oscuro)}
      {capa(r * 0.32, r * 0.8, 25, color.base)}
      {capa(r * 0.27, r * 0.58, 8, color.claro)}
      {capa(r * 0.2, r * 0.38, 30, color.base)}
      <circle r={r * 0.1} fill="#9BB23A" />
      <circle r={r * 0.05} fill="#6E8425" />
    </>
  );
}

function Boton({ f }) {
  const { r, color, giro } = f;
  return (
    <>
      {rango(5).map((i) => (
        <path
          key={i}
          d={petaloRedondo(r * 0.36, r * 0.95)}
          fill={color.base}
          stroke={color.oscuro}
          strokeWidth="0.8"
          transform={`rotate(${n(i * 72 + giro)})`}
        />
      ))}
      <circle r={r * 0.24} fill="#F29E1F" />
    </>
  );
}

function Mimosa({ f }) {
  const { color, bolitas } = f;
  return (
    <>
      {bolitas.map((b, i) => (
        <path key={`p${i}`} d={`M0 0 L${b.x} ${b.y}`} stroke="#3F7F52" strokeWidth="1.2" />
      ))}
      {bolitas.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={b.r} fill={color.base} />
          <circle cx={n(b.x - b.r * 0.25)} cy={n(b.y - b.r * 0.25)} r={b.r * 0.45} fill={color.claro} opacity="0.85" />
        </g>
      ))}
    </>
  );
}

const DIBUJO = {
  girasol: Girasol,
  margarita: Margarita,
  rosa: Rosa,
  tulipan: Tulipan,
  narciso: Narciso,
  ranunculo: Ranunculo,
  boton: Boton,
  mimosa: Mimosa,
};

/* ---------- Hojas ---------- */

function Hoja({ h }) {
  return (
    <g transform={`translate(${h.x} ${h.y}) rotate(${h.rot})`}>
      <g className="brota" style={{ '--retraso': `${h.retraso}s` }}>
        <path d={petalo(h.ancho, h.largo)} fill={h.color} />
        <path
          d={`M0 ${n(-h.largo * 0.08)} L0 ${n(-h.largo * 0.85)}`}
          stroke="#000"
          strokeOpacity="0.18"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/* ---------- Papel y lazo ---------- */

function Envoltorio({ tema }) {
  return (
    <>
      <g className="papel">
        <path d="M200 560 L86 328 Q146 352 214 388 Z" fill="#F7E7DF" />
        <path d="M200 560 L314 328 Q254 352 186 388 Z" fill="#EBCDC1" />
        <path d="M200 560 L152 428 L214 388 Z" fill="#FBF2EC" opacity="0.9" />
        <path d="M200 560 L248 430" stroke="#C99C8B" strokeWidth="1.2" opacity="0.6" fill="none" />
        <path d="M200 560 L166 470" stroke="#C99C8B" strokeWidth="1.2" opacity="0.5" fill="none" />
        <path d="M138 434 Q200 456 262 434 L254 452 Q200 474 146 452 Z" fill={tema.cinta} />
      </g>
      <g className="lazo">
        <path d="M196 460 L170 508 L186 502 L192 516 L204 462Z" fill={tema.cintaOscura} />
        <path d="M204 460 L230 508 L214 502 L208 516 L196 462Z" fill={tema.cintaOscura} />
        <path d="M200 454 C176 424 146 438 158 462 C164 474 190 466 200 454Z" fill={tema.cinta} />
        <path d="M200 454 C224 424 254 438 242 462 C236 474 210 466 200 454Z" fill={tema.cinta} />
        <path d="M200 454 C180 434 160 444 166 458" stroke={tema.cintaClara} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M200 454 C220 434 240 444 234 458" stroke={tema.cintaClara} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="200" cy="455" r="8.5" fill={tema.cintaOscura} />
      </g>
    </>
  );
}

/* ---------- Ramo completo ---------- */

export default function Ramo({ ramo }) {
  return (
    <svg
      className="ramo"
      viewBox="0 0 400 580"
      role="img"
      aria-label={`Un ramo de flores ${ramo.nombre}, envuelto en papel y atado con un lazo`}
    >
      <circle className="halo" cx="200" cy="230" r="188" />

      {ramo.hojasFondo.map((h) => (
        <Hoja key={h.id} h={h} />
      ))}

      {ramo.tallos.map((t) => (
        <path
          key={t.id}
          className="tallo"
          d={t.d}
          pathLength="1"
          fill="none"
          stroke={t.color}
          strokeWidth={t.grosor}
          strokeLinecap="round"
          style={{ '--retraso': `${t.retraso}s` }}
        />
      ))}

      {ramo.hojasTallo.map((h) => (
        <Hoja key={h.id} h={h} />
      ))}

      {ramo.flores.map((f) => {
        const Dibujo = DIBUJO[f.tipo];
        return (
          <g key={f.id} transform={`translate(${f.ax} ${f.ay}) rotate(${f.rot})`}>
            <g className="brota" style={{ '--retraso': `${f.retraso}s` }}>
              <Dibujo f={f} />
            </g>
          </g>
        );
      })}

      <Envoltorio tema={ramo.tema} />
    </svg>
  );
}
