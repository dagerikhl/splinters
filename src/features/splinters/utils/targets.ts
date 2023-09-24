import { JOINER } from "@/common/constants/JOINER";
import { SplinterCategory } from "@/features/splinters/enums/SplinterCategory";
import { ISplinterTarget } from "@/features/splinters/types/ISplinterTarget";

export const getSplinterTarget = <T extends ISplinterTarget>(
  target: T,
): ISplinterTarget => ({ category: target.category, id: target.id });

export const stringifySplinterTarget = <T extends ISplinterTarget>(
  target: T,
): string => [target.category, target.id].join(JOINER);
export const parseSplinterTarget = (id: string): ISplinterTarget => {
  const parts = id.split(JOINER);

  return { category: parts[0] as SplinterCategory, id: parts[1] };
};

export const isSameSplinter = <
  T extends ISplinterTarget,
  R extends ISplinterTarget,
>(
  a: T | undefined,
  b: R | undefined,
): boolean => !!a && !!b && a.category === b.category && a.id === b.id;
