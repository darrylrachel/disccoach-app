# DiscCoach — Product Roadmap & Development Phases

## MVP boundaries

In scope (four pillars only):
1. Disc Management
2. Bag Builder (rule-based intelligence, no AI, no purchase recommendations)
3. Practice Mode (time-boxed structured sessions from a template library)
4. Progress Tracking (streaks, completion, PRs, trends)

Explicitly out of scope until after MVP validation:
- AI coaching / throw video analysis
- Community / social features
- Course discovery, round tracking, tournament features (UDisc territory)
- Native mobile apps (React Native)
- Public disc-data API integration (curated internal catalog only)
- Purchase recommendations of any kind

Any feature request outside the four pillars during MVP build gets logged for later, not built.

---

## Phase 0 — Foundation

**Goal:** a running, authenticated, empty shell deployed as an installable PWA, with the architecture from [architecture.md](architecture.md) in place so every later phase slots into existing structure.

Build:
- Vite + React + TypeScript project scaffold
- Folder structure per architecture doc (`domain/`, `services/`, `features/`, `components/`, `app/`)
- Tailwind CSS with brand theme (Primary Green `#22C55E`, Accent Gold `#FFB30F`, Background `#0A0A0A`) as design tokens
- `vite-plugin-pwa` manifest + service worker, installable on mobile
- Supabase project connection (`supabaseClient.ts`), environment variable handling
- Supabase Auth: email/password sign up, sign in, sign out, session persistence
- `profiles` table + a required onboarding flow, shown once after first sign-up, that collects:
  - skill level
  - primary goal
  - throwing hand
  - primary throw style
  - approximate max distance
  - putting style
  This data seeds `profiles` and is the input future practice recommendations (Phase 3+) will key off of — it is collected but not yet acted upon in Phase 0.
- Routing shell with mobile-first bottom nav (Discs / Bags / Practice / Progress), route guards for authenticated areas (an incomplete profile redirects to onboarding before the rest of the app is reachable)
- Vitest set up for `domain/`; React Testing Library set up for components
- Base `disc_catalog` and `practice_session_templates` migrations + seed scripts (data itself can be filled during Phase 1/3, but schema exists now)

Exit criteria: a user can sign up, complete onboarding, log in, land on an empty dashboard shell, and the app installs as a PWA on a phone. CI runs lint + unit tests.

---

## Phase 1 — Disc Management

**Goal:** users can build out their real disc collection, distinct from the catalog.

Build:
- `disc_catalog` seeded with ~100-200 discs across the required manufacturers (Innova, Discraft, Dynamic Discs, Latitude 64, MVP, Axiom, Discmania, Kastaplast, Westside, Clash)
- Catalog search/browse (search by manufacturer, mold, category, stability)
- `domain/disc/flightNumbers.ts`: stability categorization, personal-vs-catalog number resolution
- Add disc flow: search catalog → select → customize (plastic, weight, color, nickname) OR manually add a disc not in the catalog (`catalog_id` left null, `custom_manufacturer`/`custom_mold_name` captured instead) — both paths are first-class, not one a fallback of the other
- Edit disc: personal flight numbers, condition, beat-in level, confidence rating, notes, favorite uses
- Disc lifecycle actions: mark `retired`, `lost`, or `traded` (status change, never a delete) vs. hard delete (only offered when a disc has no bag/session history), per the rules in [database-schema.md](database-schema.md)
- Disc list (search/filter by category, stability, status) and disc detail view showing catalog numbers vs. personal numbers side by side

Exit criteria: a user can fully represent their real bag of discs with personal characteristics that diverge from manufacturer specs, and this data persists and is scoped to them via RLS.

---

## Phase 2 — Bag Builder

**Goal:** users organize discs into bags and get rule-based intelligence about bag composition.

Build:
- Create/rename/delete bags, mark one active
- Add/remove discs to a bag, assign flight slot (putting putter, throwing putter, midrange, fairway driver, control driver, distance driver)
- `domain/bag/bagAnalysis.ts`: pure functions for
  - overlap detection (multiple discs filling the same flight-number range/slot)
  - stability gap analysis (e.g., "limited understable options")
  - speed gap analysis (missing speed ranges within a category)
  - missing shot shape detection (e.g., "no neutral fairway driver")
- Bag detail screen surfacing these insights as plain-language callouts (not disc purchase suggestions)
- Unit tests on `bagAnalysis.ts` covering the example scenarios from the product brief

Exit criteria: a user can see, for any bag, a clear rule-based readout of overlaps and gaps, with zero AI and zero purchase suggestions.

---

## Phase 3 — Practice Mode

**Goal:** the signature feature — a user opens the app, states available time, and gets a structured session.

Build:
- `practice_session_templates` seeded with a real template library across putting / distance / field work / accuracy, each with beginner/intermediate/advanced variants and 20/45/60-minute variants
- `domain/practice/sessionGenerator.ts`: given time available + goal/category + skill level → selects/assembles a session plan
- Time-picker entry screen ("I have 20 minutes" / 45 / 60, plus category choice)
- Active session screen: step through drills, log results (makes/attempts for putting, distance for distance work, boolean completion for field work drills)
- Session summary screen on completion
- `practice_sessions` + `practice_log_entries` wired to real logging
- Abandon-session handling (status transitions, no data loss)

Exit criteria: a user can run an end-to-end practice session from time selection to logged results, and that data is queryable for Phase 4.

---

## Phase 4 — Progress Tracking

**Goal:** turn logged practice into visible evidence of improvement.

Build:
- `domain/progress/progressCalculations.ts`: streak calculation, trend calculation (e.g., putting percentage over time by distance), PR detection
- `personal_records` upsert logic invoked after session completion
- Dashboard: current active bag summary, recent sessions, progress trend charts, PRs
- History screen: browsable past sessions and log entries

Exit criteria: dashboard reflects real streaks/PRs/trends derived from Phase 3 data, computed via tested domain functions.

---

## Phase 5 — PWA polish

**Goal:** make the installed-app experience feel premium and reliable in real on-course conditions (spotty signal, one-handed use).

Build:
- Offline behavior audit: cached catalog/templates available offline, graceful handling of failed writes (queue/retry or clear error state) for session logging
- Install prompts, splash screen, icons, app manifest polish
- Performance pass (bundle size, lazy loading feature routes)
- Accessibility pass (contrast against the dark `#0A0A0A` background, tap target sizing for mobile)
- Visual/UX polish pass against the "premium sports training app" brand bar

Exit criteria: app feels production-ready for real-world course use, not just desktop-dev-server use.

---

## Process

Each phase is completed and reviewed before the next begins. After each phase, report:
1. Summary of work completed
2. Files changed
3. Database changes (migrations added)
4. Tests performed
5. Remaining work / known gaps

## Future scalability (post-MVP, not scheduled)

- **AI coaching** (throw video/form analysis): new feature module + external inference service behind a new `services/` file; `domain/` untouched.
- **Advanced analytics / course strategy**: likely requires round-level data DiscCoach doesn't currently collect — would need scope discussion, potentially blurring into UDisc's territory, so treat cautiously.
- **Community**: new tables (`follows`, `shared_sessions`, etc.), new feature folder, no changes to existing pillars.
- **React Native app**: reuse `domain/` as-is; rebuild `app/`, `components/`, and native-flavored `services/`.
- **Public disc API**: swap the implementation behind `discCatalog.service.ts` without changing its interface.
