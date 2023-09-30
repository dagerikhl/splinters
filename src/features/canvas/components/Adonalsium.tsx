"use client";

import { Shard } from "@/features/canvas/components/Shard";
import { IShard } from "@/features/cms/shards/types/IShard";
import { ThreeElements } from "@react-three/fiber";

interface OwnProps {
  adonalsium: IShard;
}

export type AdonalsiumProps = OwnProps & ThreeElements["mesh"];

export const Adonalsium = ({ adonalsium, ...rest }: AdonalsiumProps) => (
  <Shard shard={adonalsium} baseScale={2} {...rest} />
);
