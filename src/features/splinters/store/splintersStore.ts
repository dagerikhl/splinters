import { InteractionMode } from "@/features/splinters/enums/InteractionMode";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { create } from "zustand";

interface SplintersStore {
  selectedSplinter: ISplinterTarget | undefined;
  selectSplinter: (target: ISplinterTarget | undefined) => void;
  deselectSplinter: () => void;

  manualSplinters: Record<string, boolean>;
  toggleManualSplinter: (shardId: string) => void;
  setManualSplinter: (shardId: string, isSplintered: boolean) => void;
  resetManualSplinters: () => void;

  time: number;
  setTime: (time: number) => void;

  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const useSplintersStore = create<SplintersStore>((set) => ({
  selectedSplinter: undefined,
  selectSplinter: (target) => set({ selectedSplinter: target }),
  deselectSplinter: () => set({ selectedSplinter: undefined }),

  manualSplinters: {},
  toggleManualSplinter: (shardId) =>
    set((current) => ({
      manualSplinters: {
        ...current.manualSplinters,
        [shardId]: !current.manualSplinters[shardId],
      },
    })),
  setManualSplinter: (shardId, isSplintered) =>
    set((current) => ({
      manualSplinters: { ...current.manualSplinters, [shardId]: isSplintered },
    })),
  resetManualSplinters: () => set({ manualSplinters: {} }),

  time: 0,
  setTime: (time) => set({ time }),

  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));

export const useIsManuallySplintered = (shardId: string | undefined): boolean =>
  useSplintersStore((s) =>
    shardId ? s.manualSplinters[shardId] === true : false,
  );

export const useInteractionMode = (): InteractionMode =>
  useSplintersStore((s) => {
    if (s.time !== 0) return InteractionMode.OnTimeline;

    if (Object.values(s.manualSplinters).some((v) => v)) {
      return InteractionMode.Manual;
    }

    return InteractionMode.Initial;
  });
