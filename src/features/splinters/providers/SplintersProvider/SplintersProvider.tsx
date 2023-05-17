import { SplintersContext } from "@/features/splinters/providers/SplintersProvider/SplintersContext";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { ReactNode, useCallback, useState } from "react";

export interface SplintersProviderProps {
  children?: ReactNode;
}

export const SplintersProvider = ({ children }: SplintersProviderProps) => {
  const [selectedSplinter, setSelectedSplinter] = useState<
    ISplinterTarget | undefined
  >();

  const handleDeselectSplinter = useCallback(() => {
    setSelectedSplinter(undefined);
  }, []);

  return (
    <SplintersContext.Provider
      value={{
        selectedSplinter,
        onSelectSplinter: setSelectedSplinter,
        onDeselectSplinter: handleDeselectSplinter,
      }}
    >
      {children}
    </SplintersContext.Provider>
  );
};
