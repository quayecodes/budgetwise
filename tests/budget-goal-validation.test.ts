import { describe, expect, it } from "vitest";

import { getCurrentMonthBounds } from "@/server/budgets/service";
import { createBudgetSchema } from "@/server/budgets/validation";
import { contributionSchema, createGoalSchema } from "@/server/goals/validation";

describe("budget and goal validation", () => {
  it("calculates an inclusive UTC month range", () => {
    const { startsAt, endsAt } = getCurrentMonthBounds(new Date("2026-09-18T12:00:00.000Z"));

    expect(startsAt.toISOString()).toBe("2026-09-01T00:00:00.000Z");
    expect(endsAt.toISOString()).toBe("2026-10-01T00:00:00.000Z");
  });

  it("requires a positive budget amount and expense category id", () => {
    expect(createBudgetSchema.safeParse({ categoryId: "c123456789", amount: "250.00" }).success).toBe(true);
    expect(createBudgetSchema.safeParse({ categoryId: "c123456789", amount: "0" }).success).toBe(false);
  });

  it("validates goal names, target dates, and contributions", () => {
    expect(
      createGoalSchema.safeParse({ name: "Emergency fund", targetAmount: "1000", targetDate: "2026-12-31" }).success,
    ).toBe(true);
    expect(createGoalSchema.safeParse({ name: "x", targetAmount: "1000" }).success).toBe(false);
    expect(contributionSchema.safeParse({ goalId: "c123456789", amount: "50.25" }).success).toBe(true);
  });
});