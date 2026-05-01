"use client";

import { Slider } from "@/common/components/form/Slider";
import { useSplintersStore } from "@/features/splinters/store/splintersStore";

export const TimelineController = () => {
  const time = useSplintersStore((s) => s.time);
  const setTime = useSplintersStore((s) => s.setTime);

  return <Slider value={time} onChange={setTime} />;
};
