import {
  smoothFade,
  tagToTime,
  TIMELINE_EVENTS,
} from "@/features/cms/cosmere/timeline";
import { describe, expect, it } from "vitest";

describe("tagToTime", () => {
  it("places pre-T0 near 0 and the last event near 1 with fade headroom", () => {
    expect(tagToTime("pre-T0")).toBeGreaterThan(0);
    expect(tagToTime("pre-T0")).toBeLessThan(0.1);
    expect(tagToTime("T20")).toBeGreaterThan(0.9);
    expect(tagToTime("T20")).toBeLessThan(1);
  });

  it("places intermediate events monotonically between 0 and 1", () => {
    const times = TIMELINE_EVENTS.map((e) => tagToTime(e.tag));

    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThan(times[i - 1]);
      expect(times[i]).toBeGreaterThanOrEqual(0);
      expect(times[i]).toBeLessThanOrEqual(1);
    }
  });

  it("throws on unknown tags", () => {
    expect(() => tagToTime("T999")).toThrow();
  });
});

describe("smoothFade", () => {
  it("returns 0 well before the center", () => {
    expect(smoothFade(0, 0.5, 0.04)).toBe(0);
  });

  it("returns 1 well after the center", () => {
    expect(smoothFade(1, 0.5, 0.04)).toBe(1);
  });

  it("returns 0.5 at the exact center", () => {
    expect(smoothFade(0.5, 0.5, 0.04)).toBeCloseTo(0.5);
  });

  it("rises monotonically across the window", () => {
    const samples = [0.46, 0.48, 0.5, 0.52, 0.54];
    const values = samples.map((s) => smoothFade(s, 0.5, 0.04));

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    }
  });
});
