import { z } from "zod";

const amount = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount with up to two decimal places.")
  .refine((value) => Number(value) > 0, "Amount must be greater than zero.");

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount,
  categoryId: z.string().cuid(),
  description: z.string().trim().max(200).optional(),
  occurredAt: z.string().date(),
});

export const transactionFilterSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  categoryId: z.string().cuid().optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  query: z.string().trim().max(100).optional(),
});

export function amountToCents(value: string) {
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}