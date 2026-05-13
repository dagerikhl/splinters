"use client";

import { EntityLabel } from "@/features/canvas/components/EntityLabel";
import { COSMERE_DATA } from "@/features/cms/cosmere/data";
import { IDawnshard } from "@/features/cms/cosmere/types";
import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { isSameSplinter } from "@/features/splinters/utils/targets";
import { useCursor } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface DawnshardGlyphProps {
  dawnshard: IDawnshard;
  index: number;
  count: number;
}

const DawnshardGlyph = ({ dawnshard, index, count }: DawnshardGlyphProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const baseAngleRef = useRef((index / count) * Math.PI * 2);
  const scratchScaleRef = useRef(new THREE.Vector3());
  const labelOpacityRef = useRef(0.5);
  const [isHovered, setIsHovered] = useState(false);

  const target = useMemo(
    () => ({ category: SplinterCategory.Dawnshard, id: dawnshard.id }),
    [dawnshard.id],
  );

  const isActive = useSplintersStore((s) =>
    isSameSplinter(s.selectedSplinter, target),
  );

  useCursor(isHovered);

  useFrame((state, delta) => {
    const mesh = meshRef.current;

    if (!mesh) return;

    const t = state.clock.elapsedTime;
    const { time, manualSplinters } = useSplintersStore.getState();
    const adonalsium = getSplinterStateAt({
      shardId: "adonalsium",
      time,
      manualSplinters,
    });

    const progress = adonalsium.splinterProgress;
    const x = (progress - 0.5) * 5;
    const compression = Math.exp(-x * x);

    const baseRadius = THREE.MathUtils.lerp(5, 13, progress);
    const radius = baseRadius * (1 - compression * 0.85);

    const angle = baseAngleRef.current + t * 0.08;

    mesh.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 0.5 + index) * 2,
      Math.sin(angle) * radius,
    );

    mesh.rotation.y = t * 0.6 + index;
    mesh.rotation.x = t * 0.4;

    const s = isActive || isHovered ? 1.4 : 1;

    mesh.scale.copy(scratchScaleRef.current.set(s, s, s));

    labelOpacityRef.current = THREE.MathUtils.damp(
      labelOpacityRef.current,
      isHovered || isActive ? 1 : 0.5,
      6,
      delta,
    );
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    useSplintersStore.getState().selectSplinter(isActive ? undefined : target);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
  };

  const isRevealed = dawnshard.revealed;

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color={isRevealed ? "#fff7d2" : "#5a6070"}
        emissive={isRevealed ? "#ffb84d" : "#1f2533"}
        emissiveIntensity={isRevealed ? 1.4 : 0.4}
        roughness={0.2}
        metalness={0.6}
        toneMapped={false}
      />
      <EntityLabel
        name={dawnshard.name}
        opacityRef={labelOpacityRef}
        offset={[0, 0.65, 0]}
        size="0.66rem"
        color={isRevealed ? "#ffd28a" : "#8b95a8"}
      />
    </mesh>
  );
};

export const Dawnshards = () => {
  const dawnshards = COSMERE_DATA.dawnshards;

  return (
    <group>
      {dawnshards.map((d, i) => (
        <DawnshardGlyph
          key={d.id}
          dawnshard={d}
          index={i}
          count={dawnshards.length}
        />
      ))}
    </group>
  );
};
