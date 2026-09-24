import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { serverEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const sessionCookieName = "budgetwise_session";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 30;

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function signSessionToken(token: string) {
  return createHmac("sha256", serverEnv().AUTH_SECRET).update(token).digest("hex");
}

function createSessionCookieValue(token: string) {
  return `${token}.${signSessionToken(token)}`;
}

function readSessionCookieValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const cookieParts = value.split(".");

  if (cookieParts.length !== 2) {
    return null;
  }

  const [token, signature] = cookieParts;

  if (!token || !signature) {
    return null;
  }

  const expectedSignature = signSessionToken(token);
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  return token;
}

export async function createUserSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionDurationMs);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, createSessionCookieValue(token), {
    expires: expiresAt,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = readSessionCookieValue(cookieStore.get(sessionCookieName)?.value);

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      tokenHash: hashSessionToken(token),
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session.deleteMany({
      where: {
        id: session.id,
      },
    });

    return null;
  }

  return session.user;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = readSessionCookieValue(cookieStore.get(sessionCookieName)?.value);

  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashSessionToken(token),
      },
    });
  }

  cookieStore.delete(sessionCookieName);
}
