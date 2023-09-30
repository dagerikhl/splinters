"use client";

import { Shard, ShardProps } from "@/features/canvas/components/Shard";
import { IShard } from "@/features/cms/shards/types/IShard";

interface OwnProps {
  adonalsium: IShard;
}

export type AdonalsiumProps = OwnProps &
  Omit<ShardProps, "baseScale" | "shard">;

export const Adonalsium = ({ adonalsium, ...rest }: AdonalsiumProps) => (
  <Shard shard={adonalsium} baseScale={2} {...rest} />
);
