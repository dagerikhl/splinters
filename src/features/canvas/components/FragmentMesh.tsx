"use client";

import { EntityLabel } from "@/features/canvas/components/EntityLabel";
import { FractureBurst } from "@/features/canvas/components/FractureBurst";
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
const NEUTRAL_BASE_COLOR = "#e9efff";
const HOVER_MIX = 0.45;

export interface FragmentMeshProps {
  fragment: FragmentData;
  shard: IShard;
  parentShardId: string;
  partnerRestPosition?: THREE.Vector3;
}

const DAMP_LAMBDA = 4;

const hashAxis = (id: string): THREE.Vector3 => {
  let h = 2166136261;

  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  const r = (n: number) =>
    (((h = Math.imul(h ^ n, 0x85ebca6b)) >>> 0) & 0xffff) / 0xffff - 0.5;

  return new THREE.Vector3(r(1), r(2), r(3)).normalize();
};

export const FragmentMesh = ({
  fragment,
  shard,
  parentShardId,
  partnerRestPosition,
}: FragmentMeshProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const outerMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const scratchScaleRef = useRef(new THREE.Vector3());
  const scratchRestRef = useRef(new THREE.Vector3());
  const scratchColorRef = useRef(new THREE.Color());
  const scratchHoverRef = useRef(new THREE.Color("#ffd9a8"));
  const displayedParentProgressRef = useRef(0);
  const displayedOwnProgressRef = useRef(0);
  const displayedCombineProgressRef = useRef(0);
  const displayedScaleRef = useRef(1);
  const labelOpacityRef = useRef(0);
  const tumbleAxisRef = useRef<THREE.Vector3 | null>(null);

  if (tumbleAxisRef.current == null) {
    tumbleAxisRef.current = hashAxis(shard.id);
  }

  const tumbleSpeedRef = useRef(0.15 + ((shard.shape.seed * 0.07) % 0.3));

  const [isHovered, setIsHovered] = useState(false);

  const target = useMemo(
    () => ({ category: SplinterCategory.Shard, id: shard.id }),
    [shard.id],
  );

  const isActive = useSplintersStore((s) =>
    isSameSplinter(s.selectedSplinter, target),
  );

  useCursor(isHovered);

  const baseColor = useMemo(
    () =>
      // Less neutral blending so shard tints come through as real jewel tones
      // instead of washing out toward white.
      new THREE.Color(NEUTRAL_BASE_COLOR).lerp(
        new THREE.Color(shard.color ?? NEUTRAL_BASE_COLOR),
        shard.color ? 0.88 : 0,
      ),
    [shard.color],
  );

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    const outer = outerMaterialRef.current as THREE.MeshPhysicalMaterial | null;

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

    displayedCombineProgressRef.current = THREE.MathUtils.damp(
      displayedCombineProgressRef.current,
      own.combineProgress,
      DAMP_LAMBDA,
      delta,
    );

    let restTarget: THREE.Vector3 = fragment.restPosition;

    if (partnerRestPosition && displayedCombineProgressRef.current > 0.001) {
      const midpoint = scratchRestRef.current.lerpVectors(
        fragment.restPosition,
        partnerRestPosition,
        0.5,
      );

      const combined = midpoint
        .clone()
        .lerpVectors(
          fragment.restPosition,
          midpoint,
          displayedCombineProgressRef.current,
        );

      restTarget = combined;
    }

    mesh.position.lerpVectors(
      fragment.homePosition,
      restTarget,
      displayedParentProgressRef.current,
    );

    const tumbleAxis = tumbleAxisRef.current;

    if (tumbleAxis) {
      mesh.rotateOnAxis(
        tumbleAxis,
        delta *
          tumbleSpeedRef.current *
          THREE.MathUtils.smoothstep(
            displayedParentProgressRef.current,
            0.3,
            0.9,
          ),
      );
    }

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
    const combineDisplayed = displayedCombineProgressRef.current;
    const fadeIn = THREE.MathUtils.smoothstep(parentDisplayed, 0.4, 0.8);
    const fadeForCombine = 1 - combineDisplayed;
    const opacity = fadeIn * fadeForCombine;
    const dimMultiplier = 1 - 0.55 * ownDisplayed;

    outer.opacity = opacity;
    outer.transparent = opacity < 0.999;

    mesh.visible = opacity > 0.01;

    const color = scratchColorRef.current
      .copy(baseColor)
      .multiplyScalar(dimMultiplier);

    if (isHovered) {
      color.lerp(scratchHoverRef.current, HOVER_MIX);
    }

    outer.color.copy(color);

    // Subtle inner-tint emissive (just enough to keep deeply shadowed facets
    // from going pitch-black) plus a strong glow when the shard self-splinters.
    outer.emissive.copy(baseColor);
    outer.emissiveIntensity = 0.1 * dimMultiplier + 1.5 * ownDisplayed;

    const targetLabelOpacity =
      fadeIn * fadeForCombine * (isHovered || isActive ? 1 : 0.65);

    labelOpacityRef.current = THREE.MathUtils.damp(
      labelOpacityRef.current,
      targetLabelOpacity,
      6,
      delta,
    );
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

    if (displayedCombineProgressRef.current > SELECT_THRESHOLD) {
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

    if (displayedCombineProgressRef.current > SELECT_THRESHOLD) {
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
      visible={false}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <FractureBurst
        shardId={shard.id}
        color={shard.color ?? "#ff9a4a"}
        glowColor="#ffb86b"
        maxIntensity={8}
        maxDistance={6}
      />
      <EntityLabel
        name={shard.name}
        opacityRef={labelOpacityRef}
        offset={[0, 0.85, 0]}
        size="0.72rem"
        color={shard.color ?? "#f4f6ff"}
      />
      <meshPhysicalMaterial
        ref={outerMaterialRef}
        color={NEUTRAL_BASE_COLOR}
        emissive={NEUTRAL_BASE_COLOR}
        emissiveIntensity={0}
        roughness={0.35}
        metalness={0.25}
        clearcoat={0.65}
        clearcoatRoughness={0.12}
        reflectivity={0.5}
        flatShading
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
