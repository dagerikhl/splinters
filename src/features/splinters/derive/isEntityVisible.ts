import { COMBINATIONS } from "@/features/cms/cosmere/combinations";
import { COSMERE_DATA } from "@/features/cms/cosmere/data";
import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";

const VISIBLE_THRESHOLD = 0.5;

/**
 * Returns true if the entity referenced by `target` is currently visible
 * (and therefore selectable) at the given timeline state. Mirrors the
 * gating used by FragmentMesh / Adonalsium / CombinedShard click handlers.
 */
export const isEntityVisible = (
  target: ISplinterTarget,
  time: number,
  manualSplinters: Record<string, boolean>,
): boolean => {
  if (target.category === SplinterCategory.Aether) return true;
  if (target.category === SplinterCategory.Dawnshard) return true;

  const combo = COMBINATIONS.find((c) => c.id === target.id);

  if (combo) {
    const a = getSplinterStateAt({
      shardId: combo.shardAId,
      time,
      manualSplinters,
    });
    const b = getSplinterStateAt({
      shardId: combo.shardBId,
      time,
      manualSplinters,
    });

    return Math.max(a.combineProgress, b.combineProgress) > VISIBLE_THRESHOLD;
  }

  if (target.id === COSMERE_DATA.adonalsium.id) {
    const own = getSplinterStateAt({
      shardId: target.id,
      time,
      manualSplinters,
    });

    return own.splinterProgress < VISIBLE_THRESHOLD;
  }

  const parent = getSplinterStateAt({
    shardId: COSMERE_DATA.adonalsium.id,
    time,
    manualSplinters,
  });

  if (parent.splinterProgress < VISIBLE_THRESHOLD) return false;

  const own = getSplinterStateAt({
    shardId: target.id,
    time,
    manualSplinters,
  });

  if (own.combineProgress > VISIBLE_THRESHOLD) return false;

  return true;
};
