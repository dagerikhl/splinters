"use client";

import { Button } from "@/common/components/buttons/Button";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import { formatSplinterName } from "@/features/splinters/utils/formatting";
import { isSameSplinter } from "@/features/splinters/utils/targets";
import styles from "./Panel.module.scss";

export const Panel = () => {
  const { data } = useShardsApi();

  const { selectedSplinter, onDeselectSplinter } = useSplintersContext();

  const selectedShard = data?.shards.find((shard) =>
    isSameSplinter(selectedSplinter, shard),
  );

  // TODO Show more interesting info
  return (
    <aside className={styles.container}>
      {selectedSplinter && (
        <>
          <h1>{formatSplinterName(selectedShard ?? selectedSplinter)}</h1>

          {selectedShard && (
            <pre>
              <code>{JSON.stringify(selectedShard, null, 2)}</code>
            </pre>
          )}

          <Button className={styles.closeBtn} onClick={onDeselectSplinter}>
            X
          </Button>
        </>
      )}
      {!selectedSplinter && <p>No Shard selected.</p>}
    </aside>
  );
};
