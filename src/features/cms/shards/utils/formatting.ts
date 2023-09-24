import { IShard } from "@/features/cms/shards/types/IShard";

export const formatShardName = <T extends IShard>(shard: T): string =>
  shard.name ?? shard.id;
