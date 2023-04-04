import { Box } from "@/features/canvas/components/Box";
import { Canvas as RTFCanvas } from "@react-three/fiber";

export const Canvas = () => (
  <RTFCanvas>
    <ambientLight />
    <pointLight />

    {/* TODO Replace with real content */}
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
  </RTFCanvas>
);
