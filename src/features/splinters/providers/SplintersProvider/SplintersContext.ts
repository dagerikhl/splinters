import { createContext, Dispatch, SetStateAction } from "react";

export interface SplintersStore {
  selectedId?: string;
  onSelectEntity: Dispatch<SetStateAction<string | undefined>>;
}

const SPLINTERS_STORE_DEFAULT_VALUE: SplintersStore = {
  onSelectEntity: () => {},
};

export const SplintersContext = createContext(SPLINTERS_STORE_DEFAULT_VALUE);
