import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Clips de las tarjetas de Projects, hechos con grabaciones reales de cada app (grabaciones/grabar.mjs).
// Se renderizan con --public-dir=grabaciones: las grabaciones en bruto no van a la web, solo el clip final.
const FUNDIDO = 12; // fotogramas de fundido a negro al principio y al final: el bucle no salta

const Fundido: React.FC<{ children: React.ReactNode; fondo: string }> = ({ children, fondo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacidad = interpolate(frame, [0, FUNDIDO, durationInFrames - FUNDIDO, durationInFrames - 1], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ backgroundColor: fondo }}>
      <AbsoluteFill style={{ opacity: opacidad }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Todo App y Snake: la grabación desde el segundo `desde`, acercada `zoom` veces al centro (la Todo App
// ocupa poco del encuadre y en la tarjeta se vería pequeña)
export const Pantalla: React.FC<{ archivo: string; desde: number; zoom?: number }> = ({ archivo, desde, zoom = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Fundido fondo="#1d1d1d">
      <OffthreadVideo src={staticFile(archivo)} trimBefore={Math.round(desde * fps)} muted style={{ transform: `scale(${zoom})` }} />
    </Fundido>
  );
};

// Sushi Tracker: sus dos modos lado a lado, como dos móviles, igual que la captura de la tarjeta
const ALTO_MOVIL = 600;
const ANCHO_MOVIL = Math.round((390 / 844) * ALTO_MOVIL);

const Movil: React.FC<{ archivo: string; desde: number }> = ({ archivo, desde }) => {
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        width: ANCHO_MOVIL,
        height: ALTO_MOVIL,
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 30px 60px -20px rgba(0,0,0,0.6)",
      }}
    >
      <OffthreadVideo
        src={staticFile(archivo)}
        trimBefore={Math.round(desde * fps)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

// Yo pago lo mío: a la izquierda se apuntan platos en la carta y a la derecha se paga y salen las
// transferencias. Grabaciones de la app publicada en su propio repo (pedromiras.github.io/yo-pago-lo-mio/)
export const YoPagoDemo: React.FC = () => (
  <Fundido fondo="#111317">
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 48 }}>
      <Movil archivo="yopago-carta.mp4" desde={7.5} />
      <Movil archivo="yopago-pagar.mp4" desde={8.3} />
    </AbsoluteFill>
  </Fundido>
);

export const SushiDemo: React.FC = () => (
  <Fundido fondo="#0b1120">
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 48 }}>
      <Movil archivo="sushi-solo.mp4" desde={2.7} />
      <Movil archivo="sushi-duelo.mp4" desde={3.3} />
    </AbsoluteFill>
  </Fundido>
);
