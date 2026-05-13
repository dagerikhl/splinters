"use client";

import { EntityLabel } from "@/features/canvas/components/EntityLabel";
import { findCombination } from "@/features/cms/cosmere/combinations";
import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { isSameSplinter } from "@/features/splinters/utils/targets";
import { useCursor } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const DAMP_LAMBDA = 4;
const SELECT_THRESHOLD = 0.5;

export interface CombinedShardProps {
  combinationId: string;
  shardAId: string;
  shardBId: string;
  midpoint: THREE.Vector3;
  outerColor: string;
  emissiveColor: string;
}

export const CombinedShard = ({
  combinationId,
  shardAId,
  shardBId,
  midpoint,
  outerColor,
  emissiveColor,
}: CombinedShardProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const displayedProgressRef = useRef(0);
  const labelOpacityRef = useRef(0);
  const scratchScaleRef = useRef(new THREE.Vector3());
  const [isHovered, setIsHovered] = useState(false);

  const combinationName = findCombination(combinationId)?.name ?? combinationId;

  const target = useMemo(
    () => ({ category: SplinterCategory.Shard, id: combinationId }),
    [combinationId],
  );

  const isActive = useSplintersStore((s) =>
    isSameSplinter(s.selectedSplinter, target),
  );

  useCursor(isHovered);

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

    const baseScale = 0.6 + p * 1.2;
    const s = isActive ? baseScale * 1.15 : baseScale;

    mesh.scale.copy(scratchScaleRef.current.set(s, s, s));

    mesh.rotation.y += delta * 0.2;
    mesh.rotation.x += delta * 0.1;

    material.opacity = p;
    material.transparent = p < 1;
    material.emissiveIntensity = 0.3 + 1.4 * p;

    labelOpacityRef.current = THREE.MathUtils.damp(
      labelOpacityRef.current,
      p,
      DAMP_LAMBDA,
      delta,
    );
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (displayedProgressRef.current < SELECT_THRESHOLD) return;

    event.stopPropagation();
    useSplintersStore.getState().selectSplinter(isActive ? undefined : target);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (displayedProgressRef.current < SELECT_THRESHOLD) return;

    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
  };

  return (
    <mesh
      ref={meshRef}
      visible={false}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
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
      <EntityLabel
        name={combinationName}
        opacityRef={labelOpacityRef}
        offset={[0, 2.0, 0]}
        size="1rem"
        color={emissiveColor}
      />
    </mesh>
  );
};
