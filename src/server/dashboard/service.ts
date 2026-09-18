import { TransactionType } from "@prisma/client";

import { getCurrentMonthBounds } from "@/server/budgets/service";
import {
  getActiveGoalSummary,
  getMonthlyBudgetSummary,
  getMonthlyTransactionTotals,
} from "@/server/dashboard/repository";

export async function getDashboardSummary(userId: string) {
  const { startsAt, endsAt } = getCurrentMonthBounds();
  const [transactionTotals, budget, goals] = await Promise.all([
    getMonthlyTransactionTotals(userId, startsAt, endsAt),
    getMonthlyBudgetSummary(userId, startsAt, endsAt),
    getActiveGoalSummary(userId),
  ]);

  const incomeInCents =
    transactionTotals.find((total) => total.type === TransactionType.INCOME)?._sum
      .amountInCents ?? 0;
  const expensesInCents =
    transactionTotals.find((total) => total.type === TransactionType.EXPENSE)?._sum
      .amountInCents ?? 0;

  return {
    startsAt,
    incomeInCents,
    expensesInCents,
    balanceInCents: incomeInCents - expensesInCents,
    budget,
    goals: {
      count: goals._count.id,
      targetInCents: goals._sum.targetAmountInCents ?? 0,
      currentInCents: goals._sum.currentAmountInCents ?? 0,
    },
  };
}