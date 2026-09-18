import { z } from "zod";

export const supportedCurrencies = ["USD", "EUR", "GBP", "CAD", "AUD", "NGN"] as const;

export const profilePreferencesSchema = z.object({
  currency: z.enum(supportedCurrencies),
  timezone: z
    .string()
    .trim()
    .min(1, "Choose a timezone.")
    .refine((value) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }, "Choose a valid timezone."),
});