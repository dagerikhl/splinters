import {
  COMBINATIONS,
  IShardCombination,
} from "@/features/cms/cosmere/combinations";
import { COSMERE_DATA, findShard } from "@/features/cms/cosmere/data";
import { IAether, IDawnshard, IShard } from "@/features/cms/cosmere/types";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";

export type Entity =
  | { type: "shard"; data: IShard }
  | { type: "aether"; data: IAether }
  | { type: "dawnshard"; data: IDawnshard }
  | { type: "combination"; data: IShardCombination };

export const findEntity = (
  target: ISplinterTarget | undefined,
): Entity | undefined => {
  if (!target) return undefined;

  switch (target.category) {
    case SplinterCategory.Shard: {
      const shard = findShard(target.id);

      if (shard) return { type: "shard", data: shard };

      const combo = COMBINATIONS.find((c) => c.id === target.id);

      if (combo) return { type: "combination", data: combo };

      return undefined;
    }

    case SplinterCategory.Aether: {
      const aether = COSMERE_DATA.aethers.find((a) => a.id === target.id);

      return aether ? { type: "aether", data: aether } : undefined;
    }

    case SplinterCategory.Dawnshard: {
      const dawnshard = COSMERE_DATA.dawnshards.find((d) => d.id === target.id);

      return dawnshard ? { type: "dawnshard", data: dawnshard } : undefined;
    }

    default:
      return undefined;
  }
};

export const entityName = (entity: Entity): string => {
  switch (entity.type) {
    case "shard":
      return entity.data.name;
    case "aether":
      return entity.data.name;
    case "dawnshard":
      return entity.data.name;
    case "combination":
      return entity.data.name;
  }
};
