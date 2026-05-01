import { getDehydratedState } from "@/features/api/utils/getDehydratedState";
import { Hydrate } from "@/features/api/components/Hydrate";
import { SHARDS_QK } from "@/features/cms/shards/constants/query-keys";
import { SplinterView } from "@/features/splinters/components/SplinterView";
import styles from "./page.module.scss";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dehydratedState = await getDehydratedState(SHARDS_QK);

  return (
    <Hydrate state={dehydratedState}>
      <div className={styles.container}>
        <SplinterView />
      </div>
    </Hydrate>
  );
}
