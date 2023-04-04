"use client";

import { Canvas } from "@/features/canvas/components/Canvas";
import { Panel } from "@/features/panel/components/Panel";
import { useState } from "react";
import styles from "./page.module.scss";

export default function Home() {
  // TODO Impl. some way to get and alter CMS content, consider state vs. (initial) data
  const [data, setData] = useState<any>({});

  return (
    <div className={styles.container}>
      <Canvas />

      <Panel />
    </div>
  );
}
