import { getDehydratedState } from "@/features/api/utils/getDehydratedState";
import { Hydrate } from "@/features/api/components/Hydrate";
import { SPLINTERS_QK } from "@/features/cms/constants/query-keys";
import { SplinterView } from "@/features/splinters/components/SplinterView";
import styles from "./page.module.scss";

export default async function Home() {
  const dehydratedState = getDehydratedState(SPLINTERS_QK);

  return (
    <Hydrate state={dehydratedState}>
      <div className={styles.container}>
        <SplinterView />
      </div>
    </Hydrate>
  );
}
