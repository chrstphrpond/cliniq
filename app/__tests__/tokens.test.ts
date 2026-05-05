import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.resolve(__dirname, "../globals.css"), "utf8");

describe("design tokens", () => {
  it("declares sage palette light values", () => {
    expect(css).toContain("--color-bg: #F7F5F0");
    expect(css).toContain("--color-sage: #7A9B82");
    expect(css).toContain("--color-sage-deep: #2F4A3A");
    expect(css).toContain("--color-danger: #A0463F");
  });

  it("declares dark-mode overrides", () => {
    expect(css).toMatch(/\[data-theme="dark"\][\s\S]*--color-bg:\s*#161B17/);
    expect(css).toMatch(/\[data-theme="dark"\][\s\S]*--color-sage:\s*#8FB298/);
  });

  it("declares motion easing and duration tokens", () => {
    expect(css).toContain("--ease-primary: cubic-bezier(0.22, 1, 0.36, 1)");
    expect(css).toContain("--duration-short: 200ms");
  });

  it("declares radii and elevation", () => {
    expect(css).toContain("--radius: 10px");
    expect(css).toContain("--shadow-e2:");
  });
});
