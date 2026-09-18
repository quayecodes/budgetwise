import { z } from "zod";

const amount = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimal places.")
  .refine((value) => Number(value) > 0, "Amount must be greater than zero.");

export const createGoalSchema = z.object({
  name: z.string().trim().min(2, "Enter a goal name.").max(100),
  targetAmount: amount,
  targetDate: z.string().date().optional(),
});

export const contributionSchema = z.object({
  goalId: z.string().cuid(),
  amount,
  note: z.string().trim().max(200).optional(),
});

export function amountToCents(value: string) {
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}