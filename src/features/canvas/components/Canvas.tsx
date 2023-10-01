"use client";

import { Button } from "@/common/components/buttons/Button";
import { Adonalsium } from "@/features/canvas/components/Adonalsium";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { InteractionModeBadge } from "@/features/splinters/components/InteractionModeBadge";
import { TimelineController } from "@/features/timeline/components/TimelineController";
import { Globals } from "@react-spring/three";
import { CameraControls, Stars } from "@react-three/drei";
import { Canvas as RTFCanvas } from "@react-three/fiber";
import { useRef } from "react";
import styles from "./Canvas.module.scss";

// Fixes: https://github.com/pmndrs/react-spring/issues/1586
Globals.assign({
  frameLoop: "always",
});

// Suppresses the warning from ReactSpring, see https://github.com/pmndrs/react-spring/issues/1586
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    args &&
    typeof args[0] === "string" &&
    args[0] ===
      "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"
  ) {
    return;
  }

  originalConsoleWarn(...args);
};

export const Canvas = () => {
  const { data } = useShardsApi();

  const adonalsium = data?.shards.find(({ id }) => id === "adonalsium");

  // TODO Remove
  console.log("Canvas::data:", { data, adonalsium });

  const cameraControlsRef = useRef<CameraControls>(null!);

  const handleResetCamera = () => {
    cameraControlsRef.current?.reset(true);
  };

  return (
    <div className={styles.container}>
      <RTFCanvas camera={{ position: [0, 5, 20], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight intensity={0.7} position={[1000, 1000, 1000]} />
        <pointLight intensity={0.7} position={[-1000, 1000, -1000]} />

        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        <CameraControls ref={cameraControlsRef} enabled minDistance={0} />

        {adonalsium && <Adonalsium adonalsium={adonalsium} />}
      </RTFCanvas>

      <div className={styles.actions}>
        <div className={styles.actionBar}>
          <InteractionModeBadge />

          <div className={styles.controls}>
            <Button onClick={handleResetCamera}>Reset camera</Button>
          </div>
        </div>

        <div className={styles.actionBar}>
          <div className={styles.timeline}>
            <TimelineController />
          </div>
        </div>
      </div>
    </div>
  );
};
