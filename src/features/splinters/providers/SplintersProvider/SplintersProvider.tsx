import { InteractionMode } from "@/features/splinters/enums/InteractionMode";
import {
  IGetSplinterState,
  IUpdateSplinterState,
  SplintersContext,
} from "@/features/splinters/providers/SplintersProvider/SplintersContext";
import { ISplintersState } from "@/features/splinters/types/ISplintersState";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";
import { stringifySplinterTarget } from "@/features/splinters/utils/targets";
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

  const [state, setState] = useState<ISplintersState>({ splinterStates: {} });

  const getSplinterState = useCallback<IGetSplinterState>(
    (target) =>
      target
        ? state.splinterStates[stringifySplinterTarget(target)]
        : undefined,
    [state.splinterStates],
  );

  const updateSplinterState = useCallback<IUpdateSplinterState>(
    (target, newState) => {
      setState((current) => {
        const key = stringifySplinterTarget(target);
        const currentState = current.splinterStates[key];

        return {
          ...current,
          splinterStates: {
            ...current.splinterStates,
            [key]: { ...currentState, ...newState },
          },
        };
      });
    },
    [],
  );

  const [time, setTime] = useState(0);

  return (
    <SplintersContext.Provider
      value={{
        selectedSplinter,
        onSelectSplinter: setSelectedSplinter,
        onDeselectSplinter: handleDeselectSplinter,

        state,
        getSplinterState,
        updateSplinterState,

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
