"use client";

import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const DAMP_LAMBDA = 4;

export interface CombinedShardProps {
  shardAId: string;
  shardBId: string;
  midpoint: THREE.Vector3;
  outerColor: string;
  emissiveColor: string;
}

export const CombinedShard = ({
  shardAId,
  shardBId,
  midpoint,
  outerColor,
  emissiveColor,
}: CombinedShardProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const displayedProgressRef = useRef(0);
  const scratchScaleRef = useRef(new THREE.Vector3());

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material) return;

    const { time, manualSplinters } = useSplintersStore.getState();

    const stateA = getSplinterStateAt({
      shardId: shardAId,
      time,
      manualSplinters,
    });
    const stateB = getSplinterStateAt({
      shardId: shardBId,
      time,
      manualSplinters,
    });

    const target = Math.max(stateA.combineProgress, stateB.combineProgress);

    displayedProgressRef.current = THREE.MathUtils.damp(
      displayedProgressRef.current,
      target,
      DAMP_LAMBDA,
      delta,
    );

    const p = displayedProgressRef.current;

    mesh.visible = p > 0.02;

    if (!mesh.visible) return;

    mesh.position.copy(midpoint);

    const s = 0.6 + p * 1.2;

    mesh.scale.copy(scratchScaleRef.current.set(s, s, s));

    mesh.rotation.y += delta * 0.2;
    mesh.rotation.x += delta * 0.1;

    material.opacity = p;
    material.transparent = p < 1;
    material.emissiveIntensity = 0.3 + 1.4 * p;
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <octahedronGeometry args={[1.6, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color={outerColor}
        emissive={emissiveColor}
        emissiveIntensity={0}
        roughness={0.3}
        metalness={0.4}
        flatShading
        toneMapped={false}
      />
    </mesh>
  );
};
