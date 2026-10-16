import { Composition } from "remotion";
import { Ondas } from "./Ondas";

// Cada vídeo del portfolio, con su id (el que se pasa a "npx remotion render <id>")
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Ondas" component={Ondas} durationInFrames={300} fps={30} width={1280} height={720} />
    </>
  );
};
