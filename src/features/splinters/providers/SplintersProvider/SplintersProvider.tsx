import { SplintersContext } from "@/features/splinters/providers/SplintersProvider/SplintersContext";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { ReactNode, useState } from "react";

export interface SplintersProviderProps {
  children?: ReactNode;
}

export const SplintersProvider = ({ children }: SplintersProviderProps) => {
  const [selectedSplinter, setSelectedSplinter] = useState<
    ISplinterTarget | undefined
  >();

  return (
    <SplintersContext.Provider
      value={{ selectedSplinter, onSelectSplinter: setSelectedSplinter }}
    >
      {children}
    </SplintersContext.Provider>
  );
};
