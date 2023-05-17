import { ChangeEvent } from "react";
import styles from "./Slider.module.scss";

export interface SliderProps {
  value?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export const Slider = ({
  value,
  minValue = 0,
  maxValue = 100,
  step = 1,
  onChange,
}: SliderProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(+event.target.value);
  };

  return (
    <input
      className={styles.slider}
      type="range"
      value={value}
      min={minValue}
      max={maxValue}
      step={step}
      title={typeof value === "number" ? `${value}` : undefined}
      onChange={handleChange}
    />
  );
};
