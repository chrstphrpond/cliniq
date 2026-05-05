# Cliniq Design System Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve font-cascade bug rendering everything as Times New Roman, fix invisible color swatches, and apply visual polish surfaced in the post-implementation audit (`docs/screenshots/`).

**Architecture:** This is a follow-up bug-fix + polish plan on top of the Foundation & Design System milestone. No new architecture. Fixes are scoped to: (1) `app/layout.tsx` (move font className), (2) `app/globals.css` (token tweaks), (3) primitives in `components/ui/` (Button, Input, Card, Wordmark), (4) the showcase route, and (5) regenerated screenshots for sign-off.

**Tech Stack:** No new dependencies. Same Next.js 16 + Tailwind v4 + Vitest + Playwright (Python) stack.

**Scope contract:** Fix-only. No new primitives, no new routes, no Supabase, no auth — those land in subsequent plans.

---

## File Structure

Files this plan creates or modifies:

- Modify: `app/layout.tsx` — move `className={fontVariables}` from `<body>` to `<html>`
- Modify: `app/globals.css` — drop `font-family` from `html` block, set on `body` instead; refine `--color-info` light value
- Modify: `components/ui/button.tsx` — solid text-white, ring-3px, refined disabled
- Modify: `components/ui/input.tsx` — placeholder muted, ring-3px
- Modify: `components/ui/wordmark.tsx` — add `xl` and `2xl` sizes
- Modify: `components/ui/card.tsx` — add optional heading level on `CardHeader`
- Modify: `components/ui/status-pill.tsx` — bump doing mix from 18 → 28
- Modify: `app/design-system/page.tsx` — swatch outlines, h1, spacing, metadata, level usage, wordmark size
- Modify: `next.config.ts` — disable Next dev indicator
- Create: `scripts/font-check.py` — Playwright assertion that fonts no longer fall back to serif
- Modify: existing component tests where API changed (Wordmark new sizes, Button disabled change)
- Regenerate: `docs/screenshots/*` (visual sign-off)

---

## Task 1: Fix font cascade — move font variables to `<html>`

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `scripts/font-check.py`

The bug: `next/font` exposes `--font-geist-sans`, `--font-geist-mono`, `--font-display-face` only on the element that carries its className. Currently that's `<body>`. But Tailwind v4's `@theme { --font-sans: var(--font-geist-sans), ...; }` and the `html { font-family: var(--font-sans); }` rule both resolve at the `<html>` level, where those next/font variables are NOT defined → they fall through to nothing → browser renders Times New Roman.

The fix: put the next/font className on `<html>` so `--font-geist-sans` etc. are available at `:root`. Also move our `font-family` rule from `html` to `body` so the cascade is unambiguous.

- [ ] **Step 1: Modify `app/layout.tsx`**

Change:

```tsx
return (
  <html lang="en" data-theme="light" suppressHydrationWarning>
    <body className={fontVariables}>{children}</body>
  </html>
);
```

to:

```tsx
return (
  <html lang="en" data-theme="light" className={fontVariables} suppressHydrationWarning>
    <body>{children}</body>
  </html>
);
```

- [ ] **Step 2: Modify `app/globals.css`**

Find the `html { ... }` block (currently sets background, color, font-family, line-height, antialiased) and split it:

```css
html {
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-sans);
  line-height: var(--leading-body);
}
```

This keeps theming (bg/color) on the document element where `data-theme` lives, but moves typography to body where consumers expect it.

- [ ] **Step 3: Create `scripts/font-check.py`**

```python
"""Verify the design system renders in Geist/Inter, not the serif fallback."""

import sys

from playwright.sync_api import sync_playwright

EXPECT_NOT = "Times New Roman"


def main() -> int:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/design-system")
        page.wait_for_load_state("networkidle")
        info = page.evaluate("""() => {
          const cs_html = getComputedStyle(document.documentElement);
          const cs_body = getComputedStyle(document.body);
          const wm = document.querySelector('[aria-label=Cliniq]');
          return {
            html: cs_html.fontFamily,
            body: cs_body.fontFamily,
            wordmark: wm ? getComputedStyle(wm).fontFamily : null,
            font_sans: cs_body.getPropertyValue('--font-sans').trim(),
            font_display: cs_body.getPropertyValue('--font-display').trim(),
          };
        }""")
        browser.close()

    print(info)
    failed = []
    for label, value in (("html", info["html"]), ("body", info["body"]), ("wordmark", info["wordmark"])):
        if EXPECT_NOT in (value or ""):
            failed.append(f"{label} renders as {value!r}")
    if not info["font_sans"]:
        failed.append("--font-sans is empty at body level")

    if failed:
        for f in failed:
            print(f"FAIL: {f}", file=sys.stderr)
        return 1
    print("OK: fonts render via Geist/Inter")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Boot dev server and run the check**

Start `pnpm dev` in the background, wait for `/design-system` to return 200, run `python scripts/font-check.py`. Expected: `OK: fonts render via Geist/Inter`. If it fails, the diagnostic output prints the actual computed `font-family` values for triage.

- [ ] **Step 5: Run unit tests + lint + typecheck**

Run: `pnpm test && pnpm typecheck && pnpm lint`. All must pass.

- [ ] **Step 6: Commit**

```powershell
git add app/layout.tsx app/globals.css scripts/font-check.py
git commit -m "fix(design-system): hoist next/font vars to <html> so --font-sans resolves"
```

---

## Task 2: Make `bg` and `surface` swatches visible

**Files:**
- Modify: `app/design-system/page.tsx`

Both swatches are near-white in light mode and disappear into the surface. Tighten the outline.

- [ ] **Step 1: Modify the swatch tile in `app/design-system/page.tsx`**

Find:

```tsx
<div
  className="h-16 rounded-[var(--radius)] border border-[var(--color-border)]"
  style={{ background: value }}
/>
```

Replace with:

```tsx
<div
  className="h-16 rounded-[var(--radius)] border border-[var(--color-border-strong)] ring-1 ring-inset ring-[var(--color-border-strong)] shadow-[var(--shadow-e1)]"
  style={{ background: value }}
/>
```

- [ ] **Step 2: Boot dev server, eyeball `/design-system`**

In a browser (or via `python scripts/screenshot.py`), confirm `bg` and `surface` swatches now have a visible outline.

- [ ] **Step 3: Run unit tests + lint + typecheck**

- [ ] **Step 4: Commit**

```powershell
git add app/design-system/page.tsx
git commit -m "fix(showcase): make near-white swatches visible with stronger outline"
```

---

## Task 3: Add `xl` and `2xl` sizes to Wordmark

**Files:**
- Modify: `components/ui/wordmark.tsx`
- Modify: `components/ui/__tests__/wordmark.test.tsx`

- [ ] **Step 1: Update the test first**

Append to `components/ui/__tests__/wordmark.test.tsx`:

```tsx
it("supports xl size mapped to text-3xl", () => {
  const { container } = render(<Wordmark size="xl" />);
  expect(container.firstChild).toHaveClass("text-[var(--text-3xl)]");
});

it("supports 2xl size mapped to text-4xl", () => {
  const { container } = render(<Wordmark size="2xl" />);
  expect(container.firstChild).toHaveClass("text-[var(--text-4xl)]");
});
```

- [ ] **Step 2: Run the test — confirm FAIL**

Run: `pnpm test components/ui/__tests__/wordmark.test.tsx`. Expected: 2 new tests fail because the size type union and switch don't cover `xl` / `2xl`.

- [ ] **Step 3: Update `components/ui/wordmark.tsx`**

Replace:

```tsx
size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "sm" ? "text-[var(--text-md)]" : size === "lg" ? "text-[var(--text-2xl)]" : "text-[var(--text-lg)]";
```

With (use a clean lookup map):

```tsx
size?: "sm" | "md" | "lg" | "xl" | "2xl";
}) {
  const sizeClass = {
    sm: "text-[var(--text-md)]",
    md: "text-[var(--text-lg)]",
    lg: "text-[var(--text-2xl)]",
    xl: "text-[var(--text-3xl)]",
    "2xl": "text-[var(--text-4xl)]",
  }[size];
```

- [ ] **Step 4: Run the test — confirm PASS** (5 tests in the wordmark suite)

- [ ] **Step 5: Bump showcase wordmark to 2xl**

In `app/design-system/page.tsx`, change `<Wordmark size="lg" />` to `<Wordmark size="2xl" />`.

- [ ] **Step 6: Run full test suite, lint, typecheck**

- [ ] **Step 7: Commit**

```powershell
git add components/ui/wordmark.tsx components/ui/__tests__/wordmark.test.tsx app/design-system/page.tsx
git commit -m "feat(ui): add xl/2xl wordmark sizes; bump showcase header"
```

---

## Task 4: Solid button uses pure white text + thicker focus ring

**Files:**
- Modify: `components/ui/button.tsx`
- Modify: `components/ui/__tests__/button.test.tsx`

- [ ] **Step 1: Update the test for solid text**

In the existing default-variant test, change:

```tsx
expect(screen.getByRole("button")).toHaveClass("bg-[var(--color-sage-deep)]");
```

to (add a second assertion):

```tsx
const btn = screen.getByRole("button");
expect(btn).toHaveClass("bg-[var(--color-sage-deep)]");
expect(btn).toHaveClass("text-white");
```

Also append a focus-ring test:

```tsx
it("uses 3px focus ring for visibility", () => {
  render(<Button>x</Button>);
  expect(screen.getByRole("button")).toHaveClass("focus-visible:ring-[3px]");
});
```

- [ ] **Step 2: Run test — FAIL**

- [ ] **Step 3: Modify `components/ui/button.tsx`**

In `buttonVariants` cva:
- Base string: change `focus-visible:ring-2` → `focus-visible:ring-[3px]`.
- Solid variant: change `text-[var(--color-bg)]` → `text-white`.
- Disabled treatment: replace `disabled:pointer-events-none disabled:opacity-50` with `disabled:pointer-events-none disabled:bg-[var(--color-bg-muted)] disabled:text-[var(--color-text-subtle)] disabled:border-[var(--color-border)]`.

- [ ] **Step 4: Run test — PASS**

- [ ] **Step 5: Run full suite + lint + typecheck**

- [ ] **Step 6: Commit**

```powershell
git add components/ui/button.tsx components/ui/__tests__/button.test.tsx
git commit -m "fix(ui): solid button uses white text; 3px focus ring; flat disabled state"
```

---

## Task 5: Differentiate "Doing" pill from "Registered"

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ui/status-pill.tsx`
- Modify: `app/__tests__/tokens.test.ts`

- [ ] **Step 1: Update the token test for the new info value**

In `app/__tests__/tokens.test.ts`, the existing test checks `--color-info` indirectly via the dark-mode regex but not light. Add a new test:

```ts
it("uses a more saturated slate for --color-info to differentiate from sage", () => {
  expect(css).toMatch(/--color-info:\s*#5c7286/i);
});
```

- [ ] **Step 2: Run test — FAIL**

- [ ] **Step 3: Update `app/globals.css`**

Change `--color-info: #6B7F8A;` → `--color-info: #5C7286;` (slightly bluer, more saturated).

- [ ] **Step 4: Update `components/ui/status-pill.tsx`**

In the `doing` config, change `var(--color-info)_18%` → `var(--color-info)_28%`.

- [ ] **Step 5: Run all tests — confirm green**

The status-pill tests don't assert specific color-mix percentages, so they should still pass. Token tests now include the new info value.

- [ ] **Step 6: Run lint + typecheck**

- [ ] **Step 7: Commit**

```powershell
git add app/globals.css app/__tests__/tokens.test.ts components/ui/status-pill.tsx
git commit -m "fix(ui): differentiate 'doing' pill from sage; tighten --color-info"
```

---

## Task 6: Input — muted placeholder + 3px focus ring

**Files:**
- Modify: `components/ui/input.tsx`
- Modify: `components/ui/__tests__/input.test.tsx`

- [ ] **Step 1: Add a focus-ring test**

Append to `components/ui/__tests__/input.test.tsx`:

```tsx
it("applies a 3px focus ring on focus-visible", () => {
  render(<Input placeholder="x" />);
  expect(screen.getByPlaceholderText("x")).toHaveClass("focus-visible:ring-[3px]");
});

it("uses muted placeholder color for AA contrast", () => {
  render(<Input placeholder="x" />);
  expect(screen.getByPlaceholderText("x")).toHaveClass("placeholder:text-[var(--color-text-muted)]");
});
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Modify `components/ui/input.tsx`**

In the className list:
- `placeholder:text-[var(--color-text-subtle)]` → `placeholder:text-[var(--color-text-muted)]`
- `focus-visible:ring-2` → `focus-visible:ring-[3px]`

- [ ] **Step 4: Run — PASS** (5 tests in input suite)

- [ ] **Step 5: Lint + typecheck**

- [ ] **Step 6: Commit**

```powershell
git add components/ui/input.tsx components/ui/__tests__/input.test.tsx
git commit -m "fix(ui): input placeholder uses muted color; 3px focus ring"
```

---

## Task 7: CardHeader gains an optional heading level

**Files:**
- Modify: `components/ui/card.tsx`
- Modify: `components/ui/__tests__/card.test.tsx`

CardHeader currently always renders a small uppercase eyebrow. For the showcase (and future pages), allow opt-in to a real heading.

- [ ] **Step 1: Add tests**

Append to `components/ui/__tests__/card.test.tsx`:

```tsx
it("CardHeader renders a heading when level is set", () => {
  render(<CardHeader level="heading">Schedule</CardHeader>);
  const node = screen.getByRole("heading", { level: 2, name: "Schedule" });
  expect(node).toBeInTheDocument();
});

it("CardHeader defaults to eyebrow (no heading role)", () => {
  render(<CardHeader>Schedule</CardHeader>);
  expect(screen.queryByRole("heading")).toBeNull();
});
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Modify `components/ui/card.tsx`**

Replace `CardHeader` with:

```tsx
export type CardHeaderProps = React.HTMLAttributes<HTMLElement> & {
  level?: "eyebrow" | "heading";
};

export const CardHeader = React.forwardRef<HTMLElement, CardHeaderProps>(
  ({ className, level = "eyebrow", ...props }, ref) => {
    if (level === "heading") {
      return (
        <h2
          ref={ref as React.Ref<HTMLHeadingElement>}
          className={cn(
            "text-[var(--text-lg)] leading-[var(--leading-ui)] font-medium text-[var(--color-text)] mb-4",
            className,
          )}
          {...(props as React.HTMLAttributes<HTMLHeadingElement>)}
        />
      );
    }
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(
          "text-[var(--text-2xs)] uppercase tracking-wider text-[var(--color-text-muted)] mb-3",
          className,
        )}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      />
    );
  },
);
CardHeader.displayName = "CardHeader";
```

- [ ] **Step 4: Run — PASS** (4 tests in card suite)

- [ ] **Step 5: Lint + typecheck**

- [ ] **Step 6: Commit**

```powershell
git add components/ui/card.tsx components/ui/__tests__/card.test.tsx
git commit -m "feat(ui): CardHeader supports level='heading' for real h2"
```

---

## Task 8: Showcase polish — h1, tighter spacing, per-route metadata

**Files:**
- Modify: `app/design-system/page.tsx`

- [ ] **Step 1: Edit `app/design-system/page.tsx`**

At top of the file, add:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design system — Cliniq",
  description: "Color tokens, typography, and component primitives.",
};
```

In the JSX:
- Change `space-y-12` → `space-y-8`.
- Inside `<header>`, add a visually-hidden `<h1>`:

  ```tsx
  <header className="flex items-center justify-between">
    <h1 className="sr-only">Cliniq design system</h1>
    <Wordmark size="2xl" />
    <ThemeToggle />
  </header>
  ```

- For each Card, change its `<CardHeader>`s to `level="heading"` to upgrade them to real `<h2>`s. Example: `<CardHeader level="heading">Color tokens</CardHeader>`. Apply to all five sections (Color tokens, Typography, Buttons, Input, Status pills).

- [ ] **Step 2: Add a `sr-only` utility if Tailwind v4 doesn't include one by default**

Tailwind v4 includes `.sr-only` by default — no action needed. If `pnpm test` or visual check shows the h1 visible, add the standard sr-only declaration to `app/globals.css`.

- [ ] **Step 3: Test, lint, typecheck**

- [ ] **Step 4: Commit**

```powershell
git add app/design-system/page.tsx
git commit -m "feat(showcase): h1 + per-route metadata; promote CardHeaders to h2"
```

---

## Task 9: Hide Next.js dev indicator

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update `next.config.ts`**

Add `devIndicators: false`:

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  devIndicators: false,
};

export default config;
```

If Next 16 rejects `false` (some versions take an object), use:

```ts
devIndicators: { appIsrStatus: false, buildActivity: false },
```

Run `pnpm dev` once, fetch `/design-system`, confirm the floating "N" badge no longer renders.

- [ ] **Step 2: Lint + typecheck**

- [ ] **Step 3: Commit**

```powershell
git add next.config.ts
git commit -m "chore: disable next.js dev indicator badge"
```

---

## Task 10: Regenerate screenshots for sign-off

**Files:**
- Modify: `docs/screenshots/*` (all 10 files)

- [ ] **Step 1: Boot dev server**

Run `pnpm dev` in the background and wait for `/design-system` to return 200.

- [ ] **Step 2: Re-capture**

Run `python scripts/screenshot.py`. Confirm all 10 images regenerate.

- [ ] **Step 3: Verify font rendering**

Run `python scripts/font-check.py`. Expected: `OK: fonts render via Geist/Inter`.

- [ ] **Step 4: Stop the dev server**

- [ ] **Step 5: Visually inspect each screenshot**

Open `docs/screenshots/design-system-light-1440.png` and `design-system-dark-1440.png`. Confirm:
- Wordmark renders in Inter (clean sans-serif), large and prominent.
- "Display 4xl" / "Display 2xl" / body / mono all use Geist (or Inter for display).
- All 10 color swatches are visible (including bg + surface).
- Solid buttons have crisp white text on dark sage.
- "Doing" pill is visibly bluer than "Registered" sage pill.
- Input focus shows a thicker sage ring (capture-only, hover reproducible manually).
- No "N" dev badge in the corner.

- [ ] **Step 6: Commit + push**

```powershell
git add docs/screenshots/
git commit -m "test: regenerate screenshots after design-system fixes"
git push
```

---

## Self-Review

**Spec coverage check:** every audit finding (C1, C2, I1–I5, M1–M10) maps to a task. M11 (Phosphor sidebar nav) is explicitly deferred to the app-shell plan; M12 (dark-mode focus ring screenshot) is covered indirectly by Task 10 since regenerated screenshots include hover/focus state captures.

**Type consistency:** `Wordmark` size union expands to 5 keys consistently in component, test, and showcase usage. `CardHeader` props evolve to `CardHeaderProps` with `level` — backward-compatible (default `"eyebrow"`).

**Placeholder scan:** every step contains exact code or exact CSS. No "TBD" / "appropriate handling" / etc.

**Risk:** Task 1 is the only behaviorally-significant change. If moving the className from body to html breaks the next/font className mechanism (it shouldn't, but Next 16 has stricter `<html>` constraints than v15), fall back to keeping it on body and instead add explicit `:root { --font-geist-sans: ...; ... }` declarations into `app/globals.css` that mirror what next/font writes. The font-check.py script will catch a regression in either approach.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-06-cliniq-design-system-fixes.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task with two-stage review.
2. **Inline Execution** — work the plan in this session with checkpoints.

Which approach?
