import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";

export const getSplinterTarget = <T extends ISplinterTarget>(
  splinter: T
): ISplinterTarget => ({ category: splinter.category, id: splinter.id });

export const isSameSplinter = <
  T extends ISplinterTarget,
  R extends ISplinterTarget
>(
  a: T | undefined,
  b: R | undefined
): boolean => !!a && !!b && a.category === b.category && a.id === b.id;
