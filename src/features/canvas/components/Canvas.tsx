import { Box } from "@/features/canvas/components/Box";
import { useSplintersApi } from "@/features/cms/hooks/useSplintersApi";
import { Canvas as RTFCanvas } from "@react-three/fiber";

export const Canvas = () => {
  // TODO Impl. some way to get and alter CMS content, consider state vs. (initial) data
  const { data } = useSplintersApi();

  console.log("Canvas::data:", data);

  return (
    <RTFCanvas>
      <ambientLight />
      <pointLight />

      {/* TODO Replace with real content */}
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </RTFCanvas>
  );
};
