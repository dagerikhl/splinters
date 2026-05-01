"use client";

import { Button } from "@/common/components/buttons/Button";
import { findShard } from "@/features/cms/cosmere/data";
import { ShardLifecycle } from "@/features/cms/cosmere/types";
import {
  useSplinterState,
  useSplintersStore,
} from "@/features/splinters/store/splintersStore";
import styles from "./Panel.module.scss";

const formatLifecycle = (lifecycle: ShardLifecycle): string => {
  switch (lifecycle) {
    case ShardLifecycle.Alive:
      return "Alive";
    case ShardLifecycle.Splintered:
      return "Splintered";
    case ShardLifecycle.Combined:
      return "Combined";
    case ShardLifecycle.Unknown:
      return "Unknown";
  }
};

export const Panel = () => {
  const selectedSplinter = useSplintersStore((s) => s.selectedSplinter);
  const deselectSplinter = useSplintersStore((s) => s.deselectSplinter);
  const updateSplinterState = useSplintersStore((s) => s.updateSplinterState);

  const splinterState = useSplinterState(selectedSplinter);

  const selectedShard = selectedSplinter
    ? findShard(selectedSplinter.id)
    : undefined;

  const handleSplinterShard = () => {
    if (!selectedSplinter) return;

    updateSplinterState(selectedSplinter, { isSplintered: true });
  };

  const handleUnsplinterShard = () => {
    if (!selectedSplinter) return;

    updateSplinterState(selectedSplinter, { isSplintered: false });
  };

  if (!selectedSplinter || !selectedShard) {
    return (
      <aside className={styles.container}>
        <p className={styles.message}>No Splinter selected.</p>
      </aside>
    );
  }

  const splitsIntoNames = selectedShard.splitsInto?.map((id) => {
    const child = findShard(id);

    return child?.name ?? id;
  });

  return (
    <aside className={styles.container}>
      <div className={styles.heading}>
        <h1>{selectedShard.name}</h1>

        <Button className={styles.closeBtn} onClick={deselectSplinter}>
          X
        </Button>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoState}>
          State: {formatLifecycle(selectedShard.lifecycle)}
        </div>

        {selectedShard.vessel && (
          <div className={styles.infoVessel}>
            Vessel: {selectedShard.vessel.name}
            {selectedShard.vessel.species
              ? ` (${selectedShard.vessel.species})`
              : ""}
          </div>
        )}

        {selectedShard.planetarySystem && (
          <div className={styles.infoVessel}>
            System: {selectedShard.planetarySystem}
          </div>
        )}

        {splitsIntoNames && splitsIntoNames.length > 0 && (
          <div className={styles.infoSplitsInto}>
            Splits into: {splitsIntoNames.join(", ")}
          </div>
        )}

        {selectedShard.combinesWith && (
          <div className={styles.infoCombinesInto}>
            Combines with {findShard(selectedShard.combinesWith.shardId)?.name}{" "}
            into <strong>{selectedShard.combinesWith.into}</strong>
          </div>
        )}

        {selectedShard.subSplinters &&
          selectedShard.subSplinters.length > 0 && (
            <div className={styles.infoSlivers}>
              Sub-splinters:{" "}
              {selectedShard.subSplinters.map((s) => s.name).join(", ")}
            </div>
          )}

        {selectedShard.events.length > 0 && (
          <div className={styles.infoSlivers}>
            <strong>Events</strong>
            <ul>
              {selectedShard.events.map((event) => (
                <li key={`${event.tag}-${event.type}`}>
                  <a
                    href={event.citation}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event.tag}
                  </a>
                  : {event.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.infoSlivers}>
          <a
            href={selectedShard.citation}
            target="_blank"
            rel="noopener noreferrer"
          >
            Coppermind: {selectedShard.name}
          </a>
        </div>
      </div>

      <div className={styles.actions}>
        {splinterState?.isSplintered ? (
          <Button onClick={handleUnsplinterShard}>Unsplinter</Button>
        ) : (
          <Button
            onClick={handleSplinterShard}
            disabled={
              !selectedShard.splitsInto || selectedShard.splitsInto.length === 0
            }
          >
            Splinter
          </Button>
        )}
      </div>
    </aside>
  );
};
