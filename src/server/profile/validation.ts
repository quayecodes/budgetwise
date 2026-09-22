import { z } from "zod";

export const supportedCurrencies = ["USD", "EUR", "GBP", "CAD", "AUD", "GHS", "NGN"] as const;

export const profilePreferencesSchema = z.object({
  currency: z.enum(supportedCurrencies),
  timezone: z
    .string()
    .trim()
    .min(1, "Choose a timezone.")
    .refine((value) => {
      try {
        if (typeof Intl.supportedValuesOf === "function") {
          return Intl.supportedValuesOf("timeZone").includes(value);
        }

        Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }, "Choose a valid timezone."),
});