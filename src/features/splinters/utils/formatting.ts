import { ISplinter } from "@/features/splinters/types/ISplinter";

export const formatSplinterName = <T extends ISplinter>(splinter: T): string =>
  splinter.name ?? splinter.id;
