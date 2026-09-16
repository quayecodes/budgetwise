# BudgetWise — Phase 1: Requirements and Project Planning

## 1. Project overview

BudgetWise is a personal finance and budgeting application for university students and early-career professionals. It gives users one place to record income and spending, organise transactions into categories, set spending limits and savings goals, and understand their financial habits through clear summaries.

The product is intended to support better day-to-day financial decisions, not to provide regulated financial advice or connect to banks in the initial release.

## 2. Problem statement

Students often manage a limited and irregular income while paying recurring living and education costs. Spreadsheets and banking apps can show individual transactions, but do not consistently help students plan a budget, notice overspending early, or build savings habits. BudgetWise addresses this by making personal finance tracking quick, understandable, and actionable.

## 3. Target users and personas

### Primary persona — Maya, the budget-conscious student

Maya is a 20-year-old undergraduate with part-time income and student support. She needs to see how much remains in each monthly spending category and wants reminders before she exceeds her limits. She primarily uses a phone.

### Secondary persona — Daniel, the early-career professional

Daniel is a 24-year-old graduate with a regular salary. He wants to categorise expenses, track recurring bills, and make steady progress toward an emergency-fund goal. He reviews summaries weekly on a laptop.

### Tertiary persona — Amina, the financial learner

Amina is beginning to manage money independently. She needs plain-language feedback, easy onboarding, and an uncluttered view of her spending before she is comfortable setting detailed budgets.

## 4. User roles

| Role | Description | Permissions |
| --- | --- | --- |
| Guest | Unauthenticated visitor | View public landing and authentication pages only. |
| User | Registered account holder | Manage only their own profile, transactions, categories, budgets, goals, and insights. |
| Administrator (future) | Platform operator | Support and moderation functions; excluded from the MVP unless operationally necessary. |

## 5. Functional requirements

### Account and access

1. Users can register with a name, email address, and password.
2. Users can sign in, sign out, and maintain a secure authenticated session.
3. Users can reset a forgotten password through a verified email flow.
4. Unauthenticated users cannot access personal finance data.

### Transactions

5. Users can create, view, edit, and delete income and expense transactions.
6. Each transaction records type, amount, date, category, optional note, and creation timestamp.
7. Users can create, rename, archive, and use personal categories; the system supplies sensible default categories.
8. Users can filter and search transactions by date range, type, and category.

### Budgets and goals

9. Users can set a monthly budget limit for an expense category.
10. Users can view actual spending, remaining amount, and percentage used for each active budget.
11. Users can create savings goals with a target amount and optional target date.
12. Users can record contributions toward goals and view progress.

### Dashboard and insights

13. The dashboard shows the current-month income, expenses, balance, budget progress, and active savings-goal progress.
14. Users can view spending by category and compare income with expenses over a selected period.
15. The application warns users when a budget is approaching or has exceeded its limit.

### Application quality

16. Forms display understandable validation and error messages.
17. The interface provides loading, empty, and failure states for data-driven views.
18. Users can update basic profile preferences, including currency and timezone.

## 6. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Security | Use authenticated, authorised access for every personal-data operation; hash passwords; validate and sanitise inputs; keep secrets in environment variables. |
| Privacy | Store only data needed for the product; clearly communicate data handling; never expose one user's data to another. |
| Performance | Typical dashboard and transaction-list interactions should feel responsive on standard mobile and broadband connections; paginate long transaction histories. |
| Accessibility | Meet WCAG 2.1 AA intent: keyboard navigation, visible focus, semantic controls, sufficient contrast, labels, and non-colour-only status indicators. |
| Reliability | Preserve submitted data atomically and return actionable errors; use database constraints for core data integrity. |
| Maintainability | Use TypeScript, modular layers, tests for critical logic, consistent linting/formatting, and documented setup. |
| Responsiveness | Support modern mobile, tablet, and desktop browsers, with mobile-first layouts. |
| Observability | Log server errors without recording passwords, session tokens, or sensitive financial notes. |

## 7. Scope and feature prioritisation

### MVP

- Authentication and protected personal workspace.
- Manual income and expense tracking with categories.
- Transaction history with filtering.
- Monthly category budgets and overspending indicators.
- Savings goals and manual contributions.
- Dashboard with current-month totals and category spending visualisation.
- Profile preferences for currency and timezone.
- Responsive, accessible UI and core validation/error states.

### Advanced / post-MVP

- Recurring transactions and recurring-bill forecasts.
- Custom reporting and CSV import/export.
- Financial habit streaks, tailored educational content, and smarter insights.
- Notifications by email or push.
- Shared/household budgets.
- Open-banking integrations (only after a separate security, privacy, and compliance assessment).
- Multi-currency conversion and offline-first synchronisation.
- Administrator support dashboard.

### Explicitly out of scope for the MVP

- Investment execution, lending, credit scoring, or financial advice.
- Live bank-account connections.
- Shared editing or social features.

## 8. Acceptance criteria for the MVP

1. A registered user can sign in and can access only their own data.
2. A user can add, edit, delete, and filter transactions, and dashboard totals update correctly.
3. A user can assign an expense to a category and set a monthly category budget.
4. The product accurately communicates budget progress and an exceeded budget.
5. A user can create a savings goal, add a contribution, and see correct progress.
6. Core views work at common mobile and desktop sizes and are keyboard usable.
7. Invalid or failed requests do not corrupt financial data and display a helpful message.

## 9. Technical challenges and early mitigations

| Challenge | Risk | Early mitigation |
| --- | --- | --- |
| Money precision | Floating-point arithmetic can produce incorrect totals. | Store money as integer minor units (for example, cents) and format only for display. |
| Data isolation | An insecure query could expose another user's finances. | Scope every data query by the authenticated user ID and enforce authorisation server-side. |
| Time and monthly boundaries | Timezones can put transactions in the wrong reporting month. | Store timestamps in UTC; use the user's saved timezone when calculating reporting periods. |
| Budget calculation | Edits, deletions, and category changes can make cached totals stale. | Derive totals from transactions initially; introduce carefully tested aggregation only when needed. |
| Student usability | Finance terminology or a dense dashboard may discourage adoption. | Use plain language, progressive onboarding, and test the core flow with student users. |
| Sensitive data | Financial notes and account data require care. | Minimise collection, encrypt traffic, protect sessions, and exclude sensitive fields from logs. |

## 10. Development roadmap

1. **Phase 1 — Requirements and planning:** confirm this document and MVP boundaries.
2. **Phase 2 — Architecture and design:** choose and justify the stack; define frontend, backend, data, security, and API design.
3. **Phase 3 — Database design:** model entities and relationships, constraints, indexes, schema, and seed strategy.
4. **Phase 4 — Project initialisation:** create the repository structure, TypeScript application, tooling, environment configuration, and database connection.
5. **Phase 5 — Authentication and authorisation:** build and test identity, sessions, protected routes, and validation.
6. **Phase 6 — Core features:** implement one approved feature at a time: transactions, categories, budgets, goals, then dashboard insights.
7. **Phase 7 — UI/UX refinement:** improve interaction design, accessibility, responsiveness, and all UI states.
8. **Phase 8 — Testing, security, and review:** deepen automated coverage and conduct security, performance, and quality review.
9. **Phase 9 — Deployment:** configure production hosting, database, environment variables, and deployment verification.
10. **Phase 10 — Documentation and GitHub presentation:** finalise README, screenshots, architecture, setup, testing, deployment, and portfolio presentation.

## 11. Phase 1 decisions requiring confirmation

- The MVP uses manual transaction entry only; bank integrations are deferred.
- Money is treated as a user-selected single currency per profile in the MVP; conversion is deferred.
- The MVP supports individual accounts, not shared budgets.
- Password reset is included as an account feature, subject to selecting an email provider during architecture.
