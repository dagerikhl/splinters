import { withBasePath } from "@/common/utils/withBasePath";
import Image from "next/image";
import styles from "./Header.module.scss";

export const Header = () => (
  <header className={styles.container}>
    <Image
      src={withBasePath("/logo.png")}
      alt="Splinters Logo"
      width={40}
      height={40}
      priority
    />

    <h1>Splinters</h1>

    <div className={styles.author}>
      <div>
        <a
          href="https://github.com/dagerikhl"
          target="_blank"
          rel="noopener noreferrer"
        >
          dagerikhl @ GitHub
        </a>
      </div>

      <div>|</div>

      <div>
        <em>&copy; Dag Erik Løvgren 2023 –</em>
      </div>
    </div>
  </header>
);
