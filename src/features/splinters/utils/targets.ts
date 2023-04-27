import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";

export const getSplinterTarget = <T extends ISplinterTarget>(
  splinter: T
): ISplinterTarget => ({ category: splinter.category, id: splinter.id });
