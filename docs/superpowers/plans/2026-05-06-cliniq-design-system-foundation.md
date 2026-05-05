# Cliniq Foundation & Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the Cliniq Next.js 16 monorepo and ship a working, tested design-system foundation (tokens, typography, motion, base primitives) verifiable on a `/design-system` showcase route in both light and dark modes.

**Architecture:** Next.js 16 App Router + Tailwind CSS v4 with CSS-variable design tokens defined in `app/globals.css`. Primitives are local components under `components/ui/` built with class-variance-authority (CVA) following shadcn conventions, but vendored (not copied) so they can be edited freely. Motion utilities wrap `motion` (motion.dev) with our easing/duration tokens and respect `prefers-reduced-motion`. Tests use Vitest + Testing Library; lint/format via Biome; package manager pnpm.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, motion.dev (`motion`), class-variance-authority, tailwind-merge, lucide-react, Vitest, @testing-library/react, jsdom, Biome, pnpm, TypeScript 5.

**Scope contract:** This plan stops at a verified showcase route. It does NOT include Supabase, auth, app shell navigation, or any clinic data — those land in subsequent plans.

---

## File Structure

Files this plan creates or modifies:

- `package.json` — pnpm scripts, deps
- `pnpm-workspace.yaml` — single-package workspace (forward-compat for monorepo)
- `tsconfig.json` — strict TS config with `@/*` path alias
- `next.config.ts` — Next.js config
- `biome.json` — lint/format
- `vitest.config.ts` — Vitest + jsdom + path alias
- `vitest.setup.ts` — Testing Library matchers
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin
- `app/layout.tsx` — root layout, font wiring, theme attribute
- `app/globals.css` — Tailwind v4 import + `@theme` token definitions (sage palette, spacing, radii, shadows, motion vars)
- `app/page.tsx` — placeholder landing (one-liner, replaced in marketing plan)
- `app/design-system/page.tsx` — showcase route exercising every primitive in light + dark
- `lib/utils.ts` — `cn()` class merger
- `lib/motion.ts` — easing/duration constants + `useReducedMotionSafe` helper
- `lib/fonts.ts` — `next/font` declarations for Geist Sans, Geist Mono, Inter (Display fallback)
- `components/ui/button.tsx` — Button primitive (CVA variants)
- `components/ui/card.tsx` — Card + CardHeader/CardContent
- `components/ui/input.tsx` — Input primitive
- `components/ui/status-pill.tsx` — StatusPill (5 statuses from spec §3.6)
- `components/ui/wordmark.tsx` — `cliniq` wordmark with elongated `q`
- `components/theme-toggle.tsx` — minimal light/dark toggle (writes `data-theme` on `<html>`)
- `components/ui/__tests__/button.test.tsx` — Button tests
- `components/ui/__tests__/status-pill.test.tsx` — StatusPill tests
- `components/ui/__tests__/wordmark.test.tsx` — Wordmark test
- `lib/__tests__/motion.test.ts` — motion helper tests
- `.gitignore`, `README.md` (minimal)

Splitting rationale: each primitive lives in its own file (focused, easy to test). Tokens are colocated in `globals.css` so the design system is one grep away. `lib/` holds pure helpers; `components/` holds JSX.

---

## Task 0: Initialize Repository

**Files:**
- Create: `C:\Developer\cliniq\.gitignore`
- Create: `C:\Developer\cliniq\package.json`
- Create: `C:\Developer\cliniq\pnpm-workspace.yaml`
- Create: `C:\Developer\cliniq\README.md`

- [ ] **Step 1: Initialize git**

```powershell
cd C:\Developer\cliniq
git init
git branch -M main
```

- [ ] **Step 2: Write `.gitignore`**

```gitignore
node_modules
.next
.vercel
dist
.env*
!.env.example
.DS_Store
*.log
coverage
.turbo
.idea
.vscode
```

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "cliniq",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "engines": {
    "node": ">=20.11"
  },
  "packageManager": "pnpm@9.12.0"
}
```

- [ ] **Step 4: Write `pnpm-workspace.yaml`**

```yaml
packages:
  - .
```

- [ ] **Step 5: Write minimal `README.md`**

```markdown
# Cliniq

Portfolio SaaS — dental clinic operating system. See `docs/superpowers/specs/2026-05-06-cliniq-portfolio-design.md` for the full spec.

## Quick start

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

Visit `/design-system` to see the design system showcase.
```

- [ ] **Step 6: Commit**

```powershell
git add .gitignore package.json pnpm-workspace.yaml README.md
git commit -m "chore: initialize cliniq repository"
```

---

## Task 1: Install Next.js 16 + TypeScript + dependencies

**Files:**
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts` (auto-generated, committed)

- [ ] **Step 1: Install runtime deps**

```powershell
pnpm add next@^16 react@^19 react-dom@^19 motion@^11 class-variance-authority@^0.7 clsx@^2 tailwind-merge@^2 lucide-react@^0.454
```

- [ ] **Step 2: Install dev deps**

```powershell
pnpm add -D typescript@^5 @types/react@^19 @types/react-dom@^19 @types/node@^20 @biomejs/biome@^1.9 tailwindcss@^4 @tailwindcss/postcss@^4 postcss@^8 vitest@^2 @vitest/ui@^2 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "allowJs": false,
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
};

export default config;
```

- [ ] **Step 5: Run typecheck to verify install**

Run: `pnpm typecheck`
Expected: No errors. (`next-env.d.ts` is generated on first `next` invocation; if `tsc` complains about missing `next-env.d.ts`, run `pnpm exec next telemetry status` first to trigger generation, or create the file manually with `/// <reference types="next" />` and `/// <reference types="next/image-types/global" />`.)

- [ ] **Step 6: Commit**

```powershell
git add package.json pnpm-lock.yaml tsconfig.json next.config.ts next-env.d.ts
git commit -m "chore: install next.js 16 and core dependencies"
```

---

## Task 2: Configure Biome

**Files:**
- Create: `biome.json`

- [ ] **Step 1: Write `biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "ignoreUnknown": true, "ignore": [".next", "node_modules", "coverage"] },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": { "useImportType": "error" },
      "suspicious": { "noConsoleLog": "warn" }
    }
  },
  "javascript": { "formatter": { "quoteStyle": "double", "semicolons": "always" } }
}
```

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: PASS (no files to lint yet — Biome reports "Checked 0 files").

- [ ] **Step 3: Commit**

```powershell
git add biome.json
git commit -m "chore: configure biome"
```

---

## Task 3: Configure Tailwind v4 PostCSS pipeline

**Files:**
- Create: `postcss.config.mjs`
- Create: `app/globals.css` (tokens added in Task 5; this task only sets `@import "tailwindcss"`)

- [ ] **Step 1: Write `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 2: Write minimal `app/globals.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 3: Commit**

```powershell
git add postcss.config.mjs app/globals.css
git commit -m "chore: configure tailwind v4 postcss pipeline"
```

---

## Task 4: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 2: Write `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add a smoke test to verify the runner**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("vitest smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: PASS — `1 passed`.

- [ ] **Step 5: Commit**

```powershell
git add vitest.config.ts vitest.setup.ts lib/__tests__/smoke.test.ts
git commit -m "chore: configure vitest"
```

---

## Task 5: Define design tokens (sage palette + scales)

**Files:**
- Modify: `app/globals.css`

This is the heart of the design system. Tokens come straight from spec §3.2–§3.5.

- [ ] **Step 1: Write the failing test**

Create `app/__tests__/tokens.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test app/__tests__/tokens.test.ts`
Expected: FAIL — assertions for token strings don't match.

- [ ] **Step 3: Write `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  /* color — light defaults */
  --color-bg: #F7F5F0;
  --color-bg-muted: #EDEAE2;
  --color-surface: #FFFFFF;
  --color-border: #E8E4DA;
  --color-border-strong: #D7D2C5;
  --color-text: #1F2A24;
  --color-text-muted: #5C645F;
  --color-text-subtle: #8A8F88;
  --color-sage: #7A9B82;
  --color-sage-deep: #2F4A3A;
  --color-sage-soft: #E4ECE6;
  --color-success: #5A8C6F;
  --color-warning: #C49A4A;
  --color-danger: #A0463F;
  --color-info: #6B7F8A;

  /* typography */
  --font-display: var(--font-display-face), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace;

  /* type scale (rem) */
  --text-2xs: 0.75rem;
  --text-xs: 0.875rem;
  --text-sm: 1rem;
  --text-base: 1.125rem;
  --text-md: 1.25rem;
  --text-lg: 1.5rem;
  --text-xl: 1.875rem;
  --text-2xl: 2.25rem;
  --text-3xl: 3rem;
  --text-4xl: 3.75rem;

  /* line-heights */
  --leading-body: 1.55;
  --leading-ui: 1.35;
  --leading-display: 1.05;

  /* spacing 4px grid */
  --spacing-0_5: 2px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-24: 96px;

  /* radii */
  --radius-sm: 6px;
  --radius: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;

  /* elevation — warm sage-charcoal */
  --shadow-e1: 0 1px 0 0 rgba(31, 42, 36, 0.04);
  --shadow-e2: 0 2px 8px -2px rgba(31, 42, 36, 0.08);
  --shadow-e3: 0 12px 32px -8px rgba(31, 42, 36, 0.12);
  --shadow-e4: 0 24px 64px -16px rgba(31, 42, 36, 0.18);

  /* motion */
  --ease-primary: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-secondary: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-micro: 120ms;
  --duration-short: 200ms;
  --duration-medium: 320ms;
  --duration-long: 480ms;
}

[data-theme="dark"] {
  --color-bg: #161B17;
  --color-bg-muted: #1A211C;
  --color-surface: #1F2622;
  --color-border: #2A332D;
  --color-border-strong: #3A4540;
  --color-text: #EFE9DB;
  --color-text-muted: #A8AFA6;
  --color-text-subtle: #7A8079;
  --color-sage: #8FB298;
  --color-sage-deep: #5C8A6E;
  --color-sage-soft: #243029;
  --color-success: #7DAE92;
  --color-warning: #D8B26A;
  --color-danger: #C16A63;
  --color-info: #8A9EA9;
}

html {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: var(--leading-body);
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 80ms !important;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test app/__tests__/tokens.test.ts`
Expected: PASS — `4 passed`.

- [ ] **Step 5: Commit**

```powershell
git add app/globals.css app/__tests__/tokens.test.ts
git commit -m "feat(design-system): define sage palette, type scale, motion tokens"
```

---

## Task 6: Wire fonts via `next/font`

**Files:**
- Create: `lib/fonts.ts`

- [ ] **Step 1: Install Geist + Inter font packages**

```powershell
pnpm add geist@^1 next@^16
```

(Geist Sans + Mono ship together in `geist`. Inter comes from `next/font/google`.)

- [ ] **Step 2: Write `lib/fonts.ts`**

```ts
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-face",
});

export const fontVariables = [
  GeistSans.variable,
  GeistMono.variable,
  inter.variable,
].join(" ");

export const fontCssVars = {
  geistSans: GeistSans.variable,
  geistMono: GeistMono.variable,
  display: inter.variable,
};
```

Note: Geist exposes its CSS variables as `--font-geist-sans` and `--font-geist-mono`, which our token file already references.

- [ ] **Step 3: Commit**

```powershell
git add package.json pnpm-lock.yaml lib/fonts.ts
git commit -m "feat(design-system): wire geist + inter via next/font"
```

---

## Task 7: Root layout with theme attribute

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx` (placeholder)

- [ ] **Step 1: Write `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cliniq",
  description: "Modern operating system for boutique and mid-size dental clinics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Write placeholder `app/page.tsx`**

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "var(--spacing-12)" }}>
      <h1 style={{ fontSize: "var(--text-2xl)", lineHeight: "var(--leading-display)" }}>
        cliniq
      </h1>
      <p style={{ marginTop: "var(--spacing-4)", color: "var(--color-text-muted)" }}>
        Marketing landing lives in a later plan. See the{" "}
        <Link href="/design-system" style={{ color: "var(--color-sage-deep)" }}>
          design system showcase
        </Link>
        .
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Run dev server, verify it boots**

Run: `pnpm dev` (in a separate terminal), then `curl -s http://localhost:3000 | Select-String "cliniq"`
Expected: HTML response containing the text `cliniq`. Stop the dev server.

- [ ] **Step 4: Commit**

```powershell
git add app/layout.tsx app/page.tsx
git commit -m "feat: root layout with font variables and theme attribute"
```

---

## Task 8: `cn` utility

**Files:**
- Create: `lib/utils.ts`
- Create: `lib/__tests__/utils.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/utils.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("merges conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test lib/__tests__/utils.test.ts`
Expected: FAIL — `cn` is not defined.

- [ ] **Step 3: Write `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test lib/__tests__/utils.test.ts`
Expected: PASS — `3 passed`.

- [ ] **Step 5: Commit**

```powershell
git add lib/utils.ts lib/__tests__/utils.test.ts
git commit -m "feat: add cn utility for class merging"
```

---

## Task 9: Motion utilities

**Files:**
- Create: `lib/motion.ts`
- Create: `lib/__tests__/motion.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { easings, durations, toMs } from "@/lib/motion";

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test lib/__tests__/motion.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `lib/motion.ts`**

```ts
"use client";

import { useReducedMotion } from "motion/react";

export const easings = {
  primary: [0.22, 1, 0.36, 1] as const,
  secondary: [0.4, 0, 0.2, 1] as const,
};

export const durations = {
  micro: 0.12,
  short: 0.2,
  medium: 0.32,
  long: 0.48,
} as const;

export function toMs(seconds: number): number {
  return Math.round(seconds * 1000);
}

export function useReducedMotionSafe<T>(animated: T, reduced: T): T {
  const prefersReduced = useReducedMotion();
  return prefersReduced ? reduced : animated;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test lib/__tests__/motion.test.ts`
Expected: PASS — `4 passed`. (The `"use client"` directive does not affect Vitest; the hook is only invoked in components.)

- [ ] **Step 5: Commit**

```powershell
git add lib/motion.ts lib/__tests__/motion.test.ts
git commit -m "feat(design-system): motion easing/duration tokens and reduced-motion helper"
```

---

## Task 10: Button primitive

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/__tests__/button.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies solid variant by default", () => {
    render(<Button>x</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-[var(--color-sage-deep)]");
  });

  it("applies outline variant when requested", () => {
    render(<Button variant="outline">x</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-[var(--color-sage)]");
  });

  it("respects size prop", () => {
    render(<Button size="sm">x</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    let clicks = 0;
    render(<Button onClick={() => { clicks++; }}>x</Button>);
    await user.click(screen.getByRole("button"));
    expect(clicks).toBe(1);
  });

  it("disables pointer events when disabled", () => {
    render(<Button disabled>x</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test components/ui/__tests__/button.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/ui/button.tsx`**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] font-medium transition-colors duration-[var(--duration-micro)] ease-[var(--ease-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "bg-[var(--color-sage-deep)] text-[var(--color-bg)] hover:bg-[var(--color-sage)]",
        outline:
          "border border-[var(--color-sage)] text-[var(--color-sage-deep)] hover:bg-[var(--color-sage-soft)]",
        ghost:
          "text-[var(--color-text)] hover:bg-[var(--color-bg-muted)]",
      },
      size: {
        sm: "h-8 px-3 text-[var(--text-xs)]",
        md: "h-9 px-4 text-[var(--text-sm)]",
        lg: "h-11 px-6 text-[var(--text-base)]",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test components/ui/__tests__/button.test.tsx`
Expected: PASS — `6 passed`.

- [ ] **Step 5: Commit**

```powershell
git add components/ui/button.tsx components/ui/__tests__/button.test.tsx
git commit -m "feat(ui): add Button primitive with sage variants"
```

---

## Task 11: Card primitive

**Files:**
- Create: `components/ui/card.tsx`
- Create: `components/ui/__tests__/card.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

describe("Card", () => {
  it("renders header and content", () => {
    render(
      <Card>
        <CardHeader>Schedule</CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("applies surface background and elevation", () => {
    const { container } = render(<Card>x</Card>);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("bg-[var(--color-surface)]");
    expect(root).toHaveClass("shadow-[var(--shadow-e2)]");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test components/ui/__tests__/card.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/ui/card.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-e2)] p-6",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-[var(--text-2xs)] uppercase tracking-wider text-[var(--color-text-muted)] mb-3",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-[var(--color-text)]", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test components/ui/__tests__/card.test.tsx`
Expected: PASS — `2 passed`.

- [ ] **Step 5: Commit**

```powershell
git add components/ui/card.tsx components/ui/__tests__/card.test.tsx
git commit -m "feat(ui): add Card with eyebrow header pattern"
```

---

## Task 12: Input primitive

**Files:**
- Create: `components/ui/input.tsx`
- Create: `components/ui/__tests__/input.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Patient name" />);
    expect(screen.getByPlaceholderText("Patient name")).toBeInTheDocument();
  });

  it("is 36px tall (h-9)", () => {
    render(<Input placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toHaveClass("h-9");
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="x" />);
    await user.type(screen.getByPlaceholderText("x"), "hello");
    expect(screen.getByPlaceholderText("x")).toHaveValue("hello");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test components/ui/__tests__/input.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/ui/input.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-9 w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--text-sm)] text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]",
        "transition-colors duration-[var(--duration-micro)] ease-[var(--ease-secondary)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sage)] focus-visible:border-[var(--color-sage)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test components/ui/__tests__/input.test.tsx`
Expected: PASS — `3 passed`.

- [ ] **Step 5: Commit**

```powershell
git add components/ui/input.tsx components/ui/__tests__/input.test.tsx
git commit -m "feat(ui): add Input primitive with sage focus ring"
```

---

## Task 13: StatusPill

Spec §3.6 lists five statuses (Finished, Doing, Registered, Waiting, Cancelled). Each renders filled-soft.

**Files:**
- Create: `components/ui/status-pill.tsx`
- Create: `components/ui/__tests__/status-pill.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusPill, type AppointmentStatus } from "@/components/ui/status-pill";

const cases: { status: AppointmentStatus; label: string }[] = [
  { status: "registered", label: "Registered" },
  { status: "doing", label: "Doing" },
  { status: "finished", label: "Finished" },
  { status: "waiting_payment", label: "Waiting" },
  { status: "cancelled", label: "Cancelled" },
];

describe("StatusPill", () => {
  for (const { status, label } of cases) {
    it(`renders label for ${status}`, () => {
      render(<StatusPill status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  }

  it("communicates status with aria-label, not just color", () => {
    render(<StatusPill status="finished" />);
    expect(screen.getByLabelText("Status: Finished")).toBeInTheDocument();
  });

  it("applies a status-specific class for finished", () => {
    const { container } = render(<StatusPill status="finished" />);
    expect(container.firstChild).toHaveClass("text-[var(--color-success)]");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test components/ui/__tests__/status-pill.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/ui/status-pill.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export type AppointmentStatus =
  | "registered"
  | "doing"
  | "finished"
  | "waiting_payment"
  | "cancelled";

const config: Record<AppointmentStatus, { label: string; classes: string }> = {
  registered: {
    label: "Registered",
    classes:
      "bg-[var(--color-sage-soft)] text-[var(--color-sage-deep)]",
  },
  doing: {
    label: "Doing",
    classes:
      "bg-[color-mix(in_srgb,var(--color-info)_18%,transparent)] text-[var(--color-info)]",
  },
  finished: {
    label: "Finished",
    classes:
      "bg-[color-mix(in_srgb,var(--color-success)_18%,transparent)] text-[var(--color-success)]",
  },
  waiting_payment: {
    label: "Waiting",
    classes:
      "bg-[color-mix(in_srgb,var(--color-warning)_22%,transparent)] text-[var(--color-warning)]",
  },
  cancelled: {
    label: "Cancelled",
    classes:
      "bg-[color-mix(in_srgb,var(--color-danger)_18%,transparent)] text-[var(--color-danger)]",
  },
};

export function StatusPill({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  const { label, classes } = config[status];
  return (
    <span
      aria-label={`Status: ${label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-0.5 text-[var(--text-2xs)] font-medium",
        classes,
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test components/ui/__tests__/status-pill.test.tsx`
Expected: PASS — `7 passed`.

- [ ] **Step 5: Commit**

```powershell
git add components/ui/status-pill.tsx components/ui/__tests__/status-pill.test.tsx
git commit -m "feat(ui): add StatusPill with aria-label and color-mixed soft fills"
```

---

## Task 14: Wordmark

Spec §3.1 calls for a lowercase `cliniq` with an elongated `q` descender.

**Files:**
- Create: `components/ui/wordmark.tsx`
- Create: `components/ui/__tests__/wordmark.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Wordmark } from "@/components/ui/wordmark";

describe("Wordmark", () => {
  it("renders accessible brand name", () => {
    render(<Wordmark />);
    expect(screen.getByLabelText("Cliniq")).toBeInTheDocument();
  });

  it("renders the letters c l i n i q in order in DOM", () => {
    const { container } = render(<Wordmark />);
    expect(container.textContent).toBe("cliniq");
  });

  it("uses display font", () => {
    const { container } = render(<Wordmark />);
    expect(container.firstChild).toHaveClass("font-display");
  });
});
```

Tailwind v4 turns `--font-display` into a `font-display` utility automatically because of the `@theme` block. If the test fails on that class, switch to `style={{ fontFamily: "var(--font-display)" }}` and update the assertion to check the inline style.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test components/ui/__tests__/wordmark.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/ui/wordmark.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "sm" ? "text-[var(--text-md)]" : size === "lg" ? "text-[var(--text-2xl)]" : "text-[var(--text-lg)]";
  return (
    <span
      aria-label="Cliniq"
      className={cn(
        "font-display font-medium tracking-[-0.01em] leading-[var(--leading-display)] text-[var(--color-text)] inline-flex items-baseline",
        sizeClass,
        className,
      )}
    >
      <span aria-hidden>clini</span>
      <span aria-hidden className="relative inline-block translate-y-[0.04em]">q</span>
    </span>
  );
}
```

The `translate-y` on the final `q` gives a subtle elongated-descender feel without a custom font file.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test components/ui/__tests__/wordmark.test.tsx`
Expected: PASS — `3 passed`.

- [ ] **Step 5: Commit**

```powershell
git add components/ui/wordmark.tsx components/ui/__tests__/wordmark.test.tsx
git commit -m "feat(ui): add Wordmark with elongated-q descender"
```

---

## Task 15: Theme toggle

**Files:**
- Create: `components/theme-toggle.tsx`

- [ ] **Step 1: Write `components/theme-toggle.tsx`**

```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
    >
      {theme === "light" ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
    </Button>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/theme-toggle.tsx
git commit -m "feat: add theme toggle (light/dark)"
```

No automated test for this one — it's verified visually in Task 16. The component is small, side-effect-only, and doesn't justify a hook test in v0.

---

## Task 16: Design-system showcase route

**Files:**
- Create: `app/design-system/page.tsx`

- [ ] **Step 1: Write `app/design-system/page.tsx`**

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusPill, type AppointmentStatus } from "@/components/ui/status-pill";
import { Wordmark } from "@/components/ui/wordmark";
import { ThemeToggle } from "@/components/theme-toggle";

const statuses: AppointmentStatus[] = [
  "registered",
  "doing",
  "finished",
  "waiting_payment",
  "cancelled",
];

const swatches = [
  ["bg", "var(--color-bg)"],
  ["bg-muted", "var(--color-bg-muted)"],
  ["surface", "var(--color-surface)"],
  ["sage", "var(--color-sage)"],
  ["sage-deep", "var(--color-sage-deep)"],
  ["sage-soft", "var(--color-sage-soft)"],
  ["success", "var(--color-success)"],
  ["warning", "var(--color-warning)"],
  ["danger", "var(--color-danger)"],
  ["info", "var(--color-info)"],
] as const;

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-[1280px] p-12 space-y-12">
      <header className="flex items-center justify-between">
        <Wordmark size="lg" />
        <ThemeToggle />
      </header>

      <Card>
        <CardHeader>Color tokens</CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {swatches.map(([name, value]) => (
              <div key={name} className="flex flex-col gap-2">
                <div
                  className="h-16 rounded-[var(--radius)] border border-[var(--color-border)]"
                  style={{ background: value }}
                />
                <div className="text-[var(--text-2xs)] font-mono text-[var(--color-text-muted)]">
                  {name}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Typography</CardHeader>
        <CardContent className="space-y-3">
          <div style={{ fontSize: "var(--text-4xl)", lineHeight: "var(--leading-display)" }}>
            Display 4xl
          </div>
          <div style={{ fontSize: "var(--text-2xl)", lineHeight: "var(--leading-display)" }}>
            Display 2xl
          </div>
          <div style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-body)" }}>
            Body — calm, precise, quietly confident.
          </div>
          <div className="font-mono text-[var(--text-sm)]">
            Mono 09:30 — INV-00421 — $1,240.00
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Buttons</CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="solid" size="sm">Solid sm</Button>
          <Button variant="solid">Solid md</Button>
          <Button variant="solid" size="lg">Solid lg</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Input</CardHeader>
        <CardContent className="max-w-sm">
          <Input placeholder="Search patients" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Status pills</CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <StatusPill key={s} status={s} />
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 2: Run dev server and verify visually**

Run: `pnpm dev` (background), then open `http://localhost:3000/design-system` in a browser.

Manual checks:
- All swatches render and are distinguishable.
- Display headings render in the display face; body in Geist Sans; the mono line in Geist Mono.
- Solid buttons are sage-deep on warm off-white; outline buttons have a sage border; ghost buttons have no border.
- Input shows a sage focus ring on tab/click.
- Five status pills render with five distinct colors and each has its label visible.
- Click the moon icon — every surface and text color flips to the dark token set; the wordmark and pills remain legible.
- DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" — transitions become near-instant.

Stop the dev server.

- [ ] **Step 3: Run the full test suite**

Run: `pnpm test`
Expected: PASS for all suites — token tests, utils, motion, button, card, input, status-pill, wordmark, smoke. ~25 tests, 0 failed.

- [ ] **Step 4: Run typecheck and lint**

Run: `pnpm typecheck`
Expected: No errors.

Run: `pnpm lint`
Expected: No errors. (If Biome flags anything, fix and re-run.)

- [ ] **Step 5: Commit**

```powershell
git add app/design-system/page.tsx
git commit -m "feat: design-system showcase route"
```

---

## Task 17: README documents how to verify

**Files:**
- Modify: `C:\Developer\cliniq\README.md`

- [ ] **Step 1: Replace `README.md` with**

```markdown
# Cliniq

Portfolio SaaS — dental clinic operating system. See [`docs/superpowers/specs/2026-05-06-cliniq-portfolio-design.md`](docs/superpowers/specs/2026-05-06-cliniq-portfolio-design.md) for the full spec.

## Quick start

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

Visit `/design-system` to see the design system showcase (color tokens, typography, primitives, light/dark toggle).

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Run Next.js dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run Vitest suite once |
| `pnpm test:watch` | Watch mode |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | Biome check |
| `pnpm format` | Biome format (write) |

## What's implemented

This repo is at the **Foundation & Design System** milestone. See [`docs/superpowers/plans/`](docs/superpowers/plans/) for the active plan and what comes next.
```

- [ ] **Step 2: Commit**

```powershell
git add README.md
git commit -m "docs: README documents quick-start and current milestone"
```

---

## Self-Review Notes

This plan was reviewed against §3 (Brand & Design System) and the relevant slices of §1, §8, §9, §10:

- **Spec coverage:** §3.1 Brand → Wordmark (Task 14). §3.2 Color tokens → Task 5 + showcase (16). §3.3 Typography → Task 5 (scale, line-heights), Task 6 (font wiring). §3.4 Spacing/radii/elevation → Task 5. §3.5 Motion → Task 9 + reduced-motion CSS in Task 5. §3.6 Component primitives — Buttons (10), Cards (11), Inputs (12), Status pills (13). Wordmark (14). Calendar grid, side sheet, command palette, data viz are deferred to subsequent plans (called out in Scope contract). §3.7 Iconography — `lucide-react` installed in Task 1, used in ThemeToggle (15); Phosphor Duotone is deferred (only used in app shell sidebar, which lives in a later plan). §3.8 Accessibility floor — focus rings (Button, Input), status communicated by icon dot + label + color (StatusPill), AA contrast comes from the spec's chosen tokens. axe-core in CI is deferred to the Marketing/CI plan.
- **Type consistency:** `AppointmentStatus` defined in Task 13 is reused in Task 16. `Button` props consistent across tests and showcase. `Wordmark` `size` prop matches usage.
- **Placeholder scan:** No "TBD"/"implement later"/"appropriate error handling" patterns. Every code step has the actual code.
- **Known caveats called out inline:** `next-env.d.ts` first-run quirk (Task 1), `font-display` Tailwind utility fallback (Task 14).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-06-cliniq-design-system-foundation.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Which approach?
