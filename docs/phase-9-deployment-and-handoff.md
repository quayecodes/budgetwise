# Phase 9 - Deployment & Handoff

## Objective

Prepare BudgetWise for release readiness, document the deployment path, and package the project in a way that is clear for evaluation, portfolio presentation, and future extension.

## Completed Baseline

The application is currently in a verified working state:

- Authentication and authorization are implemented.
- Core financial features are in place for transactions, budgets, savings goals, dashboard metrics, and profile preferences.
- UI refinement is complete with a coherent app shell and responsive design.
- Validation and test coverage are in place.
- Security review and project documentation have been recorded.

## Deliverables for This Phase

### 1. Production deployment readiness

The app should be prepared for deployment with the following checks before public release:

- Confirm the PostgreSQL database is production-ready and migrated correctly.
- Set environment variables securely for all deployment targets.
- Enable secure session handling in the hosting environment.
- Configure a production `AUTH_SECRET` and ensure it is never committed.
- Review CORS, cookie settings, and host configuration for production.
- Confirm `NEXT_PUBLIC_APP_URL` and deployment domain mapping are correct.

### 2. Deployment options

Suitable choices for this project include:

- Vercel for the Next.js frontend and server runtime.
- Railway, Render, or a managed PostgreSQL host for database deployment.
- Any secure environment with a managed PostgreSQL instance and environment variable management.

### 3. Operational documentation

Create clear documentation for:

- local setup
- environment variables
- Prisma migration workflow
- production build steps
- deployment checklist
- rollback or recovery steps

### 4. Portfolio handoff packaging

This project should be presented as a professional final-year portfolio application with:

- a clear problem statement
- a concise architecture explanation
- a feature summary
- security considerations
- validation evidence
- a short demo flow

## Recommended Next Steps

1. Decide on the target deployment platform.
2. Create a production-ready environment configuration.
3. Run a full production build using the release configuration.
4. Validate the database migration and seeded data flow.
5. Verify session and auth behavior in the deployed environment.
6. Produce a final project summary for GitHub and portfolio presentation.

## Risks and Considerations

- Production deployment must not reuse development secrets.
- Database migrations should be reviewed before running on production data.
- The Prisma audit issue should be resolved or explicitly documented before public deployment.
- Deployment environments should enforce HTTPS and secure cookies.

## Verification Instructions

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

Before deployment, also confirm:

```bash
npx prisma validate
npx prisma migrate deploy
```

## Outcome

This phase marks the transition from active development to deployment preparation and final portfolio handoff. The application is functionally complete and documentation-ready, with the remaining work focused on production deployment validation and secure release configuration.

## Phase 9.2 - Production Configuration

### Objective

Prepare the application configuration for a Vercel production deployment at
`https://budgetwise.quaye.tech` without changing the existing portfolio domain
or adding any committed secrets.

### Configuration Decisions

- Vercel will host the Next.js application.
- Supabase remains the production PostgreSQL provider for the `DATABASE_URL`.
- Production must set `NEXT_PUBLIC_APP_URL` to `https://budgetwise.quaye.tech`.
- `AUTH_SECRET` must be unique per environment and at least 32 characters.
- Session cookies remain `httpOnly`, `sameSite: "lax"`, path-scoped to `/`, and
  automatically marked `secure` when `NODE_ENV` is `production`.
- Session cookie values are signed with `AUTH_SECRET`; the database continues to
  store only a SHA-256 hash of the opaque session token.
- Runtime environment validation rejects non-HTTPS `NEXT_PUBLIC_APP_URL` values
  in production.

### Required Production Environment Variables

| Variable | Production value |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string, entered only in Vercel/Supabase dashboards |
| `AUTH_SECRET` | Strong generated secret, never committed |
| `NEXT_PUBLIC_APP_URL` | `https://budgetwise.quaye.tech` |

### Manual Deployment Notes

These values must be entered manually in the hosting dashboards during later
Phase 9 sub-phases. No Supabase project, Vercel project, dashboard secret, DNS
record, or payment setting was created or modified during Phase 9.2.

### Verification

Phase 9.2 validation should confirm:

```bash
npm run typecheck
npm run lint
```

Full build/test verification belongs to the later deployment-readiness and smoke
testing sub-phases unless a production configuration change requires it earlier.

## Phase 9.3 - Production Database Preparation

### Objective

Prepare BudgetWise for a managed Supabase PostgreSQL production database while
keeping all account, dashboard, credential, and billing actions manual.

### Database Provider

Supabase is the selected production PostgreSQL provider for this release. The
application continues to use Prisma with `DATABASE_URL`, and no alternative
database provider was introduced or evaluated in this phase.

### Prisma Readiness Review

The current Prisma schema is ready for a fresh production PostgreSQL database:

- The datasource uses `postgresql` and reads only from `DATABASE_URL`.
- The initial migration creates all required enums, tables, indexes, unique
  constraints, and foreign-key rules.
- User-owned records cascade on user deletion where appropriate.
- Category references on transactions and budgets use `RESTRICT`, protecting
  historical finance records from accidental category deletion.
- Sessions and password reset tokens are indexed by expiry for future cleanup
  operations.
- Money values are stored as integer cents, avoiding floating-point rounding
  issues in PostgreSQL.

### Required Manual Supabase Steps

Complete these in the Supabase dashboard during this phase or immediately before
Phase 9.4:

1. Create the BudgetWise Supabase project.
2. Choose the production region intentionally and record it in the project notes.
3. Copy the PostgreSQL connection string from Supabase.
4. Keep the connection string private; do not paste it into source code, chat,
   commits, screenshots, or documentation.
5. Confirm the connection string includes the correct database, user, password,
   host, port, and SSL mode required by Supabase.
6. Store the final `DATABASE_URL` only in the deployment environment that will
   run Prisma migrations and the Vercel production environment.

### Local Handoff Commands

These scripts were added to make database verification and deployment commands
explicit:

```bash
npm run db:validate
npm run db:migrate:deploy
```

`npm run db:validate` is safe to run without database credentials because it
validates the Prisma schema. `npm run db:migrate:deploy` requires the real
Supabase `DATABASE_URL` and belongs in Phase 9.4 after the production database
exists.

### Production Database Checklist

Before moving to Phase 9.4, confirm:

- A Supabase project exists for BudgetWise.
- The production `DATABASE_URL` has been copied privately from Supabase.
- The project is a fresh production database or has been backed up before
  migrations.
- The URL is available to the shell or deployment environment that will run
  `npm run db:migrate:deploy`.
- No production database credential has been committed to Git.

### Phase 9.3 Outcome

The repository is prepared for Supabase-backed production migration, but no live
database changes were executed because creating the Supabase project and handling
the production connection string require manual dashboard interaction.
