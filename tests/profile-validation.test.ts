import { describe, expect, it } from "vitest";

import { profilePreferencesSchema, supportedCurrencies } from "@/server/profile/validation";

describe("profile preferences", () => {
  it("supports Ghanaian cedi", () => {
    expect(supportedCurrencies).toContain("GHS");
    expect(profilePreferencesSchema.safeParse({ currency: "GHS", timezone: "Africa/Accra" }).success).toBe(true);
  });

  it("rejects unsupported currencies and invalid timezones", () => {
    expect(profilePreferencesSchema.safeParse({ currency: "XYZ", timezone: "UTC" }).success).toBe(false);
    expect(profilePreferencesSchema.safeParse({ currency: "USD", timezone: "Not/AZone" }).success).toBe(false);
  });
});