# BudgetWise — Phase 4: Project Initialization

## Completed foundation

BudgetWise is initialized as a TypeScript Next.js App Router project. The foundation intentionally contains no authentication flows, database migrations, or business features; those remain in their approved later phases.

## Configuration included

- TypeScript with strict type checking and `@/*` path aliases.
- Next.js application shell under `src/app`.
- Tailwind CSS v4 PostCSS integration and global styles.
- ESLint configuration using Next.js core web-vitals and TypeScript rules.
- Prettier configuration with Tailwind class sorting.
- Prisma PostgreSQL datasource placeholder at `prisma/schema.prisma`.
- Environment-variable template in `.env.example`; real secrets are ignored by Git.
- A Git repository initialized locally with an appropriate `.gitignore`.

## Project structure

```text
src/
  app/                 # Next.js routes, layouts, and global styles
  components/
    ui/                # shared accessible primitives (later)
    features/          # feature-level UI (later)
  lib/                 # shared utilities and environment validation
  server/
    auth/              # authentication helpers (Phase 5)
    repositories/      # Prisma data access (later)
    services/          # domain rules (later)
prisma/                # schema and reviewed migrations
docs/                  # project planning and architecture documents
```

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to a local PostgreSQL database when database work begins.
3. Generate a unique `AUTH_SECRET` of at least 32 characters before authentication work begins.
4. Run `npm install`.
5. Run `npm run dev` and visit `http://localhost:3000`.

## Verification status

Dependency installation could not complete in the current execution environment: npm stalled while fetching the first package manifest and did not create `node_modules` or `package-lock.json`. The application source and configuration were inspected for structure, but `lint`, `typecheck`, and `build` remain pending until dependencies can be installed successfully.

Once installation succeeds, run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deferred work

- Apply the reviewed Phase 3 Prisma schema and database migrations after a PostgreSQL instance is configured.
- Configure Auth.js, password hashing, protected routes, and rate limiting in Phase 5.
- Add feature modules only after their Phase 6 feature is approved.
