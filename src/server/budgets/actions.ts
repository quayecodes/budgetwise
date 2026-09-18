"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/server/auth/session";
import { saveMonthlyBudget } from "@/server/budgets/service";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveMonthlyBudgetAction(formData: FormData) {
  const user = await requireUser();
  const result = await saveMonthlyBudget(user.id, {
    categoryId: readFormValue(formData, "categoryId"),
    amount: readFormValue(formData, "amount"),
  });

  if (result.error) {
    redirect(`/budgets?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/budgets");
}