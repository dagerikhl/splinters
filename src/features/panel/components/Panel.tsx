"use client";

import { Button } from "@/common/components/buttons/Button";
import { formatShardState } from "@/features/cms/shards/enums/ShardState";
import { formatShardType } from "@/features/cms/shards/enums/ShardType";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { IShard } from "@/features/cms/shards/types/IShard";
import { formatShardName } from "@/features/cms/shards/utils/formatting";
import {
  formatSplinterCategory,
  SplinterCategory,
} from "@/features/splinters/enums/SplinterCategory";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { formatSplinterName } from "@/features/splinters/utils/formatting";
import { isSameSplinter } from "@/features/splinters/utils/targets";
import styles from "./Panel.module.scss";

export const Panel = () => {
  const { data } = useShardsApi();

  const {
    selectedSplinter,
    onDeselectSplinter,
    getSplinterState,
    updateSplinterState,
  } = useSplintersContext();

  const splinterState = getSplinterState(selectedSplinter);

  const selectedShard = data?.shards.find((shard) =>
    isSameSplinter(selectedSplinter, shard),
  );

  const getShardById = (shardId: string): IShard | undefined => {
    const shardTarget: ISplinterTarget = {
      category: SplinterCategory.Shard,
      id: shardId,
    };

    return data?.shards.find((shard) => isSameSplinter(shardTarget, shard));
  };

  const handleSplinterShard = () => {
    updateSplinterState(selectedSplinter!, { isSplintered: true });
  };

  const handleUnsplinterShard = () => {
    updateSplinterState(selectedSplinter!, { isSplintered: false });
  };

  return (
    <aside className={styles.container}>
      {selectedSplinter && (
        <>
          <div className={styles.heading}>
            <h1>{formatSplinterName(selectedShard ?? selectedSplinter)}</h1>

            <Button className={styles.closeBtn} onClick={onDeselectSplinter}>
              X
            </Button>
          </div>

          {selectedShard && (
            <div className={styles.infoGrid}>
              <div className={styles.infoType}>
                Type: {formatSplinterCategory(selectedShard.category)} &gt;{" "}
                {formatShardType(selectedShard.type)}
              </div>

              <div className={styles.infoState}>
                State: {formatShardState(selectedShard.state) ?? "???"}
              </div>

              <div className={styles.infoSplitsInto}>
                Splits into:{" "}
                {selectedShard.splitsInto && selectedShard.splitsInto.length > 0
                  ? selectedShard.splitsInto
                      .map((shardId) => {
                        const shard = getShardById(shardId);

                        return shard ? formatShardName(shard) : shardId;
                      })
                      .join(", ")
                  : "???"}
              </div>

              <div className={styles.infoCombinesInto}>
                Combines into:{" "}
                {selectedShard.combinesInto &&
                Object.keys(selectedShard.combinesInto).length > 0 ? (
                  <ul>
                    {Object.entries(selectedShard.combinesInto).map(
                      ([combinedShardId, shardIds]) => {
                        const combinedShard = getShardById(combinedShardId);
                        const combinedShardName = combinedShard
                          ? formatShardName(combinedShard)
                          : combinedShardId;

                        const shardNames = shardIds.map((shardId) => {
                          const shard = getShardById(shardId);

                          return shard ? formatShardName(shard) : shardId;
                        });

                        return (
                          <li key={combinedShardId}>
                            {combinedShardName}: {shardNames.join(", ")}
                          </li>
                        );
                      },
                    )}
                  </ul>
                ) : (
                  "???"
                )}
              </div>

              <div className={styles.infoVessel}>
                Vessel: {selectedShard.vessel ?? "???"}
              </div>

              <div className={styles.infoSlivers}>
                Slivers:{" "}
                {selectedShard.slivers && selectedShard.slivers.length > 0
                  ? selectedShard.slivers.join(", ")
                  : "???"}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            {splinterState?.isSplintered ? (
              <Button onClick={handleUnsplinterShard}>Unsplinter</Button>
            ) : (
              <Button
                onClick={handleSplinterShard}
                disabled={
                  !selectedShard?.splitsInto ||
                  selectedShard.splitsInto.length === 0
                }
              >
                Splinter
              </Button>
            )}
          </div>
        </>
      )}
      {!selectedSplinter && (
        <p className={styles.message}>No Splinter selected.</p>
      )}
    </aside>
  );
};
