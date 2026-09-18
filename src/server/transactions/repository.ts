import { Prisma, TransactionType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const defaultCategories = [
  { name: "Salary", type: TransactionType.INCOME, color: "#15803d" },
  { name: "Other income", type: TransactionType.INCOME, color: "#0f766e" },
  { name: "Food", type: TransactionType.EXPENSE, color: "#ea580c" },
  { name: "Transport", type: TransactionType.EXPENSE, color: "#2563eb" },
  { name: "Bills", type: TransactionType.EXPENSE, color: "#7c3aed" },
  { name: "Shopping", type: TransactionType.EXPENSE, color: "#db2777" },
];

export async function ensureDefaultCategories(userId: string) {
  await prisma.category.createMany({
    data: defaultCategories.map((category) => ({ ...category, userId })),
    skipDuplicates: true,
  });
}

export async function listCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

export async function listTransactions(
  userId: string,
  filters: Prisma.TransactionWhereInput = {},
) {
  return prisma.transaction.findMany({
    where: { userId, ...filters },
    include: { category: { select: { name: true, color: true } } },
    orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function findUserCategory(userId: string, categoryId: string, type: TransactionType) {
  return prisma.category.findFirst({
    where: { id: categoryId, userId, type },
    select: { id: true },
  });
}

export async function createTransaction(data: {
  userId: string;
  categoryId: string;
  type: TransactionType;
  amountInCents: number;
  description: string;
  occurredAt: Date;
}) {
  return prisma.transaction.create({ data });
}

export async function findUserTransaction(userId: string, transactionId: string) {
  return prisma.transaction.findFirst({
    where: { id: transactionId, userId },
    select: {
      id: true,
      type: true,
      amountInCents: true,
      categoryId: true,
      description: true,
      occurredAt: true,
    },
  });
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: {
    categoryId: string;
    type: TransactionType;
    amountInCents: number;
    description: string;
    occurredAt: Date;
  },
) {
  return prisma.transaction.updateMany({
    where: { id: transactionId, userId },
    data,
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  return prisma.transaction.deleteMany({
    where: { id: transactionId, userId },
  });
}