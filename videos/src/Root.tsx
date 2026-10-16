import { Composition, Still } from "remotion";
import { Pantalla, SushiDemo } from "./Demos";
import { Ondas } from "./Ondas";
import { Tarjeta } from "./Tarjeta";

// Cada vídeo e imagen del portfolio, con su id (el que se pasa a "npx remotion render|still <id>")
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Ondas" component={Ondas} durationInFrames={300} fps={30} width={1280} height={720} />
      {/* Clips de Projects: se renderizan con --public-dir=grabaciones (ver README) */}
      <Composition id="TodoDemo" component={Pantalla} defaultProps={{ archivo: "todo.mp4", desde: 0.2, zoom: 1.45 }} durationInFrames={378} fps={30} width={1280} height={720} />
      <Composition id="SnakeDemo" component={Pantalla} defaultProps={{ archivo: "snake.mp4", desde: 0.3 }} durationInFrames={342} fps={30} width={1280} height={720} />
      <Composition id="SushiDemo" component={SushiDemo} durationInFrames={198} fps={30} width={1280} height={720} />
      <Still id="Tarjeta" component={Tarjeta} width={1200} height={630} />
    </>
  );
};
