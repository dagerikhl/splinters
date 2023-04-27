"use client";

import { Shard } from "@/features/canvas/components/Shard";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { Canvas as RTFCanvas } from "@react-three/fiber";

export const Canvas = () => {
  const { data } = useShardsApi();

  const adonalsium = data?.shards.find(({ id }) => id === "adonalsium");

  // TODO Remove
  console.log("Canvas::data:", { data, adonalsium });

  return (
    <RTFCanvas>
      <ambientLight />
      <pointLight />

      {/* TODO Replace with Adonalsium component when made */}
      {adonalsium && <Shard shard={adonalsium} position={[0, 2, 0]} />}

      {adonalsium?.splitsInto?.map((id, i) => {
        const shard = data?.shards.find((shard) => shard.id === id);

        if (!shard) {
          return null;
        }

        return (
          <Shard
            key={id}
            shard={shard}
            position={[-3 + i * 0.4, -(i % 2) * 1.5, 0]}
          />
        );
      })}
    </RTFCanvas>
  );
};
