"use client";

import { EntityLabel } from "@/features/canvas/components/EntityLabel";
import { findShard } from "@/features/cms/cosmere/data";
import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const OUTER_BASE_COLOR = "#e9efff";
const INNER_EMISSIVE_COLOR = "#ff7a3a";
const DAMP_LAMBDA = 4;

export interface SolidOctahedronProps {
  shardId: string;
  radius?: number;
  detail?: number;
}

export const SolidOctahedron = ({
  shardId,
  radius = 3,
  detail = 2,
}: SolidOctahedronProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const displayedProgressRef = useRef(0);
  const labelOpacityRef = useRef(1);

  const shard = findShard(shardId);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material) return;

    const { time, manualSplinters } = useSplintersStore.getState();
    const own = getSplinterStateAt({ shardId, time, manualSplinters });

    displayedProgressRef.current = THREE.MathUtils.damp(
      displayedProgressRef.current,
      own.splinterProgress,
      DAMP_LAMBDA,
      delta,
    );

    const p = displayedProgressRef.current;
    const opacity = Math.max(0, 1 - p * 2);

    material.opacity = opacity;
    material.transparent = opacity < 1;
    material.emissiveIntensity = 1.5 * Math.min(1, p * 2);

    mesh.visible = opacity > 0.01;

    labelOpacityRef.current = THREE.MathUtils.damp(
      labelOpacityRef.current,
      opacity,
      DAMP_LAMBDA,
      delta,
    );
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[radius, detail]} />
      <meshStandardMaterial
        ref={materialRef}
        color={OUTER_BASE_COLOR}
        emissive={INNER_EMISSIVE_COLOR}
        emissiveIntensity={0}
        roughness={0.25}
        metalness={0.5}
        flatShading
        toneMapped={false}
      />
      {shard && (
        <EntityLabel
          name={shard.name}
          opacityRef={labelOpacityRef}
          offset={[0, radius + 0.6, 0]}
          size="1.15rem"
          color={shard.color ?? "#f4f6ff"}
        />
      )}
    </mesh>
  );
};
