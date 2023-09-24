export enum SplinterCategory {
  Aether = "aether",
  Dawnshard = "dawnshard",
  Shard = "shard",
}

export const formatSplinterCategory = (
  value: SplinterCategory | undefined,
): string | undefined => {
  switch (value) {
    case SplinterCategory.Aether:
      return "Aether";
    case SplinterCategory.Dawnshard:
      return "Dawnshard";
    case SplinterCategory.Shard:
      return "Shard";
    default:
      return value;
  }
};
