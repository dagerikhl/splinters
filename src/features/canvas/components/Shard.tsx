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
import { MeshProps, ThreeEvent, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SEL_SCALE = [1, 1.5];
const HOV_COLOR = ["#ffa500", "#ff69b4"];
const OPC_SPLINT = [1, 0.5];

interface OwnProps {
  shard: IShard;
  show?: boolean;
  position?: THREE.Vector3;
  targetPosition?: THREE.Vector3;
  baseScale?: number;
}

export type ShardProps = OwnProps &
  Pick<MeshProps, "onClick" | "onPointerOver" | "onPointerOut">;

export const Shard = ({
  shard,
  show = true,
  position,
  targetPosition,
  baseScale = 1,
  onClick,
  onPointerOver,
  onPointerOut,
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

  useFrame((_state, delta) =>
    mesh.current ? (mesh.current.rotation.y += delta) : 0,
  );

  useCursor(isHovered);

  const getScale = useCallback(
    (isActive: boolean) => baseScale * SEL_SCALE[isActive ? 1 : 0],
    [baseScale],
  );

  const [springs, api] = useSpring(() => ({
    color: HOV_COLOR[0],
    opacity: show ? 1 : 0,
    position: position?.toArray([]) ?? [0, 0, 0],
    scale: getScale(isActive),

    config: (key) => {
      switch (key) {
        default:
          return { duration: 180, easing: easings.easeInOutSine };
      }
    },
  }));

  // Active effect
  useEffect(() => {
    api.start({ scale: getScale(isActive) });
  }, [api, getScale, isActive]);

  // Hover effect
  useEffect(() => {
    api.start({ color: HOV_COLOR[isHovered ? 1 : 0] });
  }, [api, isHovered]);

  // Splinter effect
  useEffect(() => {
    api.start({ opacity: OPC_SPLINT[state?.isSplintered ? 1 : 0] });
  }, [api, state?.isSplintered]);

  // Splinter for splinters effect
  useEffect(() => {
    if (show && targetPosition) {
      api.start({ opacity: 1, position: targetPosition.toArray([]) });

      return;
    }

    if (!show) {
      api.start({ opacity: 0, position: position?.toArray([]) ?? [0, 0, 0] });

      return;
    }
  }, [api, position, targetPosition, show]);

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

    api.start({ color: HOV_COLOR[0] });

    onPointerOut?.(event);
  };

  return (
    <>
      <a.mesh
        ref={mesh}
        position={springs.position?.to((x, y, z) => [x, y, z])}
        scale={springs.scale}
        onClick={show ? handleClick : undefined}
        onPointerOver={show ? handlePointerOver : undefined}
        onPointerOut={show ? handlePointerOut : undefined}
      >
        <boxGeometry />
        {/* TODO Fix: TS2589: Type instantiation is excessively deep and possibly infinite */}
        {/* @ts-ignore */}
        <a.meshStandardMaterial
          color={springs.color}
          transparent={true}
          opacity={springs.opacity}
        />
      </a.mesh>

      {shard.splitsInto &&
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
              show={!!state?.isSplintered}
              position={springs.position
                ?.to((x, y, z) => new THREE.Vector3(x, y, z))
                .get()}
              targetPosition={cardinalToCirclePoint(
                new THREE.Vector3(0, 6, 3),
                "z",
                (360 * i) / arr.length,
              )}
            />
          );
        })}
    </>
  );
};
