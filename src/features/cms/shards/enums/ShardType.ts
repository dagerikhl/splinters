export enum ShardType {
  Omegashard = "omegashard",
  Shard = "shard",
}

export const formatShardType = (
  value: ShardType | undefined,
): string | undefined => {
  switch (value) {
    case ShardType.Omegashard:
      return "Omegashard";
    case ShardType.Shard:
      return "Shard";
    default:
      return value;
  }
};
