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
const OUTER_BASE_COLOR = "#e9efff";
const OUTER_HOVER_COLOR = "#ffd9a8";
const INNER_EMISSIVE_COLOR = "#ff7a3a";

export interface FragmentMeshProps {
  fragment: FragmentData;
  shard: IShard;
  parentShardId: string;
}

const DAMP_LAMBDA = 4;

export const FragmentMesh = ({
  fragment,
  shard,
  parentShardId,
}: FragmentMeshProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const outerMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const scratchScaleRef = useRef(new THREE.Vector3());
  const displayedParentProgressRef = useRef(0);
  const displayedOwnProgressRef = useRef(0);
  const displayedScaleRef = useRef(1);

  const [isHovered, setIsHovered] = useState(false);

  const target = useMemo(
    () => ({ category: SplinterCategory.Shard, id: shard.id }),
    [shard.id],
  );

  const isActive = useSplintersStore((s) =>
    isSameSplinter(s.selectedSplinter, target),
  );

  useCursor(isHovered);

  const innerMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    const outer = outerMaterialRef.current;
    const inner = innerMaterialRef.current;

    if (!mesh || !outer || !inner) return;

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

    displayedParentProgressRef.current = THREE.MathUtils.damp(
      displayedParentProgressRef.current,
      parent.splinterProgress,
      DAMP_LAMBDA,
      delta,
    );

    displayedOwnProgressRef.current = THREE.MathUtils.damp(
      displayedOwnProgressRef.current,
      own.splinterProgress,
      DAMP_LAMBDA,
      delta,
    );

    mesh.position.lerpVectors(
      fragment.homePosition,
      fragment.restPosition,
      displayedParentProgressRef.current,
    );

    const targetScale = isActive ? 1.15 : 1;

    displayedScaleRef.current = THREE.MathUtils.damp(
      displayedScaleRef.current,
      targetScale,
      8,
      delta,
    );

    const s = displayedScaleRef.current;

    mesh.scale.copy(scratchScaleRef.current.set(s, s, s));

    const ownDisplayed = displayedOwnProgressRef.current;
    const parentDisplayed = displayedParentProgressRef.current;
    const fadeIn = THREE.MathUtils.smoothstep(parentDisplayed, 0.4, 0.8);
    const opacity = fadeIn * (1 - 0.6 * ownDisplayed);

    outer.opacity = opacity;
    outer.transparent = opacity < 1;

    inner.opacity = opacity;
    inner.transparent = opacity < 1;

    mesh.visible = opacity > 0.01;

    const baseColor = isHovered ? OUTER_HOVER_COLOR : OUTER_BASE_COLOR;
    const dimMultiplier = 1 - 0.6 * ownDisplayed;

    outer.color.set(baseColor).multiplyScalar(dimMultiplier);

    inner.color.set(baseColor).multiplyScalar(dimMultiplier);
    inner.emissiveIntensity = 1.4 * ownDisplayed;
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
        roughness={0.25}
        metalness={0.5}
        flatShading
      />

      <meshStandardMaterial
        ref={innerMaterialRef}
        attach="material-1"
        color={OUTER_BASE_COLOR}
        emissive={INNER_EMISSIVE_COLOR}
        emissiveIntensity={0}
        roughness={0.5}
        metalness={0.2}
        flatShading
        toneMapped={false}
      />
    </mesh>
  );
};
