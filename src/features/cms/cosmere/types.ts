export enum EventType {
  Shatter = "shatter",
  Splinter = "splinter",
  Combine = "combine",
  Merge = "merge",
  Settle = "settle",
  Transfer = "transfer",
}

export enum ShardLifecycle {
  Alive = "alive",
  Splintered = "splintered",
  Combined = "combined",
  Unknown = "unknown",
}

export type Species = "human" | "dragon" | "sho-del" | "unknown";

export interface IVessel {
  name: string;
  species?: Species;
}

export interface ICosmereEvent {
  tag: string;
  type: EventType;
  description: string;
  citation: string;
}

export interface ISubSplinter {
  id: string;
  name: string;
  parentShardId: string;
  description?: string;
  citation?: string;
}

export interface IShard {
  id: string;
  name: string;
  vessel?: IVessel;
  shape: { seed: number };
  lifecycle: ShardLifecycle;
  events: ICosmereEvent[];
  splitsInto?: string[];
  combinesWith?: { shardId: string; into: string };
  subSplinters?: ISubSplinter[];
  planetarySystem?: string;
  citation: string;
}

export interface IAether {
  id: string;
  name: string;
  color: string;
  origin: string;
  citation: string;
}

export interface IDawnshardBearer {
  name: string;
  period: string;
  citation: string;
}

export interface IDawnshard {
  id: string;
  name: string;
  revealed: boolean;
  bearers?: IDawnshardBearer[];
  citation: string;
}

export interface ICosmereData {
  adonalsium: IShard;
  shards: IShard[];
  aethers: IAether[];
  dawnshards: IDawnshard[];
}
