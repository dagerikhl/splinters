"use client";

import { useSplintersApi } from "@/features/cms/hooks/useSplintersApi";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import styles from "./Panel.module.scss";

export const Panel = () => {
  const { data } = useSplintersApi();

  const { selectedId } = useSplintersContext();

  const adonalsium =
    // TODO Why do I have to use this format? This shouldn't be necessary (?. should be sufficient)
    data?.splinters && data.splinters.find(({ id }) => id === "adonalsium");
  const selectedEntity =
    // TODO Why do I have to use this format? This shouldn't be necessary (?. should be sufficient)
    adonalsium?.splinters &&
    adonalsium.splinters.find(({ id }) => id === selectedId);

  // TODO Show more interesting info
  return (
    <aside className={styles.container}>
      {selectedId ? (
        <>
          <h1>{selectedEntity?.name ?? selectedId}</h1>

          {selectedEntity && (
            <pre>
              <code>{JSON.stringify(selectedEntity, null, 2)}</code>
            </pre>
          )}
        </>
      ) : (
        <p>No Shard selected.</p>
      )}
    </aside>
  );
};
