# AGENTS.md

## Quick reference

```bash
bun install          # install deps
bun run dev          # dev server at localhost:3000
bun run build        # production build
bun run lint         # eslint --fix
bun run check        # nuxt typecheck
bun run db:push      # push schema changes to DB
bun run db:studio    # drizzle-kit studio
bun run db:seed      # seed database (bun server/database/seed.ts)
```

No test suite exists. Lint + typecheck are the only verification steps.

## Architecture

Nuxt 4 app. Package manager is **bun** (see `bun.lock`). Do not use npm/yarn/pnpm.

**Auto-imports are disabled** (`nuxt.config.ts`: `imports.scan: false`, `components.dirs: []`). Every composable, utility, and component must be explicitly imported. This is intentional — do not re-enable auto-imports.

### Directory map

- `app/features/` — feature-organized frontend code (auth, bootcamp, course, ebook, taaruf, etc.)
- `app/pages/` — file-based routes: `(Auth)/`, `(Landing)/`, `dashboard/`
- `app/layouts/` — `auth.vue`, `default.vue`, `landing.vue`
- `app/composables/` — shared composables (`auth.ts`, `modal.ts`, `toast.ts`, `wilayah.ts`)
- `server/api/` — API routes: `auth/[...all].ts` (better-auth catch-all), `v1/` (feature endpoints)
- `server/modules/` — server-side business logic, mirrors `app/features/`
- `server/database/schema/` — Drizzle table definitions, one file per domain
- `server/database/relations.ts` — all relations defined here via `defineRelations`
- `server/utils/` — `auth.ts` (better-auth instance), `guard.ts` (auth/admin guards), `validator.ts`, `files.ts`
- `shared/env.ts` — Zod-validated env, throws on missing vars at startup

### Auth

Better Auth with email/password + admin plugin. User IDs are **numeric** (converted from string in `server/middleware/auth.ts:8-13`). Use `authGuard(event)` / `adminGuard(event)` from `server/utils/guard.ts` in API routes.

Client auth state: `useAuthSession()` composable. Route protection via `app/middleware/auth.global.ts` — dashboard requires login, admin routes require `role === "admin"`.

### Database

Drizzle ORM + PostgreSQL. Schema casing is **snake_case** (`drizzle.config.ts`). All tables use `createdUpdated` timestamps from `server/database/schema/common.ts`. Relations are centralized in `server/database/relations.ts`, not co-located with schema files.

### File storage

Cloudflare R2 via `@aws-sdk/client-s3`. Config in `shared/env.ts` (CLOUDFLARE_* vars).

## Code style

ESLint config: `@antfu/eslint-config` with **double quotes**, **2-space indent**, **semicolons**. Formatters enabled. Run `bun run lint` to auto-fix.

## Key quirks

- `shared/env.ts` is imported directly (not auto-imported) — by drizzle.config.ts, server database/index.ts, etc.
- Nuxt UI v4 theme customization is in `app/app.config.ts` (not tailwind config). Primary color is `"wewak"`.
- `nuxt-security` module is active with SRI disabled and custom CSP headers.
- The `@better-auth/drizzle-adapter` uses `relations-v2` import path, not the default.
