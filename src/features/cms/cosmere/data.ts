import {
  EventType,
  IAether,
  ICosmereData,
  IDawnshard,
  IShard,
  ShardLifecycle,
} from "@/features/cms/cosmere/types";

const ADONALSIUM: IShard = {
  id: "adonalsium",
  name: "Adonalsium",
  shape: { seed: 0 },
  lifecycle: ShardLifecycle.Splintered,
  citation: "https://coppermind.net/wiki/Adonalsium",
  splitsInto: [
    "honor",
    "cultivation",
    "odium",
    "preservation",
    "ruin",
    "devotion",
    "dominion",
    "ambition",
    "autonomy",
    "endowment",
    "mercy",
    "valor",
    "invention",
    "whimsy",
    "unknown1",
    "unknown2",
  ],
  events: [
    {
      tag: "T0",
      type: EventType.Shatter,
      description: "Killed on Yolen by a conspiracy wielding the Dawnshards",
      citation: "https://coppermind.net/wiki/Shattering",
    },
  ],
};

const SHARDS: IShard[] = [
  {
    id: "honor",
    name: "Honor",
    shape: { seed: 1 },
    vessel: { name: "Tanavast", species: "human" },
    lifecycle: ShardLifecycle.Splintered,
    planetarySystem: "Roshar",
    citation: "https://coppermind.net/wiki/Honor",
    combinesWith: { shardId: "odium", into: "Retribution" },
    subSplinters: [
      {
        id: "stormfather",
        name: "Stormfather",
        parentShardId: "honor",
        description:
          "Sliver-splinter hybrid formed from Honor's residue plus Tanavast's Cognitive Shadow",
        citation: "https://coppermind.net/wiki/Stormfather",
      },
      {
        id: "the-wind",
        name: "The Wind",
        parentShardId: "honor",
        description: "Honor-aligned avatar/spren",
        citation: "https://coppermind.net/wiki/Wind",
      },
    ],
    events: [
      {
        tag: "T2",
        type: EventType.Settle,
        description: "Settles Roshar with Cultivation",
        citation: "https://coppermind.net/wiki/Tanavast",
      },
      {
        tag: "T14",
        type: EventType.Splinter,
        description: "Splintered by Rayse; Stormfather forms",
        citation: "https://coppermind.net/wiki/Honor",
      },
      {
        tag: "T20",
        type: EventType.Merge,
        description: "Merged with Odium into Retribution",
        citation: "https://coppermind.net/wiki/Retribution",
      },
    ],
  },
  {
    id: "cultivation",
    name: "Cultivation",
    shape: { seed: 2 },
    vessel: { name: "Koravellium Avast", species: "dragon" },
    lifecycle: ShardLifecycle.Alive,
    planetarySystem: "Roshar",
    citation: "https://coppermind.net/wiki/Cultivation",
    subSplinters: [
      {
        id: "nightwatcher",
        name: "Nightwatcher",
        parentShardId: "cultivation",
        description: "Splinter of Cultivation",
        citation: "https://coppermind.net/wiki/Nightwatcher",
      },
    ],
    events: [
      {
        tag: "T2",
        type: EventType.Settle,
        description: "Settles Roshar with Honor",
        citation: "https://coppermind.net/wiki/Cultivation",
      },
    ],
  },
  {
    id: "odium",
    name: "Odium",
    shape: { seed: 3 },
    vessel: { name: "Rayse", species: "human" },
    lifecycle: ShardLifecycle.Combined,
    planetarySystem: "Roshar (mobile)",
    citation: "https://coppermind.net/wiki/Odium",
    combinesWith: { shardId: "honor", into: "Retribution" },
    events: [
      {
        tag: "T7",
        type: EventType.Splinter,
        description: "Splinters Devotion and Dominion at Sel",
        citation: "https://coppermind.net/wiki/Odium",
      },
      {
        tag: "T9",
        type: EventType.Splinter,
        description: "Splinters Ambition",
        citation: "https://coppermind.net/wiki/Ambition",
      },
      {
        tag: "T14",
        type: EventType.Splinter,
        description: "Splinters Honor",
        citation: "https://coppermind.net/wiki/Honor",
      },
      {
        tag: "T18",
        type: EventType.Transfer,
        description:
          "Rayse killed by Taravangian; Taravangian Ascends as Odium",
        citation: "https://coppermind.net/wiki/Taravangian",
      },
      {
        tag: "T20",
        type: EventType.Merge,
        description: "Merged with Honor into Retribution",
        citation: "https://coppermind.net/wiki/Retribution",
      },
    ],
  },
  {
    id: "preservation",
    name: "Preservation",
    shape: { seed: 4 },
    vessel: { name: "Leras", species: "human" },
    lifecycle: ShardLifecycle.Combined,
    planetarySystem: "Scadrial",
    citation: "https://coppermind.net/wiki/Preservation",
    combinesWith: { shardId: "ruin", into: "Harmony" },
    events: [
      {
        tag: "T3",
        type: EventType.Settle,
        description: "Co-creates Scadrial with Ati",
        citation: "https://coppermind.net/wiki/Scadrial",
      },
      {
        tag: "T16",
        type: EventType.Combine,
        description: "Sazed combines Preservation and Ruin into Harmony",
        citation: "https://coppermind.net/wiki/Harmony",
      },
    ],
  },
  {
    id: "ruin",
    name: "Ruin",
    shape: { seed: 5 },
    vessel: { name: "Ati", species: "human" },
    lifecycle: ShardLifecycle.Combined,
    planetarySystem: "Scadrial",
    citation: "https://coppermind.net/wiki/Ruin",
    combinesWith: { shardId: "preservation", into: "Harmony" },
    events: [
      {
        tag: "T3",
        type: EventType.Settle,
        description: "Co-creates Scadrial with Leras",
        citation: "https://coppermind.net/wiki/Scadrial",
      },
      {
        tag: "T16",
        type: EventType.Combine,
        description:
          "Vin kills Ati; Sazed combines Preservation and Ruin into Harmony",
        citation: "https://coppermind.net/wiki/Harmony",
      },
    ],
  },
  {
    id: "devotion",
    name: "Devotion",
    shape: { seed: 6 },
    vessel: { name: "Aona", species: "human" },
    lifecycle: ShardLifecycle.Splintered,
    planetarySystem: "Sel",
    citation: "https://coppermind.net/wiki/Devotion",
    subSplinters: [
      {
        id: "seons",
        name: "Seons",
        parentShardId: "devotion",
        description: "Splinters of Devotion",
        citation: "https://coppermind.net/wiki/Seon",
      },
      {
        id: "dor-devotion",
        name: "the Dor (Devotion's portion)",
        parentShardId: "devotion",
        description:
          "Compressed Splinters of Devotion in Sel's Cognitive Realm, joint with Dominion",
        citation: "https://coppermind.net/wiki/Dor",
      },
    ],
    events: [
      {
        tag: "T6",
        type: EventType.Settle,
        description: "Settles Sel with Skai",
        citation: "https://coppermind.net/wiki/Devotion",
      },
      {
        tag: "T7",
        type: EventType.Splinter,
        description: "Killed by Odium; Splinters compress into the Dor",
        citation: "https://coppermind.net/wiki/Devotion",
      },
    ],
  },
  {
    id: "dominion",
    name: "Dominion",
    shape: { seed: 7 },
    vessel: { name: "Skai", species: "human" },
    lifecycle: ShardLifecycle.Splintered,
    planetarySystem: "Sel",
    citation: "https://coppermind.net/wiki/Dominion",
    subSplinters: [
      {
        id: "skaze",
        name: "Skaze",
        parentShardId: "dominion",
        description: "Splinters of Dominion",
        citation: "https://coppermind.net/wiki/Skaze",
      },
      {
        id: "dor-dominion",
        name: "the Dor (Dominion's portion)",
        parentShardId: "dominion",
        description:
          "Compressed Splinters of Dominion in Sel's Cognitive Realm, joint with Devotion",
        citation: "https://coppermind.net/wiki/Dor",
      },
    ],
    events: [
      {
        tag: "T6",
        type: EventType.Settle,
        description: "Settles Sel with Aona",
        citation: "https://coppermind.net/wiki/Dominion",
      },
      {
        tag: "T7",
        type: EventType.Splinter,
        description: "Killed by Odium; Splinters compress into the Dor",
        citation: "https://coppermind.net/wiki/Dominion",
      },
    ],
  },
  {
    id: "ambition",
    name: "Ambition",
    shape: { seed: 8 },
    vessel: { name: "Uli Da", species: "human" },
    lifecycle: ShardLifecycle.Splintered,
    planetarySystem: "Threnodite system (originally)",
    citation: "https://coppermind.net/wiki/Ambition",
    subSplinters: [
      {
        id: "the-evil",
        name: "the Evil",
        parentShardId: "ambition",
        description: "Splinters of Ambition haunting Threnody",
        citation: "https://coppermind.net/wiki/Threnodite_system",
      },
    ],
    events: [
      {
        tag: "T8",
        type: EventType.Splinter,
        description:
          "Mortally wounded by Odium in the Threnodite system; the Evil born",
        citation: "https://coppermind.net/wiki/Threnodite_system",
      },
      {
        tag: "T9",
        type: EventType.Splinter,
        description: "Fully Splintered by Odium",
        citation: "https://coppermind.net/wiki/Ambition",
      },
    ],
  },
  {
    id: "autonomy",
    name: "Autonomy",
    shape: { seed: 9 },
    vessel: { name: "Bavadin", species: "human" },
    lifecycle: ShardLifecycle.Alive,
    planetarySystem: "Taldain (and avatars cosmere-wide)",
    citation: "https://coppermind.net/wiki/Autonomy",
    subSplinters: [
      {
        id: "trell",
        name: "Trell",
        parentShardId: "autonomy",
        description: "Avatar of Autonomy active on Scadrial",
        citation: "https://coppermind.net/wiki/Trell",
      },
      {
        id: "patji",
        name: "Patji",
        parentShardId: "autonomy",
        description: "Avatar of Autonomy in the Pantheon of First of the Sun",
        citation: "https://coppermind.net/wiki/Patji",
      },
    ],
    events: [],
  },
  {
    id: "endowment",
    name: "Endowment",
    shape: { seed: 10 },
    vessel: { name: "Edgli", species: "human" },
    lifecycle: ShardLifecycle.Alive,
    planetarySystem: "Nalthis",
    citation: "https://coppermind.net/wiki/Endowment",
    subSplinters: [
      {
        id: "returned",
        name: "Returned",
        parentShardId: "endowment",
        description: "Splinters of Endowment manifesting as divine Breaths",
        citation: "https://coppermind.net/wiki/Returned",
      },
    ],
    events: [],
  },
  {
    id: "mercy",
    name: "Mercy",
    shape: { seed: 11 },
    lifecycle: ShardLifecycle.Alive,
    citation: "https://coppermind.net/wiki/Mercy",
    events: [
      {
        tag: "T8",
        type: EventType.Settle,
        description:
          "Fought alongside Ambition in the Threnodite system; wounded but not Splintered",
        citation: "https://coppermind.net/wiki/Threnodite_system",
      },
    ],
  },
  {
    id: "valor",
    name: "Valor",
    shape: { seed: 12 },
    vessel: { name: "Medelantorius", species: "dragon" },
    lifecycle: ShardLifecycle.Alive,
    citation: "https://coppermind.net/wiki/Valor",
    events: [],
  },
  {
    id: "invention",
    name: "Invention",
    shape: { seed: 13 },
    vessel: { name: "Chan Ko Sar" },
    lifecycle: ShardLifecycle.Alive,
    citation: "https://coppermind.net/wiki/Invention",
    events: [],
  },
  {
    id: "whimsy",
    name: "Whimsy",
    shape: { seed: 14 },
    lifecycle: ShardLifecycle.Alive,
    citation: "https://coppermind.net/wiki/Whimsy",
    events: [],
  },
  {
    id: "unknown1",
    name: "Unrevealed Shard",
    shape: { seed: 15 },
    lifecycle: ShardLifecycle.Unknown,
    citation: "https://coppermind.net/wiki/Letters",
    events: [],
  },
  {
    id: "unknown2",
    name: "Unrevealed Shard",
    shape: { seed: 16 },
    lifecycle: ShardLifecycle.Unknown,
    citation: "https://coppermind.net/wiki/Letters",
    events: [],
  },
];

const AETHERS: IAether[] = [
  {
    id: "verdant",
    name: "Verdant",
    color: "#3aaa5b",
    origin: "Dhatri",
    citation: "https://coppermind.net/wiki/Aether",
  },
  {
    id: "roseite",
    name: "Roseite",
    color: "#e98ea8",
    origin: "Dhatri",
    citation: "https://coppermind.net/wiki/Aether",
  },
  {
    id: "zephyr",
    name: "Zephyr",
    color: "#3a86d6",
    origin: "Dhatri (Sapphire Sea)",
    citation: "https://coppermind.net/wiki/Aether",
  },
  {
    id: "crimson",
    name: "Crimson",
    color: "#c73a3a",
    origin: "Dhatri",
    citation: "https://coppermind.net/wiki/Aether",
  },
  {
    id: "sunlight",
    name: "Sunlight",
    color: "#f6d04d",
    origin: "Dhatri",
    citation: "https://coppermind.net/wiki/Aether",
  },
  {
    id: "midnight",
    name: "Midnight",
    color: "#1c1830",
    origin: "Dhatri (Lumar)",
    citation: "https://coppermind.net/wiki/Aether",
  },
];

const DAWNSHARDS: IDawnshard[] = [
  {
    id: "change",
    name: "Change",
    revealed: true,
    bearers: [
      {
        name: "Rysn Ftori",
        period: "Stormlight Archive era",
        citation: "https://coppermind.net/wiki/Rysn_Ftori",
      },
    ],
    citation: "https://coppermind.net/wiki/Dawnshard",
  },
  {
    id: "exist",
    name: "Exist",
    revealed: true,
    bearers: [
      {
        name: "Hoid",
        period: "Pre-Shattering",
        citation: "https://coppermind.net/wiki/Hoid",
      },
    ],
    citation: "https://coppermind.net/wiki/Dawnshard",
  },
  {
    id: "dawnshard-3",
    name: "Unrevealed Dawnshard",
    revealed: false,
    citation: "https://coppermind.net/wiki/Dawnshard",
  },
  {
    id: "dawnshard-4",
    name: "Unrevealed Dawnshard",
    revealed: false,
    citation: "https://coppermind.net/wiki/Dawnshard",
  },
];

export const COSMERE_DATA: ICosmereData = {
  adonalsium: ADONALSIUM,
  shards: SHARDS,
  aethers: AETHERS,
  dawnshards: DAWNSHARDS,
};

export const findShard = (id: string): IShard | undefined => {
  if (id === COSMERE_DATA.adonalsium.id) {
    return COSMERE_DATA.adonalsium;
  }

  return COSMERE_DATA.shards.find((s) => s.id === id);
};
