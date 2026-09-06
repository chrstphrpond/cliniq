# Cliniq

A design-system foundation for a dental clinic application, built with Next.js, React, and TypeScript.

[Portfolio](https://chrstphrpond.dev) · [Showcase source](app/design-system/page.tsx) · [Component tests](components/ui/__tests__)

## Project scope

This public repository contains the **foundation and design-system milestone**, not a finished clinic management product. It explores reusable components, semantic design tokens, and clear appointment states.

Patient records, scheduling workflows, authentication, and a database-backed application are not implemented in this snapshot. This is a portfolio project, not software intended to handle real patient data.

## What you can explore

- A `/design-system` page showing colors, typography, components, and light/dark themes.
- Reusable buttons, cards, inputs, a wordmark, and appointment-status pills.
- Semantic CSS tokens for surfaces, text, spacing, and feedback states.
- Vitest and React Testing Library tests covering UI primitives, utilities, and tokens.
- TypeScript checking and Biome linting/formatting scripts.

## Run locally

Use Node.js 20.11 or newer and pnpm 9.12. No credentials are needed for this milestone.

```bash
git clone https://github.com/chrstphrpond/cliniq.git
cd cliniq
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000/design-system](http://localhost:3000/design-system).

## Quality checks

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

`pnpm test:watch` runs tests during development. `pnpm format` rewrites files using Biome.

## Code guide

| Location | What to review |
| --- | --- |
| [app/design-system/page.tsx](app/design-system/page.tsx) | Component composition and the showcase |
| [app/globals.css](app/globals.css) | Design tokens and global styling |
| [components/ui](components/ui) | Reusable UI primitives |
| [components/ui/__tests__](components/ui/__tests__) | Component behavior and variant tests |
| [lib](lib) | Shared utilities and motion helpers |
| [Design specification](docs/superpowers/specs/2026-05-06-cliniq-portfolio-design.md) | Planned product direction, beyond the implemented milestone |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Motion · Vitest · React Testing Library · Biome

## Author

Christopher Pond Maquidato — product design and development.

[Portfolio](https://chrstphrpond.dev) · [GitHub](https://github.com/chrstphrpond)
