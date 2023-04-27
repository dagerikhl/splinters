import { ShardState } from "@/features/cms/shards/enums/ShardState";
import { ShardType } from "@/features/cms/shards/enums/ShardType";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { ISplinter } from "@/features/splinters/types/ISplinter";

export interface IShard extends ISplinter {
  category: SplinterCategory.Shard;
  type: ShardType;
  state?: ShardState;
  splitsInto?: string[];
  combinesInto?: Record<string, string[]>;
  vessel?: string;
  slivers?: string[];
}
