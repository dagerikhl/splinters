"use client";

import { usePinataFragments } from "@/features/canvas/fracture/usePinataFragments";
import { IShard } from "@/features/cms/cosmere/types";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { isSameSplinter } from "@/features/splinters/utils/targets";
import { useCursor } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";

export interface OctahedronShardProps {
  shard: IShard;
  position?: THREE.Vector3;
  radius?: number;
  outerColor?: string;
  innerColor?: string;
}

export const OctahedronShard = ({
  shard,
  position,
  radius = 2,
  outerColor,
  innerColor,
}: OctahedronShardProps) => {
  const selectedSplinter = useSplintersStore((s) => s.selectedSplinter);
  const selectSplinter = useSplintersStore((s) => s.selectSplinter);

  const target = { category: SplinterCategory.Shard, id: shard.id };
  const isActive = isSameSplinter(selectedSplinter, target);

  const { fragments, outerMaterial, innerMaterial } = usePinataFragments({
    seed: shard.shape.seed,
    fragmentCount: 16,
    radius,
    outerColor,
    innerColor,
  });

  const [isHovered, setIsHovered] = useState(false);

  useCursor(isHovered);

  const handleClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    selectSplinter(isActive ? undefined : target);
  };

  return (
    <group
      position={position}
      scale={isActive ? 1.15 : 1}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      {fragments.map((fragment, i) => (
        <mesh
          key={i}
          geometry={fragment.geometry}
          material={[outerMaterial, innerMaterial]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
};
