"use client";

import { Button } from "@/common/components/buttons/Button";
import { Adonalsium } from "@/features/canvas/components/Adonalsium";
import { useShardsApi } from "@/features/cms/shards/hooks/useShardsApi";
import { InteractionModeBadge } from "@/features/splinters/components/InteractionModeBadge";
import { InteractionMode } from "@/features/splinters/enums/InteractionMode";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";
import { TimelineController } from "@/features/timeline/components/TimelineController";
import { CameraControls, Stars } from "@react-three/drei";
import { Canvas as RTFCanvas } from "@react-three/fiber";
import { useRef } from "react";
import styles from "./Canvas.module.scss";

export const Canvas = () => {
  const { interactionMode } = useSplintersContext();

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

        {/*{adonalsium?.splitsInto?.map((id, i) => {*/}
        {/*  const shard = data?.shards.find((shard) => shard.id === id);*/}

        {/*  if (!shard) {*/}
        {/*    return null;*/}
        {/*  }*/}

        {/*  return (*/}
        {/*    <Shard*/}
        {/*      key={id}*/}
        {/*      shard={shard}*/}
        {/*      position={[-3 + i * 0.4, -(i % 2) * 1.5, 0]}*/}
        {/*    />*/}
        {/*  );*/}
        {/*})}*/}
      </RTFCanvas>

      <div className={styles.actions}>
        <div className={styles.actionBar}>
          {interactionMode !== InteractionMode.Initial ? (
            <InteractionModeBadge value={interactionMode} />
          ) : (
            <div />
          )}

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
