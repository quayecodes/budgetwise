import {
  addContribution,
  createGoal,
  findUserGoal,
  listUserGoals,
} from "@/server/goals/repository";
import {
  amountToCents,
  contributionSchema,
  createGoalSchema,
} from "@/server/goals/validation";

export async function getGoals(userId: string) {
  return listUserGoals(userId);
}

export async function saveGoal(userId: string, input: Record<string, string>) {
  const parsed = createGoalSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the goal details." };
  }

  await createGoal({
    userId,
    name: parsed.data.name,
    targetAmountInCents: amountToCents(parsed.data.targetAmount),
    targetDate: parsed.data.targetDate
      ? new Date(`${parsed.data.targetDate}T00:00:00.000Z`)
      : null,
  });

  return { success: true };
}

export async function saveContribution(userId: string, input: Record<string, string>) {
  const parsed = contributionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the contribution details." };
  }

  const goal = await findUserGoal(userId, parsed.data.goalId);
  if (!goal) {
    return { error: "Choose an active goal that belongs to your account." };
  }

  const saved = await addContribution(
    userId,
    goal.id,
    amountToCents(parsed.data.amount),
    parsed.data.note ?? "",
  );

  return saved ? { success: true } : { error: "Goal not found." };
}