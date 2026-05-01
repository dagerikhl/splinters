"use client";

import { cardinalToCirclePoint } from "@/common/utils/geometry";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { IShard } from "@/features/cms/shards/types/IShard";
import {
  useSplinterState,
  useSplintersStore,
} from "@/features/splinters/store/splintersStore";
import {
  getSplinterTarget,
  isSameSplinter,
} from "@/features/splinters/utils/targets";
import { a, easings, Transition, useSpring } from "@react-spring/three";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const DEFAULT_SPR_CONFIG = { duration: 400, easing: easings.easeInOutSine };
const DEFAULT_TRA_CONFIG = { duration: 800, easing: easings.easeInOutElastic };

const SEL_SCALE = [1, 1.5];
const HOV_COLOR = ["#fff195", "#ffc9c9"];
const OPC_SPLINT = [1, 0.5];

export interface ShardProps {
  shard: IShard;
  baseScale?: number;
  position?: THREE.Vector3;
}

export const Shard = ({ shard, baseScale = 1, position }: ShardProps) => {
  const selectedSplinter = useSplintersStore((s) => s.selectedSplinter);
  const selectSplinter = useSplintersStore((s) => s.selectSplinter);

  const { data } = useShardsApi();

  const state = useSplinterState(shard);

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
          return DEFAULT_SPR_CONFIG;
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
      .map((shardSplinterId) =>
        data?.shards.find(({ id }) => id === shardSplinterId),
      )
      .filter((x): x is IShard => !!x);

  const handleClick = () => {
    selectSplinter(isActive ? undefined : getSplinterTarget(shard));
  };

  const handlePointerOver = () => {
    setIsHovered(true);
  };

  const handlePointerOut = () => {
    setIsHovered(false);

    api.start({ color: HOV_COLOR[0] });
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
        <tetrahedronGeometry args={[1, 2]} />

        <a.meshStandardMaterial
          flatShading
          roughness={0.4}
          transparent
          color={springs.color}
          opacity={springs.opacity}
        />
      </a.mesh>

      <pointLight intensity={0.1} decay={0.4} position={position} />

      {splinters?.map((shardSplinter, i, arr) => {
        const originVector = position ?? new THREE.Vector3();
        const originPosition = originVector.toArray();

        return (
          <Transition
            key={shardSplinter.id}
            items={state?.isSplintered ? shardSplinter : undefined}
            config={DEFAULT_TRA_CONFIG}
            from={{
              position: originPosition,
            }}
            enter={{
              position: cardinalToCirclePoint(
                originVector.add(new THREE.Vector3(0, 8, 3)),
                "z",
                (360 * -i) / arr.length,
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
