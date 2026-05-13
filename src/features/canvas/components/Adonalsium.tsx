"use client";

import { CombinedShard } from "@/features/canvas/components/CombinedShard";
import { FractureBurst } from "@/features/canvas/components/FractureBurst";
import { FragmentMesh } from "@/features/canvas/components/FragmentMesh";
import { SolidOctahedron } from "@/features/canvas/components/SolidOctahedron";
import { usePinataFragments } from "@/features/canvas/fracture/usePinataFragments";
import { COMBINATIONS } from "@/features/cms/cosmere/combinations";
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
    restRadius: 15,
  });

  const childShardIds = adonalsium.splitsInto ?? [];

  const childShards = useMemo(
    () => childShardIds.map((id) => findShard(id)).filter(Boolean),
    [childShardIds],
  );

  const restPositionByShardId = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();

    childShardIds.forEach((id, i) => {
      const f = fragments[i];

      if (f) map.set(id, f.restPosition);
    });

    return map;
  }, [childShardIds, fragments]);

  const combinationMidpoints = useMemo(() => {
    return COMBINATIONS.map((combo) => {
      const a = restPositionByShardId.get(combo.shardAId);
      const b = restPositionByShardId.get(combo.shardBId);

      if (!a || !b) return null;

      const midpoint = new THREE.Vector3().lerpVectors(a, b, 0.5);

      return { combo, midpoint };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
  }, [restPositionByShardId]);

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

      <FractureBurst
        shardId={adonalsium.id}
        color="#fff2c8"
        maxIntensity={28}
        maxDistance={32}
      />

      {fragments.map((fragment, i) => {
        const childShard = childShards[i] ?? adonalsium;
        const partnerId = childShard.combinesWith?.shardId;
        const partnerRestPosition = partnerId
          ? restPositionByShardId.get(partnerId)
          : undefined;

        return (
          <FragmentMesh
            key={i}
            fragment={fragment}
            shard={childShard}
            parentShardId={adonalsium.id}
            partnerRestPosition={partnerRestPosition}
          />
        );
      })}

      {combinationMidpoints.map(({ combo, midpoint }) => (
        <CombinedShard
          key={combo.id}
          combinationId={combo.id}
          shardAId={combo.shardAId}
          shardBId={combo.shardBId}
          midpoint={midpoint}
          outerColor={combo.outerColor}
          emissiveColor={combo.emissiveColor}
        />
      ))}
    </group>
  );
};
