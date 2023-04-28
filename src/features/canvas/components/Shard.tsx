"use client";

import { IShard } from "@/features/cms/shards/types/IShard";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import {
  getSplinterTarget,
  isSameSplinter,
} from "@/features/splinters/utils/targets";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { useRef, useState } from "react";
import THREE from "three";

interface OwnProps {
  shard: IShard;
  baseScale?: number;
}

export type ShardProps = OwnProps & ThreeElements["mesh"];

export const Shard = ({
  shard,
  baseScale = 1,
  scale,
  onClick,
  onPointerOver,
  onPointerOut,
  children,
  ...rest
}: ShardProps) => {
  const { selectedSplinter, onSelectSplinter } = useSplintersContext();

  const isActive = isSameSplinter(selectedSplinter, shard);

  const mesh = useRef<THREE.Mesh>(null!);

  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => (mesh.current.rotation.y += delta));

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    onSelectSplinter(isActive ? undefined : getSplinterTarget(shard));

    onClick?.(event);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    setIsHovered(true);

    onPointerOver?.(event);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    setIsHovered(false);

    onPointerOut?.(event);
  };

  return (
    <mesh
      ref={mesh}
      scale={scale ?? baseScale * (isActive ? 1.5 : 1)}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      {...rest}
    >
      {children ?? (
        <>
          <boxGeometry />
          <meshStandardMaterial color={isHovered ? "hotpink" : "orange"} />
        </>
      )}
    </mesh>
  );
};
