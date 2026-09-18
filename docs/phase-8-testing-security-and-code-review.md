# Phase 8 - Testing, Security and Code Review

## Objective

Establish automated coverage for high-risk business rules, verify the application build and static checks, and record security findings before deployment work begins.

## Completed Scope

### Automated unit tests

Added Vitest with a Node test environment and the project `@/*` path alias.

The first test suite covers:

- Integer-cent money conversion.
- Rejection of zero, negative, and over-precision transaction amounts.
- Transaction type and filter validation.
- UTC current-month boundary calculations.
- Positive monthly budget validation.
- Savings-goal names, target dates, and contribution amounts.
- Supported currencies, including Ghanaian cedi (`GHS`).
- IANA timezone validation.

Current result:

- 3 test files passed.
- 8 tests passed.

### Existing verification

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed with Webpack.

## Security Review

Existing protections reviewed during this phase include:

- Password hashing with bcrypt.
- HTTP-only, same-site session cookies.
- Hashed session tokens in the database.
- Server-side Zod validation before writes.
- User ID scoping on transaction, budget, savings-goal, and profile operations.
- Ownership checks before category, transaction, budget, and goal operations.
- Integer minor-unit storage for monetary values.

## Dependency Audit Finding

`npm audit --omit=dev` currently reports three high-severity transitive vulnerabilities through Prisma configuration tooling and `deepmerge-ts`.

The suggested automatic remediation uses `npm audit fix --force`, which would introduce a breaking Prisma version change. It was not applied automatically. This finding should be resolved deliberately by reviewing Prisma compatibility, upgrading to a compatible patched release, or isolating the affected development tooling before deployment.

## Test Commands

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

## Remaining Work

- Add repository and service integration tests against a disposable PostgreSQL database.
- Add authentication flow tests for registration, login, logout, session expiry, and protected routes.
- Add end-to-end tests for transaction, budget, savings-goal, and profile workflows.
- Add accessibility checks at mobile and desktop viewports.
- Resolve the dependency audit finding before production deployment.
- Review error logging and ensure sensitive values are never recorded.
