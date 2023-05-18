import { InteractionMode } from "@/features/splinters/enums/InteractionMode";
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

  const [time, setTime] = useState(0);

  return (
    <SplintersContext.Provider
      value={{
        selectedSplinter,
        onSelectSplinter: setSelectedSplinter,
        onDeselectSplinter: handleDeselectSplinter,

        state: undefined,

        get interactionMode() {
          if (this.time !== 0) {
            return InteractionMode.OnTimeline;
          }

          return InteractionMode.Initial;
        },

        time,
        onChangeTime: setTime,
      }}
    >
      {children}
    </SplintersContext.Provider>
  );
};
