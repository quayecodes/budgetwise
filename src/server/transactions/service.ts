import { Prisma, TransactionType } from "@prisma/client";

import {
  createTransaction,
  deleteTransaction,
  findUserCategory,
  findUserTransaction,
  listCategories,
  listTransactions,
  updateTransaction,
} from "@/server/transactions/repository";
import {
  amountToCents,
  createTransactionSchema,
  transactionFilterSchema,
} from "@/server/transactions/validation";

export async function getTransactionWorkspace(
  userId: string,
  input: Record<string, string | undefined> = {},
) {
  const normalizedInput = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, value?.trim() || undefined]),
  );
  const parsedFilters = transactionFilterSchema.safeParse(normalizedInput);
  const endDate = parsedFilters.success && parsedFilters.data.to
    ? new Date(`${parsedFilters.data.to}T00:00:00.000Z`)
    : undefined;
  endDate?.setUTCDate(endDate.getUTCDate() + 1);
  const filters: Prisma.TransactionWhereInput = parsedFilters.success
    ? {
        ...(parsedFilters.data.type ? { type: parsedFilters.data.type as TransactionType } : {}),
        ...(parsedFilters.data.categoryId ? { categoryId: parsedFilters.data.categoryId } : {}),
        ...(parsedFilters.data.query
          ? {
              OR: [
                { description: { contains: parsedFilters.data.query, mode: "insensitive" } },
                { category: { name: { contains: parsedFilters.data.query, mode: "insensitive" } } },
              ],
            }
          : {}),
        ...(parsedFilters.data.from || parsedFilters.data.to
          ? {
              occurredAt: {
                ...(parsedFilters.data.from
                  ? { gte: new Date(`${parsedFilters.data.from}T00:00:00.000Z`) }
                  : {}),
                ...(parsedFilters.data.to
                  ? { lt: endDate }
                  : {}),
              },
            }
          : {}),
      }
    : {};

  const [categories, transactions] = await Promise.all([
    listCategories(userId),
    listTransactions(userId, filters),
  ]);

  return { categories, transactions };
}

export async function addTransaction(userId: string, input: Record<string, string>) {
  const parsed = createTransactionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the transaction details." };
  }

  const category = await findUserCategory(
    userId,
    parsed.data.categoryId,
    parsed.data.type as TransactionType,
  );

  if (!category) {
    return { error: "Choose a category that belongs to your account and matches the type." };
  }

  await createTransaction({
    userId,
    categoryId: parsed.data.categoryId,
    type: parsed.data.type as TransactionType,
    amountInCents: amountToCents(parsed.data.amount),
    description: parsed.data.description ?? "",
    occurredAt: new Date(`${parsed.data.occurredAt}T00:00:00.000Z`),
  });

  return { success: true };
}

export async function getTransactionForEdit(userId: string, transactionId: string) {
  return findUserTransaction(userId, transactionId);
}

export async function editTransaction(
  userId: string,
  transactionId: string,
  input: Record<string, string>,
) {
  const parsed = createTransactionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the transaction details." };
  }

  const category = await findUserCategory(
    userId,
    parsed.data.categoryId,
    parsed.data.type as TransactionType,
  );

  if (!category) {
    return { error: "Choose a category that belongs to your account and matches the type." };
  }

  const updated = await updateTransaction(userId, transactionId, {
    categoryId: parsed.data.categoryId,
    type: parsed.data.type as TransactionType,
    amountInCents: amountToCents(parsed.data.amount),
    description: parsed.data.description ?? "",
    occurredAt: new Date(`${parsed.data.occurredAt}T00:00:00.000Z`),
  });

  return updated.count === 1 ? { success: true } : { error: "Transaction not found." };
}

export async function removeTransaction(userId: string, transactionId: string) {
  const deleted = await deleteTransaction(userId, transactionId);
  return deleted.count === 1;
}