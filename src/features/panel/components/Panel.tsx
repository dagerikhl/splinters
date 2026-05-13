"use client";

import { Button } from "@/common/components/buttons/Button";
import { findShard } from "@/features/cms/cosmere/data";
import { Entity, findEntity } from "@/features/cms/cosmere/findEntity";
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

const ShardBody = ({
  shard,
}: {
  shard: Extract<Entity, { type: "shard" }>["data"];
}) => {
  const splitsIntoNames = shard.splitsInto?.map((id) => {
    const child = findShard(id);

    return child?.name ?? id;
  });

  return (
    <>
      <Section label="State">{formatLifecycle(shard.lifecycle)}</Section>

      {shard.vessel && (
        <Section label="Vessel">
          {shard.vessel.name}
          {shard.vessel.species ? ` (${shard.vessel.species})` : ""}
        </Section>
      )}

      {shard.planetarySystem && (
        <Section label="System">{shard.planetarySystem}</Section>
      )}

      {splitsIntoNames && splitsIntoNames.length > 0 && (
        <Section label="Splits into">{splitsIntoNames.join(", ")}</Section>
      )}

      {shard.combinesWith && (
        <Section label="Combines with">
          {findShard(shard.combinesWith.shardId)?.name} into{" "}
          <strong>{shard.combinesWith.into}</strong>
        </Section>
      )}

      {shard.subSplinters && shard.subSplinters.length > 0 && (
        <Section label="Sub-splinters">
          {shard.subSplinters.map((s) => s.name).join(", ")}
        </Section>
      )}

      {shard.events.length > 0 && (
        <Section label="Events">
          <ul className={styles.eventList}>
            {shard.events.map((event) => (
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
        <a href={shard.citation} target="_blank" rel="noopener noreferrer">
          Read more about {shard.name}
        </a>
      </Section>
    </>
  );
};

const AetherBody = ({
  aether,
}: {
  aether: Extract<Entity, { type: "aether" }>["data"];
}) => (
  <>
    <Section label="Type">Primal Aether</Section>

    <Section label="Origin">{aether.origin}</Section>

    <Section label="Color">
      <span
        style={{
          display: "inline-block",
          width: 14,
          height: 14,
          background: aether.color,
          borderRadius: "50%",
          verticalAlign: "middle",
          marginRight: 8,
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      />
      {aether.color}
    </Section>

    <Section label="Note">
      Aethers exist independently of Adonalsium and may predate the Shattering.
    </Section>

    <Section label="Coppermind">
      <a href={aether.citation} target="_blank" rel="noopener noreferrer">
        Read about Aethers
      </a>
    </Section>
  </>
);

const DawnshardBody = ({
  dawnshard,
}: {
  dawnshard: Extract<Entity, { type: "dawnshard" }>["data"];
}) => (
  <>
    <Section label="Type">Primal Command (Dawnshard)</Section>

    <Section label="Status">
      {dawnshard.revealed ? "Revealed" : "Unrevealed in canon"}
    </Section>

    {dawnshard.bearers && dawnshard.bearers.length > 0 && (
      <Section label="Bearers">
        <ul className={styles.eventList}>
          {dawnshard.bearers.map((b) => (
            <li key={b.name}>
              <a href={b.citation} target="_blank" rel="noopener noreferrer">
                {b.name}
              </a>{" "}
              — {b.period}
            </li>
          ))}
        </ul>
      </Section>
    )}

    <Section label="Note">
      The four primal Commands Adonalsium used to create all things; predate the
      Shattering.
    </Section>

    <Section label="Coppermind">
      <a href={dawnshard.citation} target="_blank" rel="noopener noreferrer">
        Read about Dawnshards
      </a>
    </Section>
  </>
);

const CombinationBody = ({
  combo,
}: {
  combo: Extract<Entity, { type: "combination" }>["data"];
}) => {
  const a = findShard(combo.shardAId);
  const b = findShard(combo.shardBId);

  return (
    <>
      <Section label="Type">Combined Shard</Section>

      <Section label="Formed from">
        {a?.name ?? combo.shardAId} + {b?.name ?? combo.shardBId}
      </Section>

      <Section label="Note">
        A combined Shard takes a new Intent distinct from either parent.
      </Section>
    </>
  );
};

export const Panel = () => {
  const selectedSplinter = useSplintersStore((s) => s.selectedSplinter);
  const deselectSplinter = useSplintersStore((s) => s.deselectSplinter);
  const setManualSplinter = useSplintersStore((s) => s.setManualSplinter);

  const isManuallySplintered = useIsManuallySplintered(selectedSplinter?.id);

  const entity = findEntity(selectedSplinter);

  if (!selectedSplinter || !entity) return null;

  const handleSplinterShard = () => {
    if (entity.type !== "shard") return;

    setManualSplinter(entity.data.id, true);
  };

  const handleUnsplinterShard = () => {
    if (entity.type !== "shard") return;

    setManualSplinter(entity.data.id, false);
  };

  const name =
    entity.type === "shard"
      ? entity.data.name
      : entity.type === "aether"
        ? entity.data.name
        : entity.type === "dawnshard"
          ? entity.data.name
          : entity.data.name;

  const canSplinter =
    entity.type === "shard" &&
    entity.data.splitsInto &&
    entity.data.splitsInto.length > 0;

  return (
    <aside className={styles.container}>
      <div className={styles.heading}>
        <h1>{name}</h1>

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
        {entity.type === "shard" && <ShardBody shard={entity.data} />}
        {entity.type === "aether" && <AetherBody aether={entity.data} />}
        {entity.type === "dawnshard" && (
          <DawnshardBody dawnshard={entity.data} />
        )}
        {entity.type === "combination" && (
          <CombinationBody combo={entity.data} />
        )}
      </div>

      {entity.type === "shard" && (
        <div className={styles.actions}>
          {isManuallySplintered ? (
            <Button onClick={handleUnsplinterShard}>Unsplinter</Button>
          ) : (
            <Button onClick={handleSplinterShard} disabled={!canSplinter}>
              Splinter
            </Button>
          )}
        </div>
      )}
    </aside>
  );
};
