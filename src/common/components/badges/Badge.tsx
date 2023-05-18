import cz from "classnames";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import styles from "./Badge.module.scss";

interface OwnProps {
  children?: ReactNode;
}

export type BadgeProps = OwnProps &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Badge = ({ className, children, ...rest }: BadgeProps) => {
  if (!children) {
    return null;
  }

  return (
    <div className={cz(className, styles.badge)} {...rest}>
      {children}
    </div>
  );
};
