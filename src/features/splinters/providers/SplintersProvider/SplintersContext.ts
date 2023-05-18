import { InteractionMode } from "@/features/splinters/enums/InteractionMode";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { createContext, Dispatch, SetStateAction } from "react";

export interface SplintersStore {
  // Selection

  selectedSplinter?: ISplinterTarget;
  onSelectSplinter: Dispatch<SetStateAction<ISplinterTarget | undefined>>;
  onDeselectSplinter: () => void;

  // State

  // TODO Impl. state
  state: unknown;

  // Derived state

  get interactionMode(): InteractionMode;

  // Time

  time: number;
  onChangeTime: Dispatch<SetStateAction<number>>;
}

const SPLINTERS_STORE_DEFAULT_VALUE: SplintersStore = {
  onSelectSplinter: () => {},
  onDeselectSplinter: () => {},

  state: undefined,

  get interactionMode() {
    return InteractionMode.Initial;
  },

  time: 0,
  onChangeTime: () => {},
};

export const SplintersContext = createContext(SPLINTERS_STORE_DEFAULT_VALUE);
