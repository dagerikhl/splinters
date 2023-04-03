import Image from "next/image";
import styles from "./Header.module.css";

export const Header = () => (
  <header className={styles.container}>
    <Image
      src="/logo.png"
      alt="Splinters Logo"
      width={60}
      height={60}
      priority
    />

    <h1>Splinters</h1>

    <div>TODO More content in header</div>
  </header>
);
