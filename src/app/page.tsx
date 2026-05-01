import { SplinterView } from "@/features/splinters/components/SplinterView";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <SplinterView />
    </div>
  );
}
