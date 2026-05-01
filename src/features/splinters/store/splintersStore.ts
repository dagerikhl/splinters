import { InteractionMode } from "@/features/splinters/enums/InteractionMode";
import { ISplinterState } from "@/features/splinters/types/ISplinterState";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { stringifySplinterTarget } from "@/features/splinters/utils/targets";
import { create } from "zustand";

interface SplintersStore {
  selectedSplinter: ISplinterTarget | undefined;
  selectSplinter: (target: ISplinterTarget | undefined) => void;
  deselectSplinter: () => void;

  splinterStates: Record<string, ISplinterState>;
  updateSplinterState: (
    target: ISplinterTarget,
    state: Partial<ISplinterState>,
  ) => void;

  time: number;
  setTime: (time: number) => void;
}

export const useSplintersStore = create<SplintersStore>((set) => ({
  selectedSplinter: undefined,
  selectSplinter: (target) => set({ selectedSplinter: target }),
  deselectSplinter: () => set({ selectedSplinter: undefined }),

  splinterStates: {},
  updateSplinterState: (target, state) =>
    set((current) => {
      const key = stringifySplinterTarget(target);

      return {
        splinterStates: {
          ...current.splinterStates,
          [key]: { ...current.splinterStates[key], ...state },
        },
      };
    }),

  time: 0,
  setTime: (time) => set({ time }),
}));

export const useSplinterState = (
  target: ISplinterTarget | undefined,
): ISplinterState | undefined =>
  useSplintersStore((s) =>
    target ? s.splinterStates[stringifySplinterTarget(target)] : undefined,
  );

export const useInteractionMode = (): InteractionMode =>
  useSplintersStore((s) =>
    s.time !== 0 ? InteractionMode.OnTimeline : InteractionMode.Initial,
  );
