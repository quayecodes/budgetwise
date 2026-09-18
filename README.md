# BudgetWise

> A personal finance management platform designed to help individuals track,
> manage, and understand their financial activities.

## Overview

BudgetWise is a full-stack web application designed to simplify personal
financial management through budgeting, expense tracking, and financial insights.

## Problem Statement

Many individuals struggle to maintain consistent records of their income,
expenses, and savings goals. BudgetWise aims to provide a centralized platform
for managing personal finances.

## Features

- Expense tracking
- Income management
- Budget planning
- Financial summaries
- Dashboard analytics
- Secure user authentication and authorization
- Savings goals and contributions
- Currency and timezone preferences

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL

## Project Roadmap

| Phase | Status |
|---|---|
| Phase 1: Requirements & Planning | Completed |
| Phase 2: System Architecture & Design | Completed |
| Phase 3: Database Design | Completed |
| Phase 4: Project Initialization | Completed |
| Phase 5: Authentication & Authorization | Completed |
| Phase 6: Core Feature Development | Completed |
| Phase 7: UI/UX Refinement | In progress |

## Project Structure

```text
budgetwise/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── server/
├── prisma/
├── docs/
├── package.json
└── README.md
```

## Local Development

1. Install dependencies:

	```bash
	npm install
	```

2. Copy `.env.example` to `.env.local` and set a reachable PostgreSQL `DATABASE_URL`.

3. Apply the Prisma schema:

	```bash
	npx prisma migrate dev
	```

4. Start the development server:

	```bash
	npm run dev
	```

5. Open [http://localhost:3000](http://localhost:3000).

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Documentation

- [Phase 1: Requirements and Planning](docs/phase-1-requirements-and-planning.md)
- [Phase 2: System Architecture and Design](docs/phase-2-system-architecture-and-design.md)
- [Phase 3: Database Design](docs/phase-3-database-design.md)
- [Phase 4: Project Initialization](docs/phase-4-project-initialization.md)
- [Phase 5: Authentication and Authorization](docs/phase-5-authentication-and-authorization.md)
- [Phase 6: Core Application Features](docs/phase-6-core-application-features.md)