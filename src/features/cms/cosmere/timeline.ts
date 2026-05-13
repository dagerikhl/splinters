import { EventType } from "@/features/cms/cosmere/types";

export interface ITimelineEvent {
  tag: string;
  ordinal: number;
  type: EventType;
  label: string;
  citation: string;
}

export const TIMELINE_EVENTS: ITimelineEvent[] = [
  {
    tag: "pre-T0",
    ordinal: 0,
    type: EventType.Settle,
    label: "Dawnshards exist; Hoid holds Exist",
    citation: "https://coppermind.net/wiki/Dawnshard",
  },
  {
    tag: "T0",
    ordinal: 1,
    type: EventType.Shatter,
    label: "The Shattering of Adonalsium on Yolen",
    citation: "https://coppermind.net/wiki/Shattering",
  },
  {
    tag: "T2",
    ordinal: 2,
    type: EventType.Settle,
    label: "Tanavast and Koravellium settle Roshar",
    citation: "https://coppermind.net/wiki/Cultivation",
  },
  {
    tag: "T3",
    ordinal: 3,
    type: EventType.Settle,
    label: "Leras and Ati settle Scadrial",
    citation: "https://coppermind.net/wiki/Preservation",
  },
  {
    tag: "T6",
    ordinal: 4,
    type: EventType.Settle,
    label: "Aona and Skai settle Sel",
    citation: "https://coppermind.net/wiki/Devotion",
  },
  {
    tag: "T7",
    ordinal: 5,
    type: EventType.Splinter,
    label: "Devotion and Dominion are Splintered; the Dor forms",
    citation: "https://coppermind.net/wiki/Devotion",
  },
  {
    tag: "T8",
    ordinal: 6,
    type: EventType.Splinter,
    label: "Battle of the Threnodite system: Ambition wounded",
    citation: "https://coppermind.net/wiki/Ambition",
  },
  {
    tag: "T9",
    ordinal: 7,
    type: EventType.Splinter,
    label: "Ambition is fully Splintered",
    citation: "https://coppermind.net/wiki/Ambition",
  },
  {
    tag: "T14",
    ordinal: 8,
    type: EventType.Splinter,
    label: "Honor is Splintered by Rayse; Stormfather forms",
    citation: "https://coppermind.net/wiki/Honor",
  },
  {
    tag: "T16",
    ordinal: 9,
    type: EventType.Combine,
    label: "Catacendre: Sazed merges Preservation and Ruin into Harmony",
    citation: "https://coppermind.net/wiki/Harmony",
  },
  {
    tag: "T17",
    ordinal: 10,
    type: EventType.Transfer,
    label: "Rysn becomes the bearer of the Change Dawnshard",
    citation: "https://coppermind.net/wiki/Rysn_Ftori",
  },
  {
    tag: "T18",
    ordinal: 11,
    type: EventType.Transfer,
    label: "Rayse is killed; Taravangian Ascends as Odium",
    citation: "https://coppermind.net/wiki/Taravangian",
  },
  {
    tag: "T20",
    ordinal: 12,
    type: EventType.Merge,
    label: "Honor and Odium are merged into Retribution",
    citation: "https://coppermind.net/wiki/Retribution",
  },
];

// Slot count reserves a half-window of headroom at both ends so the first and
// last events have a complete smoothFade ramp inside [0, 1].
const SLOT_COUNT = TIMELINE_EVENTS[TIMELINE_EVENTS.length - 1].ordinal + 1;
const TAG_INDEX: Record<string, ITimelineEvent> = Object.fromEntries(
  TIMELINE_EVENTS.map((e) => [e.tag, e]),
);

export const tagToTime = (tag: string): number => {
  const event = TAG_INDEX[tag];

  if (!event) {
    throw new Error(`Unknown timeline tag: ${tag}`);
  }

  return (event.ordinal + 0.5) / SLOT_COUNT;
};

export const TIMELINE_FADE_WINDOW = 0.04;

export const smoothFade = (
  time: number,
  center: number,
  window = TIMELINE_FADE_WINDOW,
): number => {
  const start = center - window;
  const end = center + window;

  if (time <= start) return 0;
  if (time >= end) return 1;

  const t = (time - start) / (end - start);

  return t * t * (3 - 2 * t);
};

export const timeForTag = (tag: string): number => tagToTime(tag);
