"use client";

import { IShard } from "@/features/cms/shards/types/IShard";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import { getSplinterTarget } from "@/features/splinters/utils/targets";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import THREE from "three";

interface OwnProps {
  shard: IShard;
}

export type ShardProps = OwnProps & ThreeElements["mesh"];

export const Shard = ({ shard, ...rest }: ShardProps) => {
  const { onSelectSplinter } = useSplintersContext();

  const mesh = useRef<THREE.Mesh>(null!);

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => (mesh.current.rotation.y += delta));

  const handleClick = () => {
    setActive(!active);
    onSelectSplinter(active ? undefined : getSplinterTarget(shard));
  };

  return (
    <mesh
      {...rest}
      ref={mesh}
      scale={active ? 0.6 : 0.3}
      onClick={handleClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <octahedronGeometry />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};
