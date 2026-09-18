"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/server/auth/session";
import { saveProfilePreferences } from "@/server/profile/service";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function updateProfilePreferencesAction(formData: FormData) {
  const user = await requireUser();
  const result = await saveProfilePreferences(user.id, {
    currency: readFormValue(formData, "currency"),
    timezone: readFormValue(formData, "timezone"),
  });

  if (result.error) {
    redirect(`/settings?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/settings?saved=1");
}