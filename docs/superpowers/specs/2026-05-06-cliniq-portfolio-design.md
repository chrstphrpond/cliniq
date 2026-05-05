# Cliniq — Dental Clinic SaaS (Portfolio Showcase)

**Spec date:** 2026-05-06
**Author:** Christopher (with Claude)
**Status:** Draft for review
**Reference:** Replicates the patient-reservation flow from Bagus Fikri's "Zendenta" UI design study (the source `.mp4` lives in this repo's root) under an original brand and a real, deployable full-stack implementation.

---

## 1. Project Overview

**Cliniq** is a SaaS for dental clinics — multi-tenant, browser-based, opinionated. This project is a portfolio showcase that demonstrates full-stack capability across:

- Real product UI/UX (calendar, patient records, dental chart, treatment plans, billing)
- Marketing surface (landing, pricing, sign-up, onboarding)
- Multi-tenant data architecture with row-level security
- Modern frontend craft (motion, accessibility, responsive layout, shadcn + 21st.dev composition)

The piece is built to be **shippable and demo-able**, not feature-complete as a production SaaS. The goal is for a recruiter or hiring manager to land on the live URL, sign in to a demo clinic, and walk a coherent end-to-end flow within five minutes.

### 1.1 Primary goals

1. Visually replicate the major Zendenta screens under the Cliniq brand with realistic seed data.
2. Make a focused subset of features (Reservations, Patients, Treatments, Billing) actually work end-to-end with real CRUD, auth, and DB persistence.
3. Ship a marketing site (landing, pricing, sign-up) with the same brand language.
4. Deploy to a public URL with a one-click "Try the demo" entry point.

### 1.2 Non-goals (out of scope)

- Real payment processing — Stripe checkout is mocked at the boundary; invoices have a "Mark paid" affordance that mutates DB state only.
- Real SMS / email delivery — the "Send reminder" button hits a stub; the UI surfaces a toast and writes an audit row.
- Multi-language / i18n.
- Native mobile app.
- Real-time multi-user collaboration / presence (single-user-at-a-time per clinic is fine).
- Insurance integrations, e-prescriptions, lab order routing.
- Fine-grained role permissioning beyond the three roles defined in §5.

---

## 2. Personas & Use Cases

| Persona | Role | Primary jobs-to-be-done |
|---|---|---|
| **Clinic Owner** | `owner` | Sign clinic up, invite staff, configure working hours and treatment catalog, see clinic-level revenue/utilisation. |
| **Dentist** | `dentist` | View today's schedule, open patient records, update dental chart, complete treatment plan visits, write notes. |
| **Receptionist** | `receptionist` | Book/reschedule/cancel appointments, register new patients, generate invoices, collect payments. |

Recruiter-as-user: lands on `/`, clicks "Try the demo", is dropped into a seeded demo clinic as a `receptionist` with notice "this is a demo, data resets every 24h."

---

## 3. Brand & Design System

### 3.1 Brand

- **Name:** Cliniq
- **Wordmark:** lowercase `cliniq` set in heading face, tracking -1%, custom `q` with a slightly elongated descender (a quiet dental-cusp reference, not a tooth icon)
- **Voice:** calm, precise, quietly confident. Never markety. Never emoji-heavy.
- **Positioning:** modern operating system for boutique and mid-size dental clinics

### 3.2 Color tokens (Sage palette)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F7F5F0` | `#161B17` | App background |
| `--bg-muted` | `#EDEAE2` | `#1A211C` | Subtle fills, table stripes |
| `--surface` | `#FFFFFF` | `#1F2622` | Cards, panels, modals |
| `--border` | `#E8E4DA` | `#2A332D` | Hairlines |
| `--border-strong` | `#D7D2C5` | `#3A4540` | Emphasised borders |
| `--text` | `#1F2A24` | `#EFE9DB` | Primary text |
| `--text-muted` | `#5C645F` | `#A8AFA6` | Secondary |
| `--text-subtle` | `#8A8F88` | `#7A8079` | Tertiary, placeholders |
| `--sage` | `#7A9B82` | `#8FB298` | Primary accent |
| `--sage-deep` | `#2F4A3A` | `#5C8A6E` | Emphasis, primary buttons |
| `--sage-soft` | `#E4ECE6` | `#243029` | Accent backgrounds |
| `--success` | `#5A8C6F` | `#7DAE92` | |
| `--warning` | `#C49A4A` | `#D8B26A` | Warm ochre |
| `--danger` | `#A0463F` | `#C16A63` | Muted brick |
| `--info` | `#6B7F8A` | `#8A9EA9` | Slate-grey (intentionally not blue) |

### 3.3 Typography

- **Display:** GT America Standard (or Inter Display as free fallback), tight tracking
- **UI:** Geist Sans
- **Numerics / IDs / time / money:** Geist Mono
- **Type scale (rem):** `0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 1.875 / 2.25 / 3 / 3.75`
- **Line heights:** body 1.55, UI 1.35, display 1.05

### 3.4 Spacing, radii, elevation

- 4px base grid: `2 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 / 96`
- App shell: 240px sidebar, 56px topbar, content max 1280px
- Radii: `--radius-sm` 6, `--radius` 10, `--radius-lg` 14, `--radius-xl` 20
- Shadows are warm-tinted (sage-charcoal):
  - `e1` `0 1px 0 0 rgba(31,42,36,.04)`
  - `e2` `0 2px 8px -2px rgba(31,42,36,.08)`
  - `e3` `0 12px 32px -8px rgba(31,42,36,.12)`
  - `e4` `0 24px 64px -16px rgba(31,42,36,.18)`

### 3.5 Motion (motion.dev)

Calm, never bouncy. Personality is "quiet competence."

- **Easings:** primary `cubic-bezier(0.22, 1, 0.36, 1)`, secondary `cubic-bezier(0.4, 0, 0.2, 1)`
- **Durations:** micro 120ms, short 200ms, medium 320ms, long 480ms
- **Patterns:**
  - Page transitions: 200ms fade + 8px y-translate
  - Sheets/modals: 320ms ease-out, content 80ms staggered after frame
  - List items: 200ms 20ms-staggered fade-up on first paint
  - Hover: 120ms color/border, no scale on UI primitives
  - Toasts: spring-in via `motion.dev` `spring({stiffness: 380, damping: 30})`
  - Number tickers (revenue, totals): 600ms in Geist Mono
- `prefers-reduced-motion` respected — falls back to 80ms fade or instant

### 3.6 Component primitives

Built on **shadcn/ui** with **21st.dev** components for higher-density patterns (calendars, kanban, command palette). Custom components built on Radix primitives where shadcn doesn't reach (notably the calendar grid and dental chart).

- Buttons: solid (sage-deep), outline (sage), ghost; sm/md/lg
- Inputs/Selects: 36px, 1px border, 2px sage focus ring + soft glow
- Cards: surface, e2, 14px radius, 24px padding, eyebrow-label section header pattern
- Status pills: filled-soft per status (Finished, Doing, Registered, Waiting, Cancelled)
- Calendar grid: custom; day columns with sage-soft hour bands; appointment cards with status color strip on left edge
- Side sheet: 480px desktop, slide from right, 320ms ease-out
- Command palette (⌘K): dense, mono numerics, sage selection
- Empty states: line-art illustrations in `--text-muted`, no stock photography
- Data viz: sage gradient family + warm-charcoal grid, rounded bars, mono axis labels

### 3.7 Iconography

Lucide as the base set. Phosphor Duotone for sidebar primary nav (slight personality lift). Stroke 1.5, 18–20px in UI.

### 3.8 Accessibility floor

- AA contrast on all body text (sage-deep on warm off-white = ~9:1)
- Visible focus rings on every interactive element (not just hover)
- Status communicated by icon + label + color (never color alone)
- Keyboard-reachable for every flow that has a working CRUD path
- Tested in CI with `axe-core` against critical pages

---

## 4. Information Architecture

### 4.1 Sitemap

```
/                         Marketing landing
/pricing                  Pricing tiers
/login                    Auth: log in
/signup                   Auth: sign up (creates clinic)
/forgot-password
/onboarding               First-run wizard (clinic + dentist + hours + seed)
/app                      Authenticated shell (redirects to /app/dashboard)
  /app/dashboard          Overview (working: read-only KPIs from real data)
  /app/reservations       Calendar (FULL CRUD)
  /app/patients           List (FULL CRUD)
  /app/patients/[id]      Patient detail + dental chart + treatment plans (FULL CRUD)
  /app/treatments         Treatment catalog + active plans (FULL CRUD)
  /app/staff              Staff list (working: invite + role change)
  /app/billing            Invoices (FULL CRUD)
  /app/sales              Sales report (visual replica, derived from real invoices)
  /app/purchases          Purchases (visual replica, seed-data only)
  /app/payment-method     Payment methods (visual replica)
  /app/stocks             Stocks (visual replica)
  /app/peripherals        Equipment (visual replica)
  /app/reports            Reports (visual replica + one real chart)
  /app/support            Customer support page (static)
  /app/settings           Clinic settings (working: hours, treatments catalog)
```

### 4.2 Working vs visual replica

**Working (full CRUD, RLS-secured, tested):**
Reservations, Patients (incl. dental chart), Treatments (catalog + plans), Billing, Staff (invite + role change), Settings (working hours, treatment catalog), Dashboard KPI tiles, Sales (read-only chart from real invoices).

**Visual replica (seeded, may be read-only or shallow):**
Purchases, Payment Method, Stocks, Peripherals, full Reports page, Support.

The distinction is documented in the in-app footer of each page in development mode and stripped for production.

---

## 5. Multi-tenancy & Authorization

### 5.1 Tenancy model

One **clinic** = one tenant. Every domain row (patient, appointment, invoice, etc.) carries `clinic_id`. Users belong to one or more clinics via `clinic_members`. The active clinic is selected at sign-in (single-clinic users skip the picker).

### 5.2 Auth

- Provider: **Supabase Auth**
- Methods: email + password, Google OAuth, magic link
- Sessions: HTTP-only cookies via `@supabase/ssr`
- Demo entry: a public "Try the demo" link on the landing page calls a server action that creates an ephemeral session attached to a shared seeded demo clinic (read-mostly; resets nightly via Supabase scheduled function)

### 5.3 Roles

| Role | Reservations | Patients | Treatments | Billing | Staff | Settings |
|---|---|---|---|---|---|---|
| `owner` | Full | Full | Full | Full | Full | Full |
| `dentist` | Read all, edit own | Full | Full | Read | Read | Read |
| `receptionist` | Full | Full | Read | Full | Read | Read |

### 5.4 RLS policies (Supabase)

Every clinic-scoped table enforces:

```sql
-- read
auth.uid() IN (
  SELECT user_id FROM clinic_members WHERE clinic_id = row.clinic_id
)
-- write (varies by role)
auth.uid() IN (
  SELECT user_id FROM clinic_members
  WHERE clinic_id = row.clinic_id AND role IN (...)
)
```

A `current_clinic_id()` SQL helper reads from a JWT custom claim set at sign-in. RLS is the primary access control; server actions add a defense-in-depth assertion.

---

## 6. Data Model (high level)

```
clinics(id, name, slug, timezone, locale, created_at)
profiles(id [=auth.users.id], full_name, avatar_url, email)
clinic_members(clinic_id, user_id, role, created_at)        -- composite PK
invitations(id, clinic_id, email, role, token, expires_at, accepted_at)

dentists(id, clinic_id, user_id, specialty, working_hours jsonb, color)
treatments_catalog(id, clinic_id, name, default_duration_min, default_price)

patients(id, clinic_id, full_name, dob, gender, phone, email, address,
         photo_url, oral_hygiene jsonb, created_at)

appointments(id, clinic_id, patient_id, dentist_id, treatment_id,
             start_at, end_at, status, notes, created_by, created_at)
  -- status: 'registered' | 'doing' | 'finished' | 'waiting_payment' | 'cancelled'

treatment_plans(id, clinic_id, patient_id, name, total_visits, completed_visits,
                created_at)
treatment_plan_visits(id, plan_id, appointment_id NULL, sequence_no, status)
  -- status: 'upcoming' | 'done' | 'skipped'

dental_chart_entries(id, clinic_id, patient_id, tooth_iso_number,
                     condition, treatment, dentist_id, performed_at, notes)

invoices(id, clinic_id, patient_id, appointment_id NULL, number,
         issued_at, due_at, status, total)
  -- status: 'draft' | 'unpaid' | 'paid' | 'void'
invoice_items(id, invoice_id, description, qty, unit_amount)

audit_log(id, clinic_id, actor_id, entity, entity_id, action, diff jsonb, at)
```

Notes:
- Tooth numbering uses ISO 3950 (FDI) — two-digit notation. Stored as smallint.
- All money columns are `numeric(12,2)` in clinic's currency (currency on `clinics`).
- Soft delete is not used; cancellations and voids are explicit statuses to preserve history.
- `audit_log` is best-effort; written by server actions, not enforced via triggers in v0.

---

## 7. Key Flows

### 7.1 Sign up & onboarding

1. `/signup` → email+password or Google
2. Server action creates `auth.users` row, `profiles` row, **and** a `clinics` row whose `owner_id` is the new user; user is inserted into `clinic_members` as `owner`.
3. Redirect to `/onboarding`:
   - Step 1 — Clinic basics (name, address, timezone, currency)
   - Step 2 — First dentist (existing user as dentist, or invite)
   - Step 3 — Working hours per weekday
   - Step 4 — Seed sample data? (optional toggle; loads demo patients + appointments for screenshot value)
4. Onboarding completion sets `clinics.onboarded_at` and redirects to `/app/dashboard`.

### 7.2 Booking an appointment

1. From `/app/reservations`, click an empty calendar slot or **+ New appointment** button
2. Side sheet slides in (patient picker w/ inline-create, treatment select, dentist select, time slot, notes)
3. Submit → server action validates (no double-booking the dentist, within working hours), inserts `appointments`, refreshes calendar
4. Optimistic UI: appointment card renders immediately with a "syncing" hairline; reverts on error

### 7.3 Patient detail + dental chart

1. `/app/patients/[id]` opens with tabs: Overview, Dental Chart, Treatment Plans, Billing, Notes
2. Dental chart renders 32-tooth ISO diagram. Clicking a tooth opens a popover with chart entries for that tooth and a "Log condition/treatment" form.
3. Logging an entry inserts `dental_chart_entries`; chart re-renders with status color on the affected tooth.

### 7.4 Multi-visit treatment plan

1. From patient detail, **+ New plan** opens a wizard (name, total visits, treatment per visit, target dentist)
2. Plan creation generates `treatment_plans` and a row per visit in `treatment_plan_visits` (no `appointment_id` until scheduled)
3. Scheduling a visit creates an `appointment` and links it back to the visit row
4. Marking a visit "done" increments `completed_visits` and updates the visit's status

### 7.5 Billing

1. Invoice can be auto-generated from a finished appointment (button on appointment detail) or created standalone from `/app/billing`
2. Invoice has line items (qty × unit), total computed in DB via a `GENERATED ALWAYS AS` column
3. Status transitions: `draft → unpaid → paid` or `draft → void`. "Mark paid" mutates state; no real Stripe call.
4. "Send reminder" stub writes an `audit_log` row and shows a toast.

---

## 8. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Hosting | Vercel |
| DB / Auth / Storage | Supabase (Postgres, Auth, Storage, Edge Functions for nightly demo reset) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + 21st.dev (composed; not vendored as black boxes) |
| Motion | motion.dev (Motion for React) |
| Forms | React Hook Form + Zod resolver |
| Validation | Zod (shared client + server schemas) |
| Data fetching | RSC + Server Actions; TanStack Query only where client-side caching is required |
| Icons | Lucide + Phosphor Duotone (selective) |
| Charts | Recharts with custom theme |
| Calendar grid | Custom (Radix `ScrollArea` + bespoke time-grid) — no FullCalendar |
| Tables | TanStack Table |
| Date/time | `date-fns` + `date-fns-tz` (clinic timezone aware) |
| Testing | Vitest + Testing Library; Playwright for E2E; axe-core for a11y |
| Package mgr | pnpm |
| Lint/format | Biome (replaces ESLint + Prettier) |
| CI | GitHub Actions |

Why this stack, in one paragraph: Next.js + Supabase eliminates the most boilerplate (auth, DB, RLS, storage, realtime if needed) while leaving plenty of surface to demonstrate full-stack chops; shadcn + 21st.dev means composed-not-stitched UI, which matches Cliniq's brand; motion.dev gives a calmer, more programmable motion API than Framer Motion's older patterns; Biome replaces a slow ESLint+Prettier setup with one fast tool.

---

## 9. Non-functional Requirements

- **Performance:** Lighthouse Performance ≥ 90 on `/`, `/pricing`, `/app/dashboard`. p95 navigation < 1.5s on a cold cache, fast 4G profile.
- **Responsive:** Desktop-first, but Reservations, Patients list, and Patient detail must be usable on tablet (≥ 768px). Phone view is graceful-degrade (cards stack, calendar collapses to agenda view).
- **Accessibility:** WCAG 2.2 AA on all working pages; axe-core in CI.
- **SEO:** Marketing pages have proper metadata, OG image, sitemap.xml, robots.txt.
- **Observability:** Sentry on the frontend and on Vercel server functions. Supabase logs for DB.
- **Security:** RLS on every clinic-scoped table; CSRF protection via Supabase SSR helpers; no service-role key exposed to the client.
- **Seed/demo:** A `pnpm seed` script generates a deterministic clinic with ~25 patients, ~120 appointments across 14 days, ~10 treatment plans, and ~30 invoices. The same script runs nightly on Supabase Edge Functions to reset the public demo.

---

## 10. Testing Strategy

| Level | Tool | Scope |
|---|---|---|
| Unit | Vitest | Pure utilities, Zod schemas, date/timezone helpers, RLS-policy SQL fixtures |
| Component | Vitest + Testing Library | Calendar grid, AppointmentCard, BookingSheet, DentalChart, InvoiceForm |
| Integration | Vitest with a Supabase test container | Server actions hit a real Postgres via the Supabase CLI's local stack |
| E2E | Playwright | Sign up → onboarding → book first appointment → finish appointment → generate invoice → mark paid |
| A11y | axe-core (Playwright fixture) | All public marketing pages and the working app pages |
| Visual regression | (out of scope for v0) | — |

CI runs unit + component + a11y on every PR; integration + E2E runs on `main` and pre-deploy.

---

## 11. Deployment & Environments

- **Local:** `pnpm dev` + `supabase start` (local stack). `.env.local` for secrets.
- **Preview:** Vercel preview URLs per PR; each preview gets a sandbox Supabase project URL via env vars.
- **Production:** `cliniq.app` (or whatever's available — TBD on domain purchase) → Vercel; production Supabase project with daily backups.
- **Demo reset:** Supabase scheduled Edge Function runs `truncate ... ; insert seeded data` at 03:00 UTC.

---

## 12. Success Criteria

The project is "done" for portfolio purposes when:

1. ✅ A public URL serves the marketing site at AA accessibility and Lighthouse ≥ 90.
2. ✅ "Try the demo" lands a recruiter inside a working `/app/dashboard` in under 5 seconds with no sign-up friction.
3. ✅ The recruiter can book an appointment, register a patient, log a dental chart entry, complete a treatment-plan visit, and generate + mark-paid an invoice — all touching real DB rows scoped by RLS.
4. ✅ All Zendenta sidebar parities (Dashboard, Reservations, Patients, Treatments, Staff, Sales, Purchases, Payment Method, Stocks, Peripherals, Reports, Support) render with realistic data; the working subset behaves correctly.
5. ✅ Repo includes a polished `README.md` with screenshots, a 60-second loom-style GIF, an architecture diagram, and a documented "what's real vs what's seeded" matrix.
6. ✅ Test suite green; CI green; no `TODO` or `FIXME` left in shipped code paths.

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Calendar grid is non-trivial; could absorb a week | Build minimal day/week view first; defer multi-dentist column virtualisation |
| RLS policy bugs leak data across clinics | Unit-test policies with seeded multi-tenant fixtures; integration tests assert cross-clinic queries return empty |
| Visual replica screens look hollow | Invest in seeded data realism (faker + curated names/treatments); add small interactive affordances even on read-only pages |
| Scope creep into all-screens-fully-working | The §4.2 working/visual split is the canonical scope contract; any deviation gets a new spec |
| Demo reset corrupts the live demo | Reset runs against a separate `demo` clinic and never touches real signups; reset is idempotent |

---

## 14. Open Questions

1. Domain name — `cliniq.app`, `getcliniq.com`, `usecliniq.com`? (Decide before launch; TBD does not block dev.)
2. Pricing page numbers — real or fictional? Recommend fictional but plausible (Starter $29, Practice $79, Multi-clinic $199 / mo) with a "Cliniq is a portfolio piece, billing is mocked" footnote.
3. Should the Dashboard include a single piece of "real" realtime UX (e.g. supabase channel on appointments) as a flex moment? Recommend yes — small surface, big "this is real software" signal.

---

## 15. Source material

- `Bagus_Fikri_-_SaaS_Designer_-_Checking_patient_reservation_OwUEWz.mp4` (in repo root) — the Zendenta UI study this project visually references.
- `frames/` — 70 deduplicated keyframes extracted from the video for design reference.
