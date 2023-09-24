export enum ShardState {
  Alive = "alive",
  Combined = "combined",
  Splintered = "splintered",
}

export const formatShardState = (
  value: ShardState | undefined,
): string | undefined => {
  switch (value) {
    case ShardState.Alive:
      return "Alive";
    case ShardState.Combined:
      return "Combined";
    case ShardState.Splintered:
      return "Splintered";
    default:
      return value;
  }
};
