import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/server/auth/validation";

describe("auth validation", () => {
  it("accepts well-formed registration data and rejects mismatched passwords", () => {
    expect(
      registerSchema.safeParse({
        name: "  Ada  ",
        email: " ADA@EXAMPLE.COM ",
        password: "securepass123",
        confirmPassword: "securepass123",
      }).data,
    ).toMatchObject({
      name: "Ada",
      email: "ada@example.com",
      password: "securepass123",
      confirmPassword: "securepass123",
    });

    expect(
      registerSchema.safeParse({
        name: "Ada",
        email: "ada@example.com",
        password: "securepass123",
        confirmPassword: "differentpass123",
      }).success,
    ).toBe(false);
  });

  it("accepts valid login credentials and rejects malformed email/password input", () => {
    expect(
      loginSchema.safeParse({
        email: "user@example.com",
        password: "strongPassword123",
      }).success,
    ).toBe(true);

    expect(
      loginSchema.safeParse({
        email: "not-an-email",
        password: "short",
      }).success,
    ).toBe(false);
  });
});
