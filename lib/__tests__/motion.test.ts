import { durations, easings, toMs } from "@/lib/motion";
import { describe, expect, it } from "vitest";

describe("motion tokens", () => {
  it("exposes primary cubic-bezier easing", () => {
    expect(easings.primary).toEqual([0.22, 1, 0.36, 1]);
  });

  it("exposes secondary easing", () => {
    expect(easings.secondary).toEqual([0.4, 0, 0.2, 1]);
  });

  it("exposes duration scale in seconds for motion.dev", () => {
    expect(durations.micro).toBeCloseTo(0.12);
    expect(durations.short).toBeCloseTo(0.2);
    expect(durations.medium).toBeCloseTo(0.32);
    expect(durations.long).toBeCloseTo(0.48);
  });

  it("toMs converts seconds to integer ms", () => {
    expect(toMs(0.32)).toBe(320);
  });
});
