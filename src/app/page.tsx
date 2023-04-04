"use client";

import { Canvas } from "@/features/canvas/components/Canvas";
import { useSplintersApi } from "@/features/cms/hooks/useSplintersApi";
import { Panel } from "@/features/panel/components/Panel";
import styles from "./page.module.scss";

export default function Home() {
  // TODO Impl. some way to get and alter CMS content, consider state vs. (initial) data
  const { data, error, isLoading } = useSplintersApi();

  console.log(data);

  return (
    <div className={styles.container}>
      <Canvas />

      <Panel />
    </div>
  );
}
