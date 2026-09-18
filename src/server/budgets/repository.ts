import { BudgetPeriod, Prisma, TransactionType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function listMonthlyBudgets(userId: string, startsAt: Date, endsAt: Date) {
  return prisma.budget.findMany({
    where: { userId, period: BudgetPeriod.MONTHLY, startsAt, endsAt },
    include: { category: { select: { id: true, name: true, color: true } } },
    orderBy: { category: { name: "asc" } },
  });
}

export async function getMonthlyExpenseTotals(userId: string, startsAt: Date, endsAt: Date) {
  return prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      type: TransactionType.EXPENSE,
      occurredAt: { gte: startsAt, lt: endsAt },
    },
    _sum: { amountInCents: true },
  });
}

export async function findUserExpenseCategory(userId: string, categoryId: string) {
  return prisma.category.findFirst({
    where: { id: categoryId, userId, type: TransactionType.EXPENSE },
    select: { id: true },
  });
}

export async function findMonthlyBudget(
  userId: string,
  categoryId: string,
  startsAt: Date,
  endsAt: Date,
) {
  return prisma.budget.findFirst({
    where: { userId, categoryId, period: BudgetPeriod.MONTHLY, startsAt, endsAt },
    select: { id: true },
  });
}

export async function createBudget(data: Prisma.BudgetUncheckedCreateInput) {
  return prisma.budget.create({ data });
}

export async function updateBudget(userId: string, budgetId: string, amountInCents: number) {
  return prisma.budget.updateMany({
    where: { id: budgetId, userId },
    data: { amountInCents },
  });
}