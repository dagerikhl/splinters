import styles from "./LoadingIndicator.module.scss";

export interface LoadingIndicatorProps {
  label?: string;
}

export const LoadingIndicator = ({
  label = "Loading",
}: LoadingIndicatorProps) => <div className={styles.container}>{label}...</div>;
