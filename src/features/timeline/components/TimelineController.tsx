import { Slider } from "@/common/components/form/Slider";
import { useSplintersContext } from "@/features/splinters/providers/SplintersProvider/useSplintersContext";

export const TimelineController = () => {
  const { time, onChangeTime } = useSplintersContext();

  return <Slider value={time} onChange={onChangeTime} />;
};
