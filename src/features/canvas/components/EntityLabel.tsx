"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";
import styles from "./EntityLabel.module.scss";

const MIN_LUMINANCE = 0.45;

const ensureReadable = (color: string): string => {
  const c = new THREE.Color(color);
  const luminance = c.r * 0.299 + c.g * 0.587 + c.b * 0.114;

  if (luminance >= MIN_LUMINANCE) return color;

  const mix = (MIN_LUMINANCE - luminance) / Math.max(1 - luminance, 0.01);
  const lifted = c.clone().lerp(new THREE.Color(1, 1, 1), mix);

  return `#${lifted.getHexString()}`;
};

export interface EntityLabelProps {
  name: string;
  /** Parent-owned ref carrying current target opacity (0..1). Default 1. */
  opacityRef?: MutableRefObject<number>;
  /** Local-space offset relative to parent. Default [0, 1.2, 0]. */
  offset?: [number, number, number];
  /** Font size in CSS units. Default "0.78rem". */
  size?: string;
  color?: string;
}

export const EntityLabel = ({
  name,
  opacityRef,
  offset = [0, 1.2, 0],
  size = "0.78rem",
  color = "#f4f6ff",
}: EntityLabelProps) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const displayedRef = useRef(0);
  const initializedRef = useRef(false);

  const readableColor = useMemo(() => ensureReadable(color), [color]);

  useFrame((_state, delta) => {
    const el = elRef.current;

    if (!el) return;

    const target = opacityRef ? opacityRef.current : 1;

    if (!initializedRef.current) {
      displayedRef.current = target;
      initializedRef.current = true;
    } else {
      displayedRef.current = THREE.MathUtils.damp(
        displayedRef.current,
        target,
        6,
        delta,
      );
    }

    const o = displayedRef.current;

    if (o < 0.01) {
      el.style.opacity = "0";
      el.style.visibility = "hidden";
    } else {
      el.style.opacity = String(o);
      el.style.visibility = "visible";
    }
  });

  return (
    <Html
      position={offset}
      center
      pointerEvents="none"
      style={{ pointerEvents: "none" }}
      zIndexRange={[10, 0]}
    >
      <div
        ref={elRef}
        className={styles.label}
        style={{
          color: readableColor,
          fontSize: size,
          opacity: 0,
          visibility: "hidden",
        }}
      >
        {name}
      </div>
    </Html>
  );
};
