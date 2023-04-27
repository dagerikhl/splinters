import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { createContext, Dispatch, SetStateAction } from "react";

export interface SplintersStore {
  selectedSplinter?: ISplinterTarget;
  onSelectSplinter: Dispatch<SetStateAction<ISplinterTarget | undefined>>;
}

const SPLINTERS_STORE_DEFAULT_VALUE: SplintersStore = {
  onSelectSplinter: () => {},
};

export const SplintersContext = createContext(SPLINTERS_STORE_DEFAULT_VALUE);
