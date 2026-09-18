import { describe, expect, it } from "vitest";

import {
  amountToCents,
  createTransactionSchema,
  transactionFilterSchema,
} from "@/server/transactions/validation";

describe("transaction validation", () => {
  it("converts decimal amounts to integer cents", () => {
    expect(amountToCents("125.5")).toBe(12550);
    expect(amountToCents("9")).toBe(900);
  });

  it("rejects zero, negative, and more-than-two-decimal amounts", () => {
    for (const amount of ["0", "-1", "10.999"]) {
      expect(
        createTransactionSchema.safeParse({
          type: "EXPENSE",
          amount,
          categoryId: "c123456789",
          occurredAt: "2026-09-18",
        }).success,
      ).toBe(false);
    }
  });

  it("accepts valid filters and rejects unknown transaction types", () => {
    expect(
      transactionFilterSchema.safeParse({
        type: "EXPENSE",
        categoryId: "c123456789",
        from: "2026-09-01",
        to: "2026-09-30",
        query: "food",
      }).success,
    ).toBe(true);
    expect(transactionFilterSchema.safeParse({ type: "TRANSFER" }).success).toBe(false);
  });
});