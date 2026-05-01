import { findShard } from "@/features/cms/cosmere/data";
import {
  smoothFade,
  tagToTime,
  TIMELINE_FADE_WINDOW,
} from "@/features/cms/cosmere/timeline";
import { EventType } from "@/features/cms/cosmere/types";

export interface DerivedSplinterState {
  splinterProgress: number;
  combineProgress: number;
  combinedWith?: string;
  isAlive: boolean;
}

export interface DerivationInput {
  shardId: string;
  time: number;
  manualSplinters?: Record<string, boolean>;
}

const FADE = TIMELINE_FADE_WINDOW;

export const getSplinterStateAt = ({
  shardId,
  time,
  manualSplinters,
}: DerivationInput): DerivedSplinterState => {
  const shard = findShard(shardId);

  if (!shard) {
    return { splinterProgress: 0, combineProgress: 0, isAlive: true };
  }

  const manual = manualSplinters?.[shardId] === true;

  let splinterProgress = manual ? 1 : 0;
  let combineProgress = 0;
  let combinedWith: string | undefined;

  for (const event of shard.events) {
    const tagTime = tagToTime(event.tag);
    const fade = smoothFade(time, tagTime, FADE);

    if (event.type === EventType.Shatter || event.type === EventType.Splinter) {
      splinterProgress = Math.max(splinterProgress, fade);
    }

    if (event.type === EventType.Combine || event.type === EventType.Merge) {
      combineProgress = Math.max(combineProgress, fade);

      if (fade > 0 && shard.combinesWith) {
        combinedWith = shard.combinesWith.into;
      }
    }
  }

  const isAlive = splinterProgress < 1 && combineProgress < 1;

  return { splinterProgress, combineProgress, combinedWith, isAlive };
};
