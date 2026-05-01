"use client";

import { Button } from "@/common/components/buttons/Button";
import { findShard } from "@/features/cms/cosmere/data";
import { ShardLifecycle } from "@/features/cms/cosmere/types";
import {
  useIsManuallySplintered,
  useSplintersStore,
} from "@/features/splinters/store/splintersStore";
import { ReactNode } from "react";
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

interface SectionProps {
  label: string;
  children: ReactNode;
}

const Section = ({ label, children }: SectionProps) => (
  <div className={styles.section}>
    <span className={styles.sectionLabel}>{label}</span>
    <div className={styles.sectionValue}>{children}</div>
  </div>
);

export const Panel = () => {
  const selectedSplinter = useSplintersStore((s) => s.selectedSplinter);
  const deselectSplinter = useSplintersStore((s) => s.deselectSplinter);
  const setManualSplinter = useSplintersStore((s) => s.setManualSplinter);

  const isManuallySplintered = useIsManuallySplintered(selectedSplinter?.id);

  const selectedShard = selectedSplinter
    ? findShard(selectedSplinter.id)
    : undefined;

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

  const handleSplinterShard = () => {
    setManualSplinter(selectedShard.id, true);
  };

  const handleUnsplinterShard = () => {
    setManualSplinter(selectedShard.id, false);
  };

  return (
    <aside className={styles.container}>
      <div className={styles.heading}>
        <h1>{selectedShard.name}</h1>

        <Button
          className={styles.closeBtn}
          onClick={deselectSplinter}
          title="Deselect"
          aria-label="Deselect"
        >
          ×
        </Button>
      </div>

      <div className={styles.infoBody}>
        <Section label="State">
          {formatLifecycle(selectedShard.lifecycle)}
        </Section>

        {selectedShard.vessel && (
          <Section label="Vessel">
            {selectedShard.vessel.name}
            {selectedShard.vessel.species
              ? ` (${selectedShard.vessel.species})`
              : ""}
          </Section>
        )}

        {selectedShard.planetarySystem && (
          <Section label="System">{selectedShard.planetarySystem}</Section>
        )}

        {splitsIntoNames && splitsIntoNames.length > 0 && (
          <Section label="Splits into">{splitsIntoNames.join(", ")}</Section>
        )}

        {selectedShard.combinesWith && (
          <Section label="Combines with">
            {findShard(selectedShard.combinesWith.shardId)?.name} into{" "}
            <strong>{selectedShard.combinesWith.into}</strong>
          </Section>
        )}

        {selectedShard.subSplinters &&
          selectedShard.subSplinters.length > 0 && (
            <Section label="Sub-splinters">
              {selectedShard.subSplinters.map((s) => s.name).join(", ")}
            </Section>
          )}

        {selectedShard.events.length > 0 && (
          <Section label="Events">
            <ul className={styles.eventList}>
              {selectedShard.events.map((event) => (
                <li key={`${event.tag}-${event.type}`}>
                  <a
                    href={event.citation}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.eventTag}>{event.tag}</span>
                  </a>
                  : {event.description}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section label="Coppermind">
          <a
            href={selectedShard.citation}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more about {selectedShard.name}
          </a>
        </Section>
      </div>

      <div className={styles.actions}>
        {isManuallySplintered ? (
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
