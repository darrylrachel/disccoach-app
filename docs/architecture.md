# DiscCoach — Architecture

## 1. Guiding constraints

- **Frontend:** React + TypeScript + Vite, mobile-first PWA. No Next.js, no React Native, no Flutter.
- **Backend:** Supabase (PostgreSQL, Auth, Row Level Security). No custom server.
- **Portability:** Business logic must be extractable into a future React Native app without rewriting it. This is the single biggest architectural constraint and drives the layering rules below.
- **Disc data:** curated internal catalog (seeded, ~100-200 discs), not a public API, for MVP.

## 2. Layered architecture

The codebase is organized so that **domain logic never imports React, Supabase, or browser APIs**. This is the rule that makes React Native portability possible later — the domain layer could be lifted into a new project unchanged.

```
UI (React components, screens)
   ↓ calls
Features (hooks, screen-level orchestration)
   ↓ calls
Services (Supabase queries, auth, storage)
   ↓ uses types from
Domain (pure TypeScript: models, business logic)
```

Dependency direction is one-way: `domain` depends on nothing in this project. `services` may depend on `domain` (for types) and on the Supabase client. `features` depend on `services` and `domain`. `app`/UI depends on `features`.

### Why this split (not just "everything in features/")

Three pieces of logic in this product are genuinely business logic, not UI logic, and are worth protecting:

- **Bag intelligence** (overlap detection, stability/speed gap analysis) — pure functions over disc data.
- **Practice session generation** (given time budget + skill level + goal → structured session) — pure functions over templates.
- **Progress/PR calculations** (streaks, trends, personal records) — pure functions over session logs.

If these live inside React components or Supabase query hooks, porting to React Native later means re-deriving the logic. If they live in `domain/`, the port is a copy-paste plus a new UI layer.

## 3. Folder structure

```
src/
  app/                      # App shell: routing, providers, layout, PWA entry
    App.tsx
    router.tsx
    providers/              # AuthProvider, QueryClientProvider, ThemeProvider
    layout/                 # AppShell, BottomNav (mobile-first), TopBar

  components/                # Shared, dumb UI components (design system)
    ui/                       # Button, Card, Input, Modal, Badge, Slider, etc.
    charts/                   # Progress charts, sparklines
    disc/                     # DiscFlightChart (speed/glide/turn/fade visual), DiscCard

  domain/                    # Pure TypeScript. No React. No Supabase. No browser APIs.
    disc/
      models.ts               # Disc, DiscCatalogEntry, FlightNumbers types
      flightNumbers.ts         # comparisons, categorization (understable/overstable etc.)
    bag/
      models.ts                # Bag, BagSlot types
      bagAnalysis.ts            # overlap detection, gap analysis (rule-based)
    practice/
      models.ts                 # PracticeSession, PracticeTemplate, LogEntry types
      sessionGenerator.ts        # time budget + goal + skill level -> session plan
    progress/
      models.ts                  # PersonalRecord, ProgressTrend types
      progressCalculations.ts     # streaks, trend calculations, PR detection
    profile/
      models.ts                   # PlayerProfile, SkillLevel, PrimaryGoal types

  features/                  # Feature-level screens + hooks, one folder per MVP pillar
    auth/
      hooks/                  # useSignIn, useSignUp, useSession
      screens/                # LoginScreen, SignUpScreen
    discs/
      hooks/                  # useDiscs, useDiscCatalogSearch, useDiscMutations
      screens/                # DiscListScreen, DiscDetailScreen, AddDiscScreen
      components/             # feature-specific components not shared elsewhere
    bags/
      hooks/                  # useBags, useBagAnalysis
      screens/                # BagListScreen, BagDetailScreen, BagBuilderScreen
      components/
    practice/
      hooks/                  # usePracticeTemplates, useStartSession, useLogEntry
      screens/                # PracticeHomeScreen (time picker), ActiveSessionScreen, SessionSummaryScreen
      components/
    progress/
      hooks/                  # useProgressDashboard, usePersonalRecords
      screens/                # DashboardScreen, HistoryScreen
      components/
    profile/
      hooks/
      screens/                # ProfileScreen, OnboardingScreen

  services/                  # All Supabase access lives here. Nowhere else.
    supabaseClient.ts
    auth.service.ts
    discs.service.ts
    discCatalog.service.ts
    bags.service.ts
    practice.service.ts
    progress.service.ts

  hooks/                     # Cross-cutting, non-feature-specific hooks
    useMediaQuery.ts
    useOnlineStatus.ts        # PWA offline awareness

  lib/                       # Small framework-agnostic utilities (date formatting, etc.)

  styles/                    # Tailwind config entry, theme tokens, global.css

  types/                     # Supabase generated types (database.types.ts)
```

### Rules of the layers

- **`domain/`** — pure functions and types only. Fully unit-testable without mocks. This is the code that could move to React Native as-is.
- **`services/`** — the *only* place that imports `@supabase/supabase-js` or issues queries. Returns/accepts domain types, not raw Supabase rows, so callers never see database shape directly.
- **`features/`** — React Query (or equivalent) hooks that call `services/`, plus screens that call those hooks. Screens may also call `domain/` functions directly for client-side calculations (e.g., rendering bag analysis from data already fetched).
- **`components/`** — presentational only, receive data via props, no data fetching.

## 4. State & data fetching

- **TanStack Query (React Query)** for all server state (discs, bags, sessions) — caching, invalidation, offline-friendly refetch behavior pairs well with PWA usage on courses with poor signal.
- **Local component state / small Zustand store (if needed)** for ephemeral UI state (active practice session timer, wizard steps). Avoid a global store for server data — Query owns that.
- No Redux. Not needed at this scope.

## 5. Auth & Row Level Security

- Supabase Auth, email/password only for MVP.
- Every user-owned table has a `user_id uuid references auth.users(id)` column and an RLS policy restricting `select/insert/update/delete` to `auth.uid() = user_id`.
- `disc_catalog` is the only table that is public-read, admin-write (no `user_id` — it's shared reference data).
- Service layer never bypasses RLS; no service-role key in the client bundle.

## 6. PWA

- `vite-plugin-pwa` for manifest + service worker.
- Cache-first for static assets and the disc catalog (rarely changes); network-first for user data.
- Installable, mobile-first layout with a bottom tab bar (Discs / Bags / Practice / Progress), since this is a phone-in-hand-on-the-course product.

## 7. Testing

- **Domain layer:** Vitest unit tests, high coverage expected since this is pure logic (bag analysis, session generation, progress calculations are the product's core differentiators and the easiest to regression-test).
- **Services:** integration tests against a local Supabase instance (or mocked client) for query shape correctness.
- **Components/features:** React Testing Library for critical flows (add disc, build bag, complete a practice session).
- **E2E:** deferred until post-MVP unless a specific flow proves fragile; Playwright would be the choice if/when added.

## 8. Why not Next.js / React Native now

- Next.js adds SSR/server infrastructure this product doesn't need — it's an authenticated, client-heavy, mostly-offline-tolerant PWA, not a content site needing SSR/SEO.
- React Native is deferred, but the domain-layer isolation above is specifically so that decision doesn't cost a rewrite later — only a new `app/`, `components/`, and `services/` (React Native-flavored Supabase client + native storage) need to be rebuilt; `domain/` ports directly.

## 9. Future scalability notes

- **Disc catalog growth:** if a public API is added later, it slots in behind `discCatalog.service.ts` — the interface (search, get-by-id) doesn't need to change, only the implementation.
- **AI coaching / video analysis:** would live as a new `features/coaching/` + a new service calling an external inference endpoint; domain layer stays untouched.
- **Community/social:** new tables + new feature folder; doesn't touch existing pillars.
- **Multi-platform:** React Native app would reuse `domain/` wholesale and reimplement `services/` against the same Supabase schema.
