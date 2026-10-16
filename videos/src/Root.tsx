import { Composition, Still } from "remotion";
import { Ondas } from "./Ondas";
import { Tarjeta } from "./Tarjeta";

// Cada vídeo e imagen del portfolio, con su id (el que se pasa a "npx remotion render|still <id>")
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Ondas" component={Ondas} durationInFrames={300} fps={30} width={1280} height={720} />
      <Still id="Tarjeta" component={Tarjeta} width={1200} height={630} />
    </>
  );
};
