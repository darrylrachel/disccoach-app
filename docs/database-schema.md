# DiscCoach — Database Schema

Target: Supabase (PostgreSQL). All user-owned tables use UUID primary keys, `created_at`/`updated_at` timestamps, a `user_id` foreign key to `auth.users`, and Row Level Security restricting access to the owning user.

Conventions used below:
- `id uuid primary key default gen_random_uuid()`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()` (maintained via trigger)
- `user_id uuid not null references auth.users(id) on delete cascade`

---

## 1. `profiles`

One row per user. Supports future recommendation logic (practice generation, bag analysis tuned to skill level).

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | same as `auth.users.id` (1:1) |
| display_name | text | |
| skill_level | text | enum: `beginner`, `intermediate`, `advanced`, `competitive` |
| primary_goal | text | enum: `increase_distance`, `improve_putting`, `lower_scores`, `learn_forehand`, `improve_consistency` |
| throwing_hand | text | enum: `left`, `right` |
| primary_throw_style | text | enum: `backhand`, `forehand` |
| max_distance | integer | feet, nullable, self-reported |
| forehand_distance | integer | feet, nullable |
| putting_style | text | free text or small enum (`spin`, `push`, `hybrid`), nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

RLS: `auth.uid() = id` for all operations.

---

## 2. `disc_catalog`

Shared reference data — the manufacturer's official disc specs. Public read, admin-only write. Seeded with ~100-200 discs at launch.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| manufacturer | text | e.g. "Innova" |
| mold_name | text | e.g. "Firebird" |
| plastic_types | text[] | e.g. `{Champion, Star, DX}` |
| speed | numeric | |
| glide | numeric | |
| turn | numeric | |
| fade | numeric | |
| category | text | enum: `putter`, `midrange`, `fairway_driver`, `distance_driver` |
| stability | text | enum: `very_understable`, `understable`, `stable`, `overstable`, `very_overstable` (derived at seed time from turn/fade, stored for fast filtering) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

RLS: `select` allowed for all authenticated users; `insert/update/delete` restricted to a service-role/admin context (not exposed to the client app in MVP — managed via seed scripts/migrations).

Index: btree on `(manufacturer, mold_name)`, and on `category` for bag-builder filtering.

---

## 3. `discs`

A user's personal disc — the core differentiator. May reference a `disc_catalog` entry (typical case) or stand alone (manually added disc not in the catalog). **`catalog_id` is nullable specifically so manual entry is a first-class path**, not a fallback: a user can add any disc, catalog match or not.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → auth.users | |
| catalog_id | uuid FK → disc_catalog(id), nullable | **nullable by design** — null whenever a disc is manually added and not matched to the catalog |
| custom_manufacturer | text, nullable | used only when `catalog_id` is null |
| custom_mold_name | text, nullable | used only when `catalog_id` is null |
| nickname | text, nullable | e.g. "My Champion Firebird" |
| plastic | text, nullable | selected plastic for this specific disc |
| weight | numeric, nullable | grams |
| color | text, nullable | |
| condition | text | enum: `new`, `good`, `worn`, `beat_in`, `retired-worthy` |
| beat_in_level | integer | 0-10 scale |
| personal_speed | numeric, nullable | overrides catalog numbers if the disc flies differently for this player |
| personal_glide | numeric, nullable | |
| personal_turn | numeric, nullable | |
| personal_fade | numeric, nullable | |
| confidence_rating | integer, nullable | 1-5, how much the player trusts this disc |
| notes | text, nullable | |
| favorite_uses | text[], nullable | e.g. `{"forehand roller", "hyzer flip"}` |
| status | text | enum: `active`, `retired`, `lost`, `traded` — default `active`; see lifecycle notes below |
| status_changed_at | timestamptz, nullable | when `status` last transitioned away from `active` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

RLS: `auth.uid() = user_id` for all operations.

Constraint: at least one of `catalog_id` or (`custom_manufacturer` + `custom_mold_name`) must be present — enforced via a `check` constraint.

### Disc lifecycle (`status`)

Discs are never deleted as part of normal use — status transitions preserve history instead:

- `active` — currently in the player's rotation, eligible to be added to bags.
- `retired` — the player has stopped using it (e.g., too beat-in), but keeps the record and its history.
- `lost` — no longer in the player's possession but not deliberately given up; kept for history/nostalgia and so past bag/session references stay intact.
- `traded` — given/traded/sold away; same rationale as `lost`.

Only `active` discs are selectable when adding to a bag. `bag_discs` rows referencing a disc that later changes status are left untouched (a bag reflects its state at the time discs were added; the disc detail view surfaces current status). Bag intelligence analysis (`domain/bag/bagAnalysis.ts`) considers only discs currently in the bag regardless of their global status, since removal from active bags is a separate, explicit user action.

Notes:
- Effective flight numbers displayed to the user = `personal_*` if set, else fall back to `disc_catalog.*` via `catalog_id` join. This logic lives in `domain/disc/flightNumbers.ts`, not in SQL.
- Hard delete is a real delete only if a disc has zero history (never used in a bag or logged session) — in practice, an edge case for mistakenly-added discs. The default path for a disc leaving rotation is always a `status` change, not deletion. See §7.

---

## 4. `bags`

A named collection of discs (Tournament Bag, Practice Bag, etc.).

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| name | text | e.g. "Tournament Bag" |
| description | text, nullable | |
| is_active | boolean | default false — the bag currently "in play"; UI convenience |
| created_at | timestamptz | |
| updated_at | timestamptz | |

RLS: `auth.uid() = user_id`.

---

## 5. `bag_discs`

Join table: which discs are in which bag, and their slot classification for bag intelligence analysis.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| bag_id | uuid FK → bags(id) on delete cascade | |
| disc_id | uuid FK → discs(id) on delete cascade | |
| slot | text | enum: `putting_putter`, `throwing_putter`, `midrange`, `fairway_driver`, `control_driver`, `distance_driver` (may default from `disc_catalog.category` but user-overridable) |
| added_at | timestamptz | |

RLS: enforced via join — policy checks `auth.uid()` against the owning `bags.user_id` (bag_discs has no direct `user_id`; policy uses an `exists` subquery against `bags`).

Unique constraint: `(bag_id, disc_id)` — a disc appears once per bag.

Note: bag intelligence (overlap, stability gaps, missing shot shapes) is **computed at read time** in `domain/bag/bagAnalysis.ts` from the set of discs + their effective flight numbers — it is not stored. This keeps analysis always-fresh and avoids a stale cache table.

---

## 6. `practice_session_templates`

Reference data (not user-owned) describing structured session blueprints. Seeded by DiscCoach, not user-created in MVP.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | e.g. "20-Minute Putting Tune-Up" |
| category | text | enum: `putting`, `distance`, `field_work`, `accuracy` |
| difficulty | text | enum: `beginner`, `intermediate`, `advanced` |
| duration_minutes | integer | 20 / 45 / 60 etc. |
| structure | jsonb | ordered list of drills, e.g. `[{"label": "15ft putts", "reps": 25}, {"label": "20ft putts", "reps": 25}]` |
| created_at | timestamptz | |

RLS: public read for authenticated users; write restricted to admin/seed.

`structure` is intentionally `jsonb` rather than a separate `drills` table for MVP — templates are read-heavy, written only via seed, and the drill shape is still evolving. Revisit as a normalized table if user-authored templates are added later.

---

## 7. `practice_sessions`

An instance of a user actually doing (or starting) a practice session.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| template_id | uuid FK → practice_session_templates(id), nullable | null if a free-form/custom session |
| category | text | denormalized copy of template category, for querying even if template later changes |
| duration_minutes | integer | planned duration |
| status | text | enum: `in_progress`, `completed`, `abandoned` |
| started_at | timestamptz | |
| completed_at | timestamptz, nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

RLS: `auth.uid() = user_id`.

Sessions are never hard-deleted by users in MVP (history preservation requirement) — only `status = 'abandoned'` is settable if a user quits early.

---

## 8. `practice_log_entries`

Individual results logged within a session (e.g., one putting round at one distance).

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| session_id | uuid FK → practice_sessions(id) on delete cascade | |
| user_id | uuid FK | denormalized for direct RLS + querying without a join |
| drill_label | text | e.g. "15ft putts" |
| metric_type | text | enum: `makes_attempts`, `distance_feet`, `completed_boolean` |
| attempts | integer, nullable | for putting: total putts |
| makes | integer, nullable | for putting: made putts |
| distance_feet | numeric, nullable | for distance drills |
| notes | text, nullable | |
| logged_at | timestamptz | |

RLS: `auth.uid() = user_id`.

---

## 9. `personal_records`

Denormalized PR tracking so the dashboard doesn't need to scan all history on every load.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| record_type | text | enum: `max_distance`, `putting_percentage_15ft`, `putting_percentage_20ft`, `putting_percentage_25ft`, `longest_streak_days`, ... (extensible list) |
| value | numeric | |
| achieved_at | timestamptz | |
| source_session_id | uuid FK → practice_sessions(id), nullable | traceability back to the session that produced it |
| created_at | timestamptz | |

RLS: `auth.uid() = user_id`.

PRs are computed and upserted (by `domain/progress/progressCalculations.ts` logic, invoked from the service layer after a session completes) rather than recalculated live on every dashboard load — one row per `record_type` per user, updated when beaten.

---

## Relationships summary

```
auth.users 1---1 profiles
auth.users 1---N discs
auth.users 1---N bags
bags       1---N bag_discs N---1 discs
disc_catalog 1---N discs (optional, via catalog_id)
auth.users 1---N practice_sessions
practice_session_templates 1---N practice_sessions (optional)
practice_sessions 1---N practice_log_entries
auth.users 1---N personal_records
practice_sessions 1---N personal_records (optional, via source_session_id)
```

## History preservation rules

- `discs`: lifecycle managed via `status` (`active` / `retired` / `lost` / `traded`) + `status_changed_at`, never a hard delete for normal use. Hard delete only permitted (at the DB/service layer) when a disc has zero rows in `bag_discs` history and zero references anywhere — in practice, the UI should default to a status change and treat "delete" as an edge case for mistakenly-added discs.
- `practice_sessions` / `practice_log_entries`: never deleted by the app. `status = 'abandoned'` marks incomplete sessions without erasing them.
- `personal_records`: never deleted; superseded values remain reconstructable from `practice_log_entries` history even though only the current PR is stored directly.

## Migration & seeding strategy

- Use Supabase CLI migrations (`supabase/migrations/*.sql`), checked into the repo, one migration per table/feature addition — never hand-edit the schema via the dashboard for anything beyond throwaway prototyping.
- `disc_catalog` and `practice_session_templates` seed data lives in a versioned seed script (`supabase/seed.sql` or a TypeScript seed runner), so the curated catalog is reproducible across environments.
- Generate TypeScript types from the schema (`supabase gen types typescript`) into `src/types/database.types.ts`, consumed only by `services/`.
