"use client";

import { Canvas } from "@/features/canvas/components/Canvas";
import { Panel } from "@/features/panel/components/Panel";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <Canvas />

      <Panel />
    </div>
  );
}
