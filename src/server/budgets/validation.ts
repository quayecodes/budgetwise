import { z } from "zod";

const amount = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimal places.")
  .refine((value) => Number(value) > 0, "Budget must be greater than zero.");

export const createBudgetSchema = z.object({
  categoryId: z.string().cuid(),
  amount,
});

export function amountToCents(value: string) {
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}