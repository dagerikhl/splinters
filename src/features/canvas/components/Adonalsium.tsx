"use client";

import { FragmentMesh } from "@/features/canvas/components/FragmentMesh";
import { SolidOctahedron } from "@/features/canvas/components/SolidOctahedron";
import { usePinataFragments } from "@/features/canvas/fracture/usePinataFragments";
import { COSMERE_DATA, findShard } from "@/features/cms/cosmere/data";
import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { isSameSplinter } from "@/features/splinters/utils/targets";
import { useCursor } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SELECT_THRESHOLD = 0.5;

export const Adonalsium = () => {
  const adonalsium = COSMERE_DATA.adonalsium;

  const { fragments } = usePinataFragments({
    seed: adonalsium.shape.seed,
    fragmentCount: 16,
    radius: 3,
    restRadius: 9,
  });

  const childShards = useMemo(
    () =>
      (adonalsium.splitsInto ?? []).map((id) => findShard(id)).filter(Boolean),
    [adonalsium.splitsInto],
  );

  const groupRef = useRef<THREE.Group | null>(null);
  const scratchScaleRef = useRef(new THREE.Vector3());
  const displayedScaleRef = useRef(1);
  const [isHovered, setIsHovered] = useState(false);

  const target = { category: SplinterCategory.Shard, id: adonalsium.id };

  const isActive = useSplintersStore((s) =>
    isSameSplinter(s.selectedSplinter, target),
  );

  useCursor(isHovered);

  useFrame((_state, delta) => {
    const group = groupRef.current;

    if (!group) return;

    group.rotation.y += delta * 0.1;

    const { time, manualSplinters } = useSplintersStore.getState();
    const own = getSplinterStateAt({
      shardId: adonalsium.id,
      time,
      manualSplinters,
    });

    const targetScale =
      isActive && own.splinterProgress < SELECT_THRESHOLD ? 1.1 : 1;

    displayedScaleRef.current = THREE.MathUtils.damp(
      displayedScaleRef.current,
      targetScale,
      8,
      delta,
    );

    const s = displayedScaleRef.current;

    group.scale.copy(scratchScaleRef.current.set(s, s, s));
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const { time, manualSplinters } = useSplintersStore.getState();
    const own = getSplinterStateAt({
      shardId: adonalsium.id,
      time,
      manualSplinters,
    });

    if (own.splinterProgress >= SELECT_THRESHOLD) {
      return;
    }

    event.stopPropagation();
    useSplintersStore.getState().selectSplinter(isActive ? undefined : target);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const { time, manualSplinters } = useSplintersStore.getState();
    const own = getSplinterStateAt({
      shardId: adonalsium.id,
      time,
      manualSplinters,
    });

    if (own.splinterProgress >= SELECT_THRESHOLD) {
      return;
    }

    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
  };

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <SolidOctahedron shardId={adonalsium.id} radius={3} detail={2} />

      {fragments.map((fragment, i) => {
        const childShard = childShards[i] ?? adonalsium;

        return (
          <FragmentMesh
            key={i}
            fragment={fragment}
            shard={childShard}
            parentShardId={adonalsium.id}
          />
        );
      })}
    </group>
  );
};
