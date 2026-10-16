import { loadFont as cargarGeist } from "@remotion/google-fonts/Geist";
import { loadFont as cargarInter } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Img, staticFile } from "remotion";

// Imagen que sale al pegar el enlace del portfolio (og:image, 1200x630): la portada de la web en una imagen.
// La foto se lee de la carpeta public/ del portfolio (remotion.config.ts), la misma que usa la web.
const { fontFamily: geist } = cargarGeist("normal", { weights: ["600"], subsets: ["latin"] });
const { fontFamily: inter } = cargarInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

const luz = (color: string, x: string, y: string, tamano: number) => ({
  position: "absolute" as const,
  left: x,
  top: y,
  width: tamano,
  height: tamano,
  transform: "translate(-50%, -50%)",
  background: `radial-gradient(closest-side, ${color}, transparent)`,
});

export const Tarjeta: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#090909", overflow: "hidden" }}>
      {/* Las tres luces de la aurora de la portada, quietas */}
      <div style={luz("rgba(106, 76, 245, 0.45)", "15%", "10%", 900)} />
      <div style={luz("rgba(212, 77, 240, 0.32)", "95%", "40%", 800)} />
      <div style={luz("rgba(255, 122, 61, 0.28)", "45%", "110%", 800)} />

      <Img
        src={staticFile("assets/img/portfolio-image.webp")}
        style={{
          position: "absolute",
          right: -40,
          top: 15,
          width: 600,
          height: 600,
          filter: "brightness(0.55)",
          maskImage: "radial-gradient(closest-side, #000 20%, transparent)",
        }}
      />

      <div style={{ position: "absolute", left: 80, top: 90, color: "#ffffff" }}>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 30, color: "#999999" }}>Hello, I’m</div>
        <div
          style={{
            fontFamily: geist,
            fontWeight: 600,
            fontSize: 168,
            lineHeight: 0.85,
            letterSpacing: "-0.06em",
            marginTop: 18,
          }}
        >
          Pedro
          <br />
          Miras
        </div>
        <div style={{ fontFamily: inter, fontSize: 34, color: "#999999", marginTop: 36 }}>Web Developer at NTT DATA</div>
      </div>

      <div style={{ position: "absolute", left: 80, bottom: 40, fontFamily: inter, fontWeight: 500, fontSize: 24, color: "#ffffff" }}>
        pedromiras.github.io
      </div>
    </AbsoluteFill>
  );
};
