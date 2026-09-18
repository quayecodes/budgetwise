import { TransactionType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getMonthlyTransactionTotals(
  userId: string,
  startsAt: Date,
  endsAt: Date,
) {
  return prisma.transaction.groupBy({
    by: ["type"],
    where: { userId, occurredAt: { gte: startsAt, lt: endsAt } },
    _sum: { amountInCents: true },
  });
}

export async function getMonthlyBudgetSummary(userId: string, startsAt: Date, endsAt: Date) {
  const [budget, spent] = await Promise.all([
    prisma.budget.aggregate({
      where: { userId, period: "MONTHLY", startsAt, endsAt },
      _sum: { amountInCents: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        occurredAt: { gte: startsAt, lt: endsAt },
      },
      _sum: { amountInCents: true },
    }),
  ]);

  return {
    budgetInCents: budget._sum.amountInCents ?? 0,
    spentInCents: spent._sum.amountInCents ?? 0,
  };
}

export async function getActiveGoalSummary(userId: string) {
  return prisma.savingsGoal.aggregate({
    where: { userId, status: "ACTIVE" },
    _sum: { targetAmountInCents: true, currentAmountInCents: true },
    _count: { id: true },
  });
}