import { Shard } from "@/features/canvas/components/Shard";
import { useSplintersApi } from "@/features/cms/hooks/useSplintersApi";
import { Canvas as RTFCanvas } from "@react-three/fiber";

export const Canvas = () => {
  // TODO Impl. some way to get and alter CMS content, consider state vs. (initial) data (Sanity? Hygraph?)
  const { data } = useSplintersApi();

  const adonalsium = data?.splinters && data.splinters.find(({ id }) => id === "adonalsium");

  // TODO Remove
  console.log("Canvas::data:", { data, adonalsium });

  if (!adonalsium) {
    return null;
  }

  return (
    <RTFCanvas>
      <ambientLight />
      <pointLight />

      {/* TODO Replace with Adonalsium component when made */}
      <Shard position={[0, 3, 0]} />

      {adonalsium.splinters?.map((shard, i) => (
        <Shard key={shard.id} position={[-3 + i * 0.4, -(i % 2) * 2, 0]} />
      ))}
    </RTFCanvas>
  );
};
