"use client";

import { Button } from "@/common/components/buttons/Button";
import { Adonalsium } from "@/features/canvas/components/Adonalsium";
import { Aethers } from "@/features/canvas/components/Aethers";
import { Dawnshards } from "@/features/canvas/components/Dawnshards";
import { InteractionModeBadge } from "@/features/splinters/components/InteractionModeBadge";
import { TimelineController } from "@/features/timeline/components/TimelineController";
import { CameraControls, Stars } from "@react-three/drei";
import { Canvas as RTFCanvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import styles from "./Canvas.module.scss";

export const Canvas = () => {
  const cameraControlsRef = useRef<CameraControls>(null!);

  const handleResetCamera = () => {
    cameraControlsRef.current?.reset(true);
  };

  return (
    <div className={styles.container}>
      <RTFCanvas camera={{ position: [0, 3, 16], fov: 55 }}>
        <color attach="background" args={["#05070d"]} />

        <ambientLight intensity={0.4} />
        <hemisphereLight
          intensity={0.3}
          color="#dceaff"
          groundColor="#3a2a55"
        />
        <pointLight
          intensity={1.6}
          decay={0.2}
          position={[6, 6, 12]}
          color="#ffe7c2"
        />
        <pointLight
          intensity={0.7}
          decay={0.2}
          position={[-8, -4, 6]}
          color="#88a8ff"
        />
        <pointLight
          intensity={0.45}
          decay={0.2}
          position={[0, -10, -6]}
          color="#a8b8ff"
        />

        <Stars
          radius={100}
          depth={50}
          count={3500}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        <CameraControls ref={cameraControlsRef} enabled minDistance={4} />

        <Adonalsium />

        <Dawnshards />

        <Aethers />

        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.7}
            luminanceSmoothing={0.4}
            intensity={0.8}
          />
        </EffectComposer>
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
