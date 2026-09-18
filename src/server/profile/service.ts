import { updateUserProfile } from "@/server/profile/repository";
import { profilePreferencesSchema } from "@/server/profile/validation";

export async function saveProfilePreferences(
  userId: string,
  input: Record<string, string>,
) {
  const parsed = profilePreferencesSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your preferences." };
  }

  await updateUserProfile(userId, parsed.data);
  return { success: true };
}