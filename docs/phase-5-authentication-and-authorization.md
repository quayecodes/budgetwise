# Phase 5 - Authentication and Authorization

## Objective

Implement secure account access for BudgetWise before any personal finance data can be created or viewed.

## Completed Scope

- Added database-backed users, profiles, sessions, and password reset token models to the Prisma schema.
- Added the remaining Phase 3 finance models so future feature phases can reference a stable schema.
- Added bcrypt password hashing with a cost factor of 12.
- Added server-side registration, login, and logout actions.
- Added HTTP-only session cookies backed by hashed session tokens in the database.
- Added a protected dashboard route that redirects anonymous users to login.
- Added public login and registration pages with shared validation rules.

## Security Decisions

- Passwords are never stored directly; only bcrypt hashes are persisted.
- Session cookie values are random 256-bit tokens.
- Only SHA-256 hashes of session tokens are stored in the database.
- Cookies are HTTP-only, same-site lax, scoped to the full app path, and secure in production.
- Email addresses are normalized to lowercase before lookup or storage.
- Auth forms use server-side Zod validation.

## Deferred Scope

- Password reset email delivery is modeled in the database but not wired to an email provider yet.
- Role-based admin screens are not implemented because the MVP user surface is still student-first.
- Full dashboard finance data remains deferred to the transaction, budget, and goals phases.

## Verification Results

- `npx prisma format` passed.
- `npx prisma validate` passed.
- `npx prisma generate` passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed with Webpack.

## Local Database Step

Run this after setting a valid `DATABASE_URL` in `.env.local`:

```bash
npx prisma migrate dev --name initial-auth-and-finance-schema
```

Without a reachable PostgreSQL database, Prisma can validate the schema and generate the client, but the registration/login flow cannot be exercised end to end against a real database.
