import { getDehydratedState } from "@/features/api/utils/getDehydratedState";
import { Hydrate } from "@/features/api/components/Hydrate";
import { Canvas } from "@/features/canvas/components/Canvas";
import { SPLINTERS_QK } from "@/features/cms/constants/query-keys";
import { Panel } from "@/features/panel/components/Panel";
import styles from "./page.module.scss";

export default async function Home() {
  const dehydratedState = getDehydratedState(SPLINTERS_QK);

  return (
    <Hydrate state={dehydratedState}>
      <div className={styles.container}>
        <Canvas />

        <Panel />
      </div>
    </Hydrate>
  );
}
