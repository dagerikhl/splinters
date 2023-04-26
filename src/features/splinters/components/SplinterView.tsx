"use client";

import { Canvas } from "@/features/canvas/components/Canvas";
import { Panel } from "@/features/panel/components/Panel";
import { SplintersProvider } from "@/features/splinters/providers/SplintersProvider/SplintersProvider";

export const SplinterView = () => (
  <SplintersProvider>
    <Canvas />

    <Panel />
  </SplintersProvider>
);
