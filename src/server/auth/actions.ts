"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createUserSession, destroyCurrentSession } from "@/server/auth/session";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { loginSchema, registerSchema } from "@/server/auth/validation";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function authErrorUrl(path: "/login" | "/register", message: string) {
  const params = new URLSearchParams({ error: message });
  return `${path}?${params.toString()}`;
}

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: readFormValue(formData, "name"),
    email: readFormValue(formData, "email"),
    password: readFormValue(formData, "password"),
    confirmPassword: readFormValue(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    redirect(authErrorUrl("/register", parsed.error.issues[0]?.message ?? "Check your details."));
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
      },
    });

    await createUserSession(user.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      redirect(authErrorUrl("/register", "An account already exists for that email."));
    }

    throw error;
  }

  redirect("/dashboard");
}

export async function loginUser(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: readFormValue(formData, "email"),
    password: readFormValue(formData, "password"),
  });

  if (!parsed.success) {
    redirect(authErrorUrl("/login", "Enter a valid email and password."));
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    redirect(authErrorUrl("/login", "The email or password is incorrect."));
  }

  await createUserSession(user.id);
  redirect("/dashboard");
}

export async function logoutUser() {
  await destroyCurrentSession();
  redirect("/login");
}
