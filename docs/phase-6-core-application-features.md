# Phase 6 - Core Application Features

## Objective

Implement the essential MVP functionality for tracking personal finances, setting budgets, managing savings goals, and viewing financial summaries.

## Completed Scope

### Transaction tracking

- Added authenticated creation of income and expense transactions.
- Added transaction history with search, type, category, and date-range filters.
- Added transaction editing and deletion.
- Added server-side validation for amounts, dates, descriptions, transaction types, and categories.
- Stores monetary values as integer cents to avoid floating-point currency errors.
- Added default income and expense categories for new users.

### Monthly budgets

- Added current-month budgets for expense categories.
- Added budget creation and update behavior for each user and category.
- Added spending aggregation from expense transactions.
- Added remaining amount, percentage used, and overspending indicators.

### Savings goals

- Added savings goals with target amounts and optional target dates.
- Added contribution recording with optional notes.
- Updates contributions and goal balances atomically in a Prisma transaction.
- Added progress percentages and accessible progress bars.

### Dashboard summaries

- Added current-month income, expense, and balance summaries.
- Added combined budget progress and active savings-goal progress.
- Added links to transaction, budget, goal, and settings views.

### Profile preferences

- Added protected profile settings for currency and timezone.
- Added server-side validation for supported currencies and IANA timezones.
- Added Ghanaian cedi (`GHS`) support.
- Applied the saved currency when displaying financial amounts across the application.

## Architecture Decisions

- Server Actions handle form submissions and authentication checks.
- Services contain validation and business rules.
- Repositories contain Prisma data access.
- Every personal-data query is scoped by the authenticated user ID.
- Financial updates that must remain consistent, such as goal contributions and goal balances, use database transactions.
- URL query parameters are used for shareable transaction filters.

## Security and Data Integrity

- Unauthenticated users are redirected away from protected routes.
- Category ownership and transaction ownership are verified server-side.
- Budget and savings-goal operations are scoped to the current user.
- Monetary input is validated and converted to integer minor units before persistence.
- User input is validated with Zod before database writes.

## Verification Results

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed with Webpack.

## Manual Verification

After configuring a reachable PostgreSQL database in `.env.local`:

1. Register a user and sign in.
2. Create, edit, filter, and delete income and expense transactions.
3. Create a monthly budget and add expenses to verify progress and overspending states.
4. Create a savings goal and add contributions to verify atomic balance updates.
5. Change currency and timezone in `/settings` and verify the selected currency is displayed.
6. Open `/dashboard` and verify the current-month summaries match the underlying records.

## Deferred Scope

- User-created category management is not implemented yet.
- Budget deletion and historical budget views remain deferred.
- Savings-goal editing, archiving, and contribution history remain deferred.
- Dashboard spending-by-category visualisations and configurable reporting remain deferred.
- Automated unit and integration test suites remain part of Phase 8.
