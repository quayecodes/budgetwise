import { prisma } from "@/lib/prisma";

export async function updateUserProfile(
  userId: string,
  data: { currency: string; timezone: string },
) {
  return prisma.profile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}