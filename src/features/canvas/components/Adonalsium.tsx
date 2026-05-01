"use client";

import { OctahedronShard } from "@/features/canvas/components/OctahedronShard";
import { COSMERE_DATA } from "@/features/cms/cosmere/data";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Adonalsium = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={group}>
      <OctahedronShard shard={COSMERE_DATA.adonalsium} radius={2} />
    </group>
  );
};
