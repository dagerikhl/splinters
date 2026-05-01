"use client";

import { COSMERE_DATA } from "@/features/cms/cosmere/data";
import { IDawnshard } from "@/features/cms/cosmere/types";
import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface DawnshardGlyphProps {
  dawnshard: IDawnshard;
  index: number;
  count: number;
}

const DawnshardGlyph = ({ dawnshard, index, count }: DawnshardGlyphProps) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const baseAngleRef = useRef((index / count) * Math.PI * 2);

  useFrame((state) => {
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
  });

  const isRevealed = dawnshard.revealed;

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color={isRevealed ? "#fff7d2" : "#5a6070"}
        emissive={isRevealed ? "#ffb84d" : "#1f2533"}
        emissiveIntensity={isRevealed ? 1.4 : 0.4}
        roughness={0.2}
        metalness={0.6}
        toneMapped={false}
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
