import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const serverEnv = () =>
  serverEnvSchema
    .refine(
      (env) => env.NODE_ENV !== "production" || env.NEXT_PUBLIC_APP_URL.startsWith("https://"),
      {
        message: "NEXT_PUBLIC_APP_URL must use HTTPS in production.",
        path: ["NEXT_PUBLIC_APP_URL"],
      },
    )
    .parse(process.env);
