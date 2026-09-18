"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/server/auth/session";
import { saveContribution, saveGoal } from "@/server/goals/service";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createGoalAction(formData: FormData) {
  const user = await requireUser();
  const result = await saveGoal(user.id, {
    name: readFormValue(formData, "name"),
    targetAmount: readFormValue(formData, "targetAmount"),
    targetDate: readFormValue(formData, "targetDate"),
  });

  if (result.error) {
    redirect(`/goals?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/goals");
}

export async function addContributionAction(formData: FormData) {
  const user = await requireUser();
  const result = await saveContribution(user.id, {
    goalId: readFormValue(formData, "goalId"),
    amount: readFormValue(formData, "amount"),
    note: readFormValue(formData, "note"),
  });

  if (result.error) {
    redirect(`/goals?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/goals");
}