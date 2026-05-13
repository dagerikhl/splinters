import { tagToTime } from "@/features/cms/cosmere/timeline";
import { getSplinterStateAt } from "@/features/splinters/derive/getSplinterStateAt";
import { describe, expect, it } from "vitest";

describe("getSplinterStateAt", () => {
  it("returns whole+alive for Adonalsium at t=0", () => {
    const state = getSplinterStateAt({ shardId: "adonalsium", time: 0 });

    expect(state.splinterProgress).toBe(0);
    expect(state.isAlive).toBe(true);
  });

  it("returns fully splintered for Adonalsium past T0+fade", () => {
    const state = getSplinterStateAt({
      shardId: "adonalsium",
      time: tagToTime("T0") + 0.05,
    });

    expect(state.splinterProgress).toBe(1);
    expect(state.isAlive).toBe(false);
  });

  it("interpolates Adonalsium across the T0 fade window", () => {
    const state = getSplinterStateAt({
      shardId: "adonalsium",
      time: tagToTime("T0"),
    });

    expect(state.splinterProgress).toBeCloseTo(0.5);
    expect(state.isAlive).toBe(true);
  });

  it("keeps Honor whole until just before T14", () => {
    const state = getSplinterStateAt({
      shardId: "honor",
      time: tagToTime("T14") - 0.05,
    });

    expect(state.splinterProgress).toBe(0);
  });

  it("splinters Honor past T14+fade", () => {
    const state = getSplinterStateAt({
      shardId: "honor",
      time: tagToTime("T14") + 0.05,
    });

    expect(state.splinterProgress).toBe(1);
    expect(state.isAlive).toBe(false);
  });

  it("combines Preservation into Harmony at T16", () => {
    const state = getSplinterStateAt({
      shardId: "preservation",
      time: tagToTime("T16") + 0.05,
    });

    expect(state.combineProgress).toBe(1);
    expect(state.combinedWith).toBe("Harmony");
    expect(state.isAlive).toBe(false);
  });

  it("merges Honor + Odium into Retribution at T20", () => {
    const honor = getSplinterStateAt({
      shardId: "honor",
      time: tagToTime("T20") + 0.05,
    });

    expect(honor.combineProgress).toBe(1);
    expect(honor.combinedWith).toBe("Retribution");
  });

  it("manual splinter override forces fully splintered regardless of time", () => {
    const state = getSplinterStateAt({
      shardId: "cultivation",
      time: 0,
      manualSplinters: { cultivation: true },
    });

    expect(state.splinterProgress).toBe(1);
    expect(state.isAlive).toBe(false);
  });

  it("returns whole for shards with no events at any time", () => {
    const state = getSplinterStateAt({ shardId: "valor", time: 1 });

    expect(state.splinterProgress).toBe(0);
    expect(state.isAlive).toBe(true);
  });

  it("returns safe defaults for unknown shard ids", () => {
    const state = getSplinterStateAt({
      shardId: "no-such-shard",
      time: 0.5,
    });

    expect(state.splinterProgress).toBe(0);
    expect(state.isAlive).toBe(true);
  });
});
