# AGENTS.md

## Project Overview

This project is built with:

- Nuxt 4
- Vue 3
- TypeScript
- Nuxt UI 4
- Tailwind CSS v4
- Drizzle ORM
- Better Auth
- Neon PostgreSQL
- Bun as the package manager

---

## Package Manager

Use **Bun** for every dependency and script.

Never use:

- npm
- yarn
- pnpm

Examples:

```bash
bun install
bun add <package>
bun remove <package>

bun run dev
bun run build
bun run lint
bun run check
```

---

## Development Commands

Install dependencies

```bash
bun install
```

Development

```bash
bun run dev
```

Production build

```bash
bun run build
```

Preview

```bash
bun run preview
```

Generate static site

```bash
bun run generate
```

Lint

```bash
bun run lint
```

Type check

```bash
bun run check
```

Database

```bash
bun run db:push
bun run db:studio
```

---

## Tech Stack

### Frontend

- Nuxt 4
- Vue 3 Composition API
- TypeScript
- Nuxt UI 4
- Tailwind CSS v4
- VueUse
- Nuxt Image
- Nuxt Charts

### Backend

- Nuxt Server Routes
- Better Auth
- Drizzle ORM
- PostgreSQL (Neon)

---

## Code Style

- Use TypeScript everywhere.
- Prefer Composition API.
- Prefer `<script setup lang="ts">`.
- Prefer async/await over Promise chains.
- Prefer Zod for request validation.
- Keep functions small and focused.
- Avoid `any` unless absolutely necessary.
- Prefer explicit types when inference is unclear.
- Use double quotes (`"`) and semicolons (`;`) as enforced by ESLint.

---

## Nuxt Guidelines

- Nuxt auto-imports are **DISABLED** in this project (`imports: { scan: false }, components: { dirs: [] }`). You must explicitly import components, composables, and utilities (e.g., `import MyComponent from "~/features/MyComponent.vue"`).
- Follow the Nuxt 4 standard project directory structure:
  - `app/`: Frontend application code (pages, components, layouts, features).
  - `server/`: Backend API routes, database operations, and server-side modules (`server/modules/`).
  - `shared/`: Code shared between the client and server (types, constants, schemas).
- Prefer composables over duplicated logic.
- Use server routes (`server/api/`) for backend API endpoints.
- Keep business logic and database queries inside domain-specific modules in `server/modules/` (using `service.ts` and `repo.ts`).
- Keep feature-specific UI inside `app/features/` and generic reusable UI inside `app/components/`.
- Keep reusable state inside `app/composables/`.
- Use `useFetch` or `$fetch` appropriately.
- Use runtime config for secrets.
- Never hardcode secrets.

---

## Database

- ORM: Drizzle ORM
- Database: PostgreSQL (Neon)

Guidelines:

- Never write raw SQL if Drizzle supports it.
- Keep schema inside `server/database/schema/`.
- Keep queries inside `repo.ts` and business logic inside `service.ts` within `server/modules/<feature-name>/`.
- Use migrations via Drizzle Kit.
- The schema uses Drizzle's `casing: "snake_case"`. Write your TypeScript models using `camelCase` and Drizzle will automatically map them to `snake_case` in the database.

Commands

```bash
bun run db:push
bun run db:studio
```

---

## Authentication

Use Better Auth.

Guidelines:

- Never implement custom authentication when Better Auth provides the feature.
- Keep auth logic centralized.
- Protect server routes appropriately.

---

## UI

Use Nuxt UI components whenever possible.

Before creating custom components:

1. Check whether Nuxt UI already provides it.
2. Extend existing components rather than rebuilding them.

---

## Styling

- Tailwind CSS v4 only.
- Prefer utility classes.
- Avoid inline styles.
- Keep class names readable.
- Reuse design tokens.

---

## Validation

Use Zod for:

- request validation
- form validation
- API validation

Avoid manual validation whenever possible.

---

## Linting

Before finishing changes always run:

```bash
bun run lint
bun run check
```

Code should pass both linting and type checking.

---

## Dependencies

Prefer existing dependencies before adding new ones.

Current notable libraries include:

- Better Auth
- Drizzle ORM
- date-fns
- VueUse
- Zod
- AWS SDK S3

Do not introduce another library if the existing stack already solves the problem.

---

## Best Practices

- Write readable code.
- Prefer composition over duplication.
- Keep components focused.
- Keep server logic separated from UI.
- Use strong typing.
- Follow Nuxt conventions.
- Avoid premature optimization.
- Minimize unnecessary dependencies.
- Keep files organized by feature when possible.

---

## Agent Instructions

When modifying this project:

1. Use Bun commands only.
2. Follow Nuxt 4 conventions (including `app/`, `server/`, and `shared/` directories).
3. Preserve TypeScript type safety.
4. Reuse existing composables and components.
5. Explicitly import components and composables since auto-imports are disabled.
6. Prefer Nuxt UI before creating custom UI.
7. Validate inputs with Zod.
8. Use Drizzle ORM for database operations and organize backend logic in `server/modules/`.
9. Do not introduce new dependencies unless necessary.
10. Ensure `bun run lint` and `bun run check` pass before considering work complete.
11. Keep changes minimal, idiomatic, and maintainable.
