import { InteractionMode } from "@/features/splinters/enums/InteractionMode";
import { ISplintersState } from "@/features/splinters/types/ISplintersState";
import { ISplinterState } from "@/features/splinters/types/ISplinterState";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { createContext, Dispatch, SetStateAction } from "react";

export type IOnSelectSplinter = Dispatch<
  SetStateAction<ISplinterTarget | undefined>
>;

export type IGetSplinterState = <T extends ISplinterTarget>(
  target: T | undefined,
) => ISplinterState | undefined;

export type IUpdateSplinterState = <T extends ISplinterTarget>(
  target: T,
  state: ISplinterState,
) => void;

export interface SplintersStore {
  // Selection

  selectedSplinter?: ISplinterTarget;
  onSelectSplinter: IOnSelectSplinter;
  onDeselectSplinter: VoidFunction;

  // State

  state: ISplintersState;
  getSplinterState: IGetSplinterState;
  updateSplinterState: IUpdateSplinterState;

  // Derived state

  interactionMode: InteractionMode;

  // Time

  time: number;
  onChangeTime: Dispatch<SetStateAction<number>>;
}

const SPLINTERS_STORE_DEFAULT_VALUE: SplintersStore = {
  onSelectSplinter: () => {},
  onDeselectSplinter: () => {},

  state: { splinterStates: {} },
  getSplinterState: () => ({}),
  updateSplinterState: () => {},

  interactionMode: InteractionMode.Initial,

  time: 0,
  onChangeTime: () => {},
};

export const SplintersContext = createContext(SPLINTERS_STORE_DEFAULT_VALUE);
