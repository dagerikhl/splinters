"use client";

import { COSMERE_DATA } from "@/features/cms/cosmere/data";
import { IAether } from "@/features/cms/cosmere/types";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { isSameSplinter } from "@/features/splinters/utils/targets";
import { useCursor } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ANCHOR_POSITION = new THREE.Vector3(-10, 1, -2);

const AetherOrb = ({ aether, index }: { aether: IAether; index: number }) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const phaseRef = useRef(index * 1.7);
  const scratchScaleRef = useRef(new THREE.Vector3());
  const [isHovered, setIsHovered] = useState(false);

  const target = useMemo(
    () => ({ category: SplinterCategory.Aether, id: aether.id }),
    [aether.id],
  );

  const isActive = useSplintersStore((s) =>
    isSameSplinter(s.selectedSplinter, target),
  );

  useCursor(isHovered);

  useFrame((state) => {
    const mesh = meshRef.current;

    if (!mesh) return;

    const t = state.clock.elapsedTime;
    const phase = phaseRef.current;

    const angleH = t * 0.18 + phase;
    const angleV = t * 0.21 + phase * 1.3;
    const angleD = t * 0.16 + phase * 0.7;

    mesh.position.set(
      Math.cos(angleH) * 1.4 + Math.sin(phase * 2.3) * 0.6,
      Math.sin(angleV) * 0.9 + Math.cos(phase * 1.7) * 0.8,
      Math.cos(angleD) * 1.4,
    );

    const s = isActive || isHovered ? 1.4 : 1;

    mesh.scale.copy(scratchScaleRef.current.set(s, s, s));
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

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.28, 16, 16]} />
      <meshStandardMaterial
        color={aether.color}
        emissive={aether.color}
        emissiveIntensity={1.6}
        toneMapped={false}
      />
    </mesh>
  );
};

export const Aethers = () => {
  return (
    <group position={ANCHOR_POSITION}>
      {COSMERE_DATA.aethers.map((aether, i) => (
        <AetherOrb key={aether.id} aether={aether} index={i} />
      ))}
    </group>
  );
};
