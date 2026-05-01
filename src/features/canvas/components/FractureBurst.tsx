"use client";

import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export interface FractureBurstProps {
  shardId: string;
  color?: string;
  maxIntensity?: number;
  maxDistance?: number;
  glowColor?: string;
  showGlowSprite?: boolean;
}

export const FractureBurst = ({
  shardId,
  color = "#ffd28a",
  maxIntensity = 18,
  maxDistance = 20,
  glowColor = "#ffe0b3",
  showGlowSprite = false,
}: FractureBurstProps) => {
  const lightRef = useRef<THREE.PointLight | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const scratchScaleRef = useRef(new THREE.Vector3());

  useFrame(() => {
    const light = lightRef.current;
    const glow = glowRef.current;
    const glowMaterial = glowMaterialRef.current;

    if (!light) return;

    const { time, manualSplinters } = useSplintersStore.getState();
    const { splinterProgress } = getSplinterStateAt({
      shardId,
      time,
      manualSplinters,
    });

    const x = (splinterProgress - 0.5) * 5;
    const burst = Math.exp(-x * x);

    light.intensity = burst * maxIntensity;
    light.distance = 4 + burst * maxDistance;

    if (glow && glowMaterial) {
      const visible = burst > 0.01;

      glow.visible = visible;

      if (visible) {
        const s = 0.5 + burst * 4;

        glow.scale.copy(scratchScaleRef.current.set(s, s, s));
        glowMaterial.opacity = burst * 0.85;
      }
    }
  });

  return (
    <group>
      <pointLight
        ref={lightRef}
        intensity={0}
        distance={4}
        decay={1.5}
        color={color}
      />

      {showGlowSprite && (
        <mesh ref={glowRef} visible={false}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            ref={glowMaterialRef}
            color={glowColor}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
};
