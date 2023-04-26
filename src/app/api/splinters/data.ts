import { SplinterState } from "@/features/cms/enums/SplinterState";
import { SplinterType } from "@/features/cms/enums/SplinterType";
import { Splinters } from "@/features/cms/types/Splinters";

export const data: Splinters = {
  splinters: [
    {
      id: "change",
      name: "Change",
      type: SplinterType.Dawnshard,
      state: SplinterState.Alive,
      vessel: "rysn",
    },
    {
      id: "life",
      name: "Life",
      type: SplinterType.Dawnshard,
      slivers: ["hoid"],
    },
    {
      id: "adonalsium",
      name: "Adonalsium",
      type: SplinterType.Omegashard,
      state: SplinterState.Splintered,
      splinters: [
        {
          id: "autonomy",
          name: "Autonomy",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "ambition",
          name: "Ambition",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "cultivation",
          name: "Cultivation",
          type: SplinterType.Shard,
          state: SplinterState.Alive,
          vessel: "koravellium-avast",
        },
        {
          id: "devotion",
          name: "Devotion",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "dominion",
          name: "Dominion",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "endowment",
          name: "Endowment",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "honor",
          name: "Honor",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "invention",
          name: "Invention",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "mercy",
          name: "Mercy",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "odium",
          name: "Odium",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "preservation",
          name: "Preservation",
          type: SplinterType.Shard,
          state: SplinterState.Combined,
          combinations: {
            harmony: ["preservation", "ruin"],
          },
          slivers: ["kelsier", "the-lord-ruler"],
        },
        {
          id: "ruin",
          name: "Ruin",
          type: SplinterType.Shard,
          state: SplinterState.Combined,
          combinations: {
            harmony: ["preservation", "ruin"],
          },
        },
        {
          id: "valor",
          name: "Valor",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "whimsy",
          name: "Whimsy",
          type: SplinterType.Shard,
          state: SplinterState.Splintered,
        },
        {
          id: "unknown1",
          name: "UNKNOWN 1",
          type: SplinterType.Shard,
        },
        {
          id: "unknown2",
          name: "UNKNOWN 2",
          type: SplinterType.Shard,
        },
      ],
    },
  ],
};
