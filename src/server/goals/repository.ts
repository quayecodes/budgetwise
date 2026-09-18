import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function listUserGoals(userId: string) {
  return prisma.savingsGoal.findMany({
    where: { userId, status: "ACTIVE" },
    include: { _count: { select: { contributions: true } } },
    orderBy: [{ targetDate: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGoal(data: Prisma.SavingsGoalUncheckedCreateInput) {
  return prisma.savingsGoal.create({ data });
}

export async function findUserGoal(userId: string, goalId: string) {
  return prisma.savingsGoal.findFirst({
    where: { id: goalId, userId, status: "ACTIVE" },
    select: { id: true },
  });
}

export async function addContribution(
  userId: string,
  goalId: string,
  amountInCents: number,
  note: string,
) {
  return prisma.$transaction(async (transaction) => {
    const goal = await transaction.savingsGoal.findFirst({
      where: { id: goalId, userId, status: "ACTIVE" },
      select: { id: true },
    });

    if (!goal) {
      return false;
    }

    await transaction.goalContribution.create({
      data: {
        userId,
        savingsGoalId: goalId,
        amountInCents,
        note: note || null,
        contributedAt: new Date(),
      },
    });
    await transaction.savingsGoal.update({
      where: { id: goalId },
      data: { currentAmountInCents: { increment: amountInCents } },
    });

    return true;
  });
}