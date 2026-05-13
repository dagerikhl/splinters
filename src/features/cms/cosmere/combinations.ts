export interface IShardCombination {
  id: string;
  name: string;
  shardAId: string;
  shardBId: string;
  outerColor: string;
  emissiveColor: string;
}

export const findCombination = (id: string): IShardCombination | undefined =>
  COMBINATIONS.find((c) => c.id === id);

export const COMBINATIONS: IShardCombination[] = [
  {
    id: "harmony",
    name: "Harmony",
    shardAId: "preservation",
    shardBId: "ruin",
    outerColor: "#d6dff0",
    emissiveColor: "#94c4ff",
  },
  {
    id: "retribution",
    name: "Retribution",
    shardAId: "honor",
    shardBId: "odium",
    outerColor: "#7a4a52",
    emissiveColor: "#c83a4a",
  },
];
