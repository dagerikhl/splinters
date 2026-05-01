"use client";

import { FragmentData } from "@/features/canvas/fracture/usePinataFragments";
import { IShard } from "@/features/cms/cosmere/types";
import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { isSameSplinter } from "@/features/splinters/utils/targets";
import { useCursor } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SELECT_THRESHOLD = 0.5;
const OUTER_BASE_COLOR = "#fff195";
const OUTER_HOVER_COLOR = "#ffc9c9";
const INNER_COLOR = "#ffd5b3";

export interface FragmentMeshProps {
  fragment: FragmentData;
  shard: IShard;
  parentShardId: string;
}

export const FragmentMesh = ({
  fragment,
  shard,
  parentShardId,
}: FragmentMeshProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const outerMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const scratchScaleRef = useRef(new THREE.Vector3());

  const [isHovered, setIsHovered] = useState(false);

  const target = useMemo(
    () => ({ category: SplinterCategory.Shard, id: shard.id }),
    [shard.id],
  );

  const isActive = useSplintersStore((s) =>
    isSameSplinter(s.selectedSplinter, target),
  );

  useCursor(isHovered);

  useFrame(() => {
    const mesh = meshRef.current;
    const outer = outerMaterialRef.current;

    if (!mesh || !outer) return;

    const { time, manualSplinters } = useSplintersStore.getState();

    const parent = getSplinterStateAt({
      shardId: parentShardId,
      time,
      manualSplinters,
    });

    const own = getSplinterStateAt({
      shardId: shard.id,
      time,
      manualSplinters,
    });

    mesh.position.lerpVectors(
      fragment.homePosition,
      fragment.restPosition,
      parent.splinterProgress,
    );

    const targetScale = isActive ? 1.15 : 1;

    mesh.scale.lerp(
      scratchScaleRef.current.set(targetScale, targetScale, targetScale),
      0.15,
    );

    const opacity = 1 - 0.6 * own.splinterProgress;

    outer.opacity = opacity;
    outer.transparent = opacity < 1;

    const baseColor = isHovered ? OUTER_HOVER_COLOR : OUTER_BASE_COLOR;
    const dimMultiplier = 1 - 0.6 * own.splinterProgress;

    outer.color.set(baseColor).multiplyScalar(dimMultiplier);
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const { time, manualSplinters } = useSplintersStore.getState();

    const parent = getSplinterStateAt({
      shardId: parentShardId,
      time,
      manualSplinters,
    });

    if (parent.splinterProgress < SELECT_THRESHOLD) {
      return;
    }

    event.stopPropagation();
    useSplintersStore.getState().selectSplinter(isActive ? undefined : target);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const { time, manualSplinters } = useSplintersStore.getState();

    const parent = getSplinterStateAt({
      shardId: parentShardId,
      time,
      manualSplinters,
    });

    if (parent.splinterProgress < SELECT_THRESHOLD) {
      return;
    }

    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
  };

  return (
    <mesh
      ref={meshRef}
      geometry={fragment.geometry}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshStandardMaterial
        ref={outerMaterialRef}
        attach="material-0"
        color={OUTER_BASE_COLOR}
        roughness={0.4}
        flatShading
      />

      <meshStandardMaterial
        attach="material-1"
        color={INNER_COLOR}
        emissive={INNER_COLOR}
        emissiveIntensity={0}
        roughness={0.6}
        flatShading
        toneMapped={false}
      />
    </mesh>
  );
};
