"use client";

import { cardinalToCirclePoint } from "@/common/utils/geometry";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { IShard } from "@/features/cms/shards/types/IShard";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import {
  getSplinterTarget,
  isSameSplinter,
} from "@/features/splinters/utils/targets";
import { a, easings, Transition, useSpring } from "@react-spring/three";
import { useCursor } from "@react-three/drei";
import { MeshProps, ThreeEvent, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const DEFAULT_ANI_CONFIG = { duration: 180, easing: easings.easeInOutSine };

const SEL_SCALE = [1, 1.5];
const HOV_COLOR = ["#ffa500", "#ff69b4"];
const OPC_SPLINT = [1, 0.5];

interface OwnProps {
  shard: IShard;
  baseScale?: number;
  position?: THREE.Vector3;
}

export type ShardProps = OwnProps &
  Pick<MeshProps, "onClick" | "onPointerOver" | "onPointerOut">;

export const Shard = ({
  shard,
  baseScale = 1,

  position,
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
    opacity: OPC_SPLINT[0],
    scale: getScale(isActive),

    config: (key) => {
      switch (key) {
        default:
          return DEFAULT_ANI_CONFIG;
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

  const splinters =
    shard.splitsInto &&
    shard.splitsInto
      .map(
        (shardSplinterId) =>
          data?.shards.find(({ id }) => id === shardSplinterId),
      )
      .filter((x): x is IShard => !!x);

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
        position={position}
        scale={springs.scale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
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

      {splinters?.map((shardSplinter, i, arr) => {
        const originVector = position ?? new THREE.Vector3();
        const originPosition = originVector.toArray();

        return (
          <Transition
            key={shardSplinter.id}
            items={state?.isSplintered ? shardSplinter : undefined}
            config={DEFAULT_ANI_CONFIG}
            from={{
              position: originPosition,
            }}
            enter={{
              position: cardinalToCirclePoint(
                originVector.add(new THREE.Vector3(0, 6, 3)),
                "z",
                (360 * i) / arr.length,
              ).toArray(),
            }}
            leave={{
              position: originPosition,
            }}
          >
            {(styles) => (
              <Shard shard={shardSplinter} position={styles.position} />
            )}
          </Transition>
        );
      })}
    </>
  );
};
