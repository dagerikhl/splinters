"use client";

import { Canvas } from "@/features/canvas/components/Canvas";
import { Panel } from "@/features/panel/components/Panel";
import { isEntityVisible } from "@/features/splinters/derive/isEntityVisible";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { useEffect } from "react";

const useDeselectInvisible = () => {
  const time = useSplintersStore((s) => s.time);
  const manualSplinters = useSplintersStore((s) => s.manualSplinters);
  const selected = useSplintersStore((s) => s.selectedSplinter);
  const deselect = useSplintersStore((s) => s.deselectSplinter);

  useEffect(() => {
    if (selected && !isEntityVisible(selected, time, manualSplinters)) {
      deselect();
    }
  }, [time, manualSplinters, selected, deselect]);
};

export const SplinterView = () => {
  useDeselectInvisible();

  return (
    <>
      <Canvas />

      <Panel />
    </>
  );
};
