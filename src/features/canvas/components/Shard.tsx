"use client";

import { cardinalToCirclePoint } from "@/common/utils/geometry";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { IShard } from "@/features/cms/shards/types/IShard";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import {
  getSplinterTarget,
  isSameSplinter,
} from "@/features/splinters/utils/targets";
import { useCursor } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { useRef, useState } from "react";
import THREE, { Vector3 } from "three";

interface OwnProps {
  shard: IShard;
  baseScale?: number;
}

export type ShardProps = OwnProps & Omit<ThreeElements["mesh"], "children">;

export const Shard = ({
  shard,
  baseScale = 1,
  scale,
  onClick,
  onPointerOver,
  onPointerOut,
  ...rest
}: ShardProps) => {
  const { selectedSplinter, onSelectSplinter, getSplinterState } =
    useSplintersContext();

  const { data } = useShardsApi();

  const state = getSplinterState(shard);

  const isActive = isSameSplinter(selectedSplinter, shard);

  const mesh = useRef<THREE.Mesh>(null);

  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) =>
    mesh.current ? (mesh.current.rotation.y += delta) : 0,
  );

  useCursor(isHovered);

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
    <>
      <mesh
        ref={mesh}
        scale={scale ?? baseScale * (isActive ? 1.5 : 1)}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        {...rest}
      >
        <boxGeometry />
        <meshStandardMaterial
          color={isHovered ? "hotpink" : "orange"}
          transparent={true}
          opacity={state?.isSplintered ? 0.5 : 1}
        />
      </mesh>

      {state?.isSplintered &&
        shard.splitsInto &&
        shard.splitsInto.length > 0 &&
        shard.splitsInto.map((shardSplinterId, i, arr) => {
          const shardSplinter = data?.shards.find(
            ({ id }) => id === shardSplinterId,
          );

          if (!shardSplinter) {
            return null;
          }

          return (
            <Shard
              key={shardSplinterId}
              shard={shardSplinter}
              position={cardinalToCirclePoint(
                new Vector3(0, 6, 2),
                "z",
                (360 * i) / arr.length,
              )}
            />
          );
        })}
    </>
  );
};
