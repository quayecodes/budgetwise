"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/server/auth/session";
import { addTransaction, editTransaction, removeTransaction } from "@/server/transactions/service";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createTransactionAction(formData: FormData) {
  const user = await requireUser();
  const result = await addTransaction(user.id, {
    type: readFormValue(formData, "type"),
    amount: readFormValue(formData, "amount"),
    categoryId: readFormValue(formData, "categoryId"),
    description: readFormValue(formData, "description"),
    occurredAt: readFormValue(formData, "occurredAt"),
  });

  if (result.error) {
    redirect(`/transactions?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/transactions");
}

export async function updateTransactionAction(formData: FormData) {
  const user = await requireUser();
  const transactionId = readFormValue(formData, "transactionId");
  const result = await editTransaction(user.id, transactionId, {
    type: readFormValue(formData, "type"),
    amount: readFormValue(formData, "amount"),
    categoryId: readFormValue(formData, "categoryId"),
    description: readFormValue(formData, "description"),
    occurredAt: readFormValue(formData, "occurredAt"),
  });

  if (result.error) {
    redirect(`/transactions/${transactionId}/edit?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/transactions");
}

export async function deleteTransactionAction(formData: FormData) {
  const user = await requireUser();
  const transactionId = readFormValue(formData, "transactionId");
  await removeTransaction(user.id, transactionId);
  redirect("/transactions");
}