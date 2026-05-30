# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

The git repo root holds documentation (`README.md`, `CHANGELOG.md`, `docs/`, `gelistirme_plani.md`, `future`). **The actual Next.js application lives in the `uniblock/` subdirectory** — almost all commands must be run from there, not the repo root.

The codebase is written in **Turkish**: comments, UI copy, and user-facing error strings are all in Turkish. Match this when editing existing files.

## Commands

All run from `uniblock/`:

```bash
npm run dev            # Next.js dev server (Turbopack) at http://localhost:3000
npm run build          # Production build
npm run start          # Serve production build
npm run lint           # ESLint (eslint-config-next, core-web-vitals + typescript)

npx prisma db push     # Apply schema.prisma to the database (no migration files used)
npx prisma generate    # Regenerate Prisma Client after schema changes
npx prisma studio      # Browse/edit the database

node scripts/seed_admin.js   # Create the SUPER_ADMIN (admin@admin.com / admin)
```

There is **no test suite** and no migration history — schema changes go straight through `prisma db push`. After editing `prisma/schema.prisma`, always run `prisma generate`.

`DATABASE_URL` (PostgreSQL) is the only env var the app actually reads. The `NEXTAUTH_*` / `NEXT_PUBLIC_*` entries in `.env.example` are vestigial and unused.

## Architecture

**Stack:** Next.js 16 (App Router, RSC, Turbopack) · React 19 · TypeScript · Prisma 6 + PostgreSQL · Tailwind v4 · shadcn/ui (`base-nova` style, components in `src/components/ui/`) · Zustand · Sonner toasts · Recharts. Path alias `@/*` → `src/*`.

### Server-component → client-component data flow

The dominant pattern, repeated across every route:

- `page.tsx` is an async **Server Component**. It calls `getCurrentUser()` and queries Prisma directly, then passes plain data as props into a sibling `*Client.tsx` (`"use client"`) component that renders the interactive UI.
- Mutations go through **Server Actions** in `src/app/actions/*.ts` (each file `"use server"`): `auth`, `admin`, `club`, `post`, `interaction`, `profile`, `stats`, `survey`. Client components call these directly and typically rely on `revalidatePath` / router refresh to reflect changes.

When adding a feature, follow this split: fetch in the server `page.tsx`, mutate via an action in `src/app/actions/`, render in a `*Client.tsx`.

### Authentication & authorization (custom, not NextAuth)

Auth is a deliberately simplified cookie scheme — **there is no NextAuth, no JWT, and no password hashing**:

- On login/register (`src/app/actions/auth.ts`), two cookies are set: `auth_token` = the user's **email in plaintext**, and `user_role` = the lowercased role string.
- `getCurrentUser()` (`src/lib/session.ts`) reads the `auth_token` cookie and looks the user up by email, eager-loading `ledClubs` and `clubMemberships`. This is the single source of truth for the logged-in user in server components.
- Passwords are stored and compared in **plaintext** (see the `// Gerçek uygulamada şifre hash'lenmelidir!` notes). Don't assume hashing exists.
- Cookies are set with `secure: false` **on purpose** so they work over local HTTP / LAN IP testing even in production mode — do not "fix" this to `secure: true` without reason.
- `src/middleware.ts` does route gating: unauthenticated users are redirected to `/login`, and `/admin/*` requires a `user_role` of `super_admin`, `admin`, or `project_admin`. Note the middleware RBAC check reads the cookie only and lists a hardcoded set of protected path prefixes.

### Roles & accounts

`Role` enum: `STUDENT`, `CLUB_ADMIN`, `TEAM_ADMIN`, `PROJECT_ADMIN`, `BUSINESS_ADMIN`, `ADMIN`, `SUPER_ADMIN`. New registrations are created with `status: ACTIVE` immediately (the PENDING approval flow exists in the schema/`AccountStatus` but is commented out / bypassed in `auth.ts`). Registering as `CLUB_ADMIN` with a club name auto-creates a `Club` and adds the user as a `BOARD_MEMBER`; registering as `TEAM_ADMIN` does the same with a `Team`/`TeamMember`. Note `PROJECT_ADMIN` is **not** a team-leader role — it grants `/admin` access (see `middleware.ts`, `admin/layout.tsx`); team leaders use `TEAM_ADMIN`.

### Teams mirror Clubs

`Team`/`TeamMember` are a deliberate parallel of `Club`/`ClubMember` with full feature parity (members + join flow, posts, events, surveys, complaints/moderation, management dashboard, admin panel) **except teams have no ranking/leaderboard** — there is no `performanceScore` on `Team` and teams are excluded from all leaderboards (`feed` `topClubs`, `stats.ts`). Content ownership (`Post`/`Event`/`Survey`) is **XOR**: each row has nullable `clubId` and `teamId` and exactly one is set (enforced in app code, not the DB). `Interaction`/`Report` hang off content (post/event/survey), so likes/votes/comments/reports work for team content with no schema change. The team code largely duplicates the club code (`actions/team.ts` ≈ `actions/club.ts`, `teams/` routes ≈ `clubs/` routes); when changing one, check whether the other needs the same change. `AdminNavbar` takes a `basePath` prop (`/clubs/manage` default, `/teams/manage` for teams) to retarget its links. See `docs/arch/adr/002-takim-yapisi.md`.

### Data model (`prisma/schema.prisma`)

`User` ↔ `Club` (a club has one `leader`, plus `ClubMember` join rows). Content: `Post` (NEWS/ANNOUNCEMENT), `Event`, `Survey`/`SurveyOption`. All user engagement funnels through a single polymorphic **`Interaction`** model with an `InteractionType` (`LIKE`, `COMMENT`, `SAVE`, `RSVP`, `VOTE`, `REPORT`) and nullable FKs to post/event/survey/option — likes, comments, RSVPs, and votes are all rows in this one table. `Report` references an `Interaction` for moderation. `Faculty`/`Department` drive the dynamic registration form; `SystemSettings` is a single-row (`id = "singleton"`) config table.

### Prisma client

`src/lib/prisma.ts` exports a singleton (cached on `global` in non-production) — always import `{ prisma }` from there; never instantiate `PrismaClient` in app code.

### Route groups

- `(public)/` — `login`, `register` (no auth required).
- `(protected)/` — `feed`, `news`, `events`, `clubs`, `clubs/manage/*` (club admin dashboard, settings, stats, complaints), `teams`, `teams/manage/*` (team equivalent), `profile`.
- `admin/` — platform admin panel (students, clubs, events, complaints, departments, admins) with its own `layout.tsx` and `AdminSidebar`.

## Conventions & gotchas

- Some Prisma queries are cast through `as any` to sidestep generated-type friction around the polymorphic `Interaction` model (see `feed/page.tsx`). This is an existing workaround, not a pattern to expand.
- `scratch/` and `src/app/brain/.../scratch/` contain throwaway DB scripts (clearing data, listing/updating users) — not part of the app; ignore unless explicitly working on them.
- Recharts is listed in `transpilePackages` in `next.config.ts`; keep it there.
