"use client";

import { Splinter } from "@/features/cms/types/Splinter";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import THREE from "three";

interface OwnProps {
  splinter: Splinter;
}

export type ShardProps = OwnProps & ThreeElements["mesh"];

export const Shard = ({ splinter, ...rest }: ShardProps) => {
  const { onSelectEntity } = useSplintersContext();

  const mesh = useRef<THREE.Mesh>(null!);

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => (mesh.current.rotation.y += delta));

  const handleClick = () => {
    setActive(!active);
    onSelectEntity(active ? undefined : splinter.id);
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
