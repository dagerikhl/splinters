"use client";

import { Shard } from "@/features/canvas/components/Shard";
import { IShard } from "@/features/cms/shards/types/IShard";

export interface AdonalsiumProps {
  adonalsium: IShard;
}

export const Adonalsium = ({ adonalsium }: AdonalsiumProps) => (
  <Shard shard={adonalsium} baseScale={2} />
);
