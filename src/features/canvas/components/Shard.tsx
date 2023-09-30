"use client";

import { cardinalToCirclePoint } from "@/common/utils/geometry";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { IShard } from "@/features/cms/shards/types/IShard";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import {
  getSplinterTarget,
  isSameSplinter,
} from "@/features/splinters/utils/targets";
import { a, easings, useSpring } from "@react-spring/three";
import { useCursor } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import THREE, { Vector3 } from "three";

const SEL_SCALE = [1, 1.5];
const HOV_COLOR = ["#ffa500", "#ff69b4"];

interface OwnProps {
  shard: IShard;
  baseScale?: number;
}

export type ShardProps = OwnProps &
  Omit<ThreeElements["mesh"], "children" | "scale">;

export const Shard = ({
  shard,
  baseScale = 1,
  onClick,
  onPointerOver,
  onPointerOut,
  ...rest
}: ShardProps) => {
  const { selectedSplinter, onSelectSplinter, getSplinterState } =
    useSplintersContext();

  const { data } = useShardsApi();

  const state = getSplinterState(shard);

  const isActive = useMemo(
    () => isSameSplinter(selectedSplinter, shard),
    [selectedSplinter, shard],
  );
  const [isHovered, setIsHovered] = useState(false);

  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) =>
    mesh.current ? (mesh.current.rotation.y += delta) : 0,
  );

  useCursor(isHovered);

  const getScale = useCallback(
    (isActive: boolean) => baseScale * SEL_SCALE[isActive ? 1 : 0],
    [baseScale],
  );

  const [springs, api] = useSpring(() => ({
    color: HOV_COLOR[0],
    scale: getScale(isActive),
    config: (key) => {
      switch (key) {
        default:
          return { duration: 180, easing: easings.easeInOutSine };
      }
    },
  }));

  useEffect(() => {
    if (isActive) {
      return;
    }

    api.start({ scale: getScale(false) });
  }, [api, getScale, isActive]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    api.start({ scale: getScale(!isActive) });

    onSelectSplinter(isActive ? undefined : getSplinterTarget(shard));

    onClick?.(event);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    setIsHovered(true);

    api.start({ color: HOV_COLOR[1] });

    onPointerOver?.(event);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    setIsHovered(false);

    api.start({ color: HOV_COLOR[0] });

    onPointerOut?.(event);
  };

  return (
    <>
      {/* TODO Fix excessive deep TS typing */}
      <a.mesh
        ref={mesh}
        scale={springs.scale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        {...rest}
      >
        <boxGeometry />
        <a.meshStandardMaterial
          color={springs.color}
          transparent={true}
          opacity={state?.isSplintered ? 0.5 : 1}
        />
      </a.mesh>

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
