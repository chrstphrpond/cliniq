import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.resolve(__dirname, "../globals.css"), "utf8");

describe("design tokens", () => {
  it("declares sage palette light values", () => {
    expect(css).toMatch(/--color-bg:\s*#f7f5f0/i);
    expect(css).toMatch(/--color-sage:\s*#7a9b82/i);
    expect(css).toMatch(/--color-sage-deep:\s*#2f4a3a/i);
    expect(css).toMatch(/--color-danger:\s*#a0463f/i);
  });

  it("declares dark-mode overrides", () => {
    expect(css).toMatch(/\[data-theme="dark"\][\s\S]*--color-bg:\s*#161b17/i);
    expect(css).toMatch(/\[data-theme="dark"\][\s\S]*--color-sage:\s*#8fb298/i);
  });

  it("declares motion easing and duration tokens", () => {
    expect(css).toMatch(/--ease-primary:\s*cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\)/);
    expect(css).toMatch(/--duration-short:\s*200ms/);
  });

  it("declares radii and elevation", () => {
    expect(css).toMatch(/--radius:\s*10px/);
    expect(css).toMatch(/--shadow-e2:/);
  });
});
