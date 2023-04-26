"use client";

import { Shard } from "@/features/canvas/components/Shard";
import { useSplintersApi } from "@/features/cms/hooks/useSplintersApi";
import { Canvas as RTFCanvas } from "@react-three/fiber";

export const Canvas = () => {
  const { data } = useSplintersApi();

  const adonalsium =
    // TODO Why do I have to use this format? This shouldn't be necessary (?. should be sufficient)
    data?.splinters && data.splinters.find(({ id }) => id === "adonalsium");

  // TODO Remove
  console.log("Canvas::data:", { data, adonalsium });

  return (
    <RTFCanvas>
      <ambientLight />
      <pointLight />

      {/* TODO Replace with Adonalsium component when made */}
      {adonalsium && <Shard splinter={adonalsium} position={[0, 2, 0]} />}

      {adonalsium?.splinters?.map((splinter, i) => (
        <Shard
          key={splinter.id}
          splinter={splinter}
          position={[-3 + i * 0.4, -(i % 2) * 1.5, 0]}
        />
      ))}
    </RTFCanvas>
  );
};
