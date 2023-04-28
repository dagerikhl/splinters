"use client";

import { Shard } from "@/features/canvas/components/Shard";
import { IShard } from "@/features/cms/shards/types/IShard";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import {
  isSameSplinter,
} from "@/features/splinters/utils/targets";
import { ThreeElements } from "@react-three/fiber";

interface OwnProps {
  adonalsium: IShard;
}

export type AdonalsiumProps = OwnProps & ThreeElements["mesh"];

export const Adonalsium = ({ adonalsium, ...rest }: AdonalsiumProps) => {
  const { selectedSplinter, onSelectSplinter } = useSplintersContext();

  const isActive = isSameSplinter(selectedSplinter, adonalsium);

  return (
    <Shard
      shard={adonalsium}
      baseScale={1.5}
      {...rest}
    >
    </Shard>
  );
};
