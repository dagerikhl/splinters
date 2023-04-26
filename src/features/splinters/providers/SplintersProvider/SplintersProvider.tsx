import { SplintersContext } from "@/features/splinters/providers/SplintersProvider/SplintersContext";
import { ReactNode, useState } from "react";

export interface SplintersProviderProps {
  children?: ReactNode;
}

export const SplintersProvider = ({ children }: SplintersProviderProps) => {
  const [selectedId, setSelectedId] = useState<string | undefined>();

  return (
    <SplintersContext.Provider
      value={{ selectedId, onSelectEntity: setSelectedId }}
    >
      {children}
    </SplintersContext.Provider>
  );
};
