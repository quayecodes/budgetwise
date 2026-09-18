import { BudgetPeriod } from "@prisma/client";

import {
  createBudget,
  findMonthlyBudget,
  findUserExpenseCategory,
  getMonthlyExpenseTotals,
  listMonthlyBudgets,
  updateBudget,
} from "@/server/budgets/repository";
import { amountToCents, createBudgetSchema } from "@/server/budgets/validation";

export function getCurrentMonthBounds(now = new Date()) {
  const startsAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const endsAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { startsAt, endsAt };
}

export async function getBudgetWorkspace(userId: string) {
  const { startsAt, endsAt } = getCurrentMonthBounds();
  const [budgets, totals] = await Promise.all([
    listMonthlyBudgets(userId, startsAt, endsAt),
    getMonthlyExpenseTotals(userId, startsAt, endsAt),
  ]);
  const spendingByCategory = new Map(
    totals.map((total) => [total.categoryId, total._sum.amountInCents ?? 0]),
  );

  return {
    startsAt,
    budgets: budgets.map((budget) => ({
      ...budget,
      spentInCents: spendingByCategory.get(budget.categoryId) ?? 0,
    })),
  };
}

export async function saveMonthlyBudget(userId: string, input: Record<string, string>) {
  const parsed = createBudgetSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the budget details." };
  }

  const category = await findUserExpenseCategory(userId, parsed.data.categoryId);
  if (!category) {
    return { error: "Choose an expense category that belongs to your account." };
  }

  const { startsAt, endsAt } = getCurrentMonthBounds();
  const amountInCents = amountToCents(parsed.data.amount);
  const existing = await findMonthlyBudget(userId, category.id, startsAt, endsAt);

  if (existing) {
    await updateBudget(userId, existing.id, amountInCents);
  } else {
    await createBudget({
      userId,
      categoryId: category.id,
      period: BudgetPeriod.MONTHLY,
      amountInCents,
      startsAt,
      endsAt,
    });
  }

  return { success: true };
}