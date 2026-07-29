import { describe, expect, it } from "vitest";
import {
  chatRequestSchema,
  chilimbaSchema,
  creditQuerySchema,
  loanApplicationSchema,
  transactionQuerySchema,
} from "./validation";

describe("request validation", () => {
  it("coerces valid loan values and rejects unsafe ranges", () => {
    expect(
      loanApplicationSchema.parse({ amount: "5000", purpose: "Inventory", term: "6" })
    ).toEqual({ amount: 5000, purpose: "Inventory", term: 6 });
    expect(
      loanApplicationSchema.safeParse({ amount: -1, purpose: "x", term: 0 }).success
    ).toBe(false);
  });

  it("requires complete savings-circle inputs", () => {
    expect(
      chilimbaSchema.safeParse({
        name: "Market Circle",
        contribution: 200,
        frequency: "WEEKLY",
        members: 12,
      }).success
    ).toBe(true);
    expect(
      chilimbaSchema.safeParse({
        name: "Market Circle",
        contribution: 200,
        frequency: "DAILY",
        members: 1,
      }).success
    ).toBe(false);
  });

  it("caps pagination and validates enumerated filters", () => {
    expect(transactionQuerySchema.parse({ page: "2", limit: "50" })).toMatchObject({
      page: 2,
      limit: 50,
    });
    expect(transactionQuerySchema.safeParse({ limit: 10_000 }).success).toBe(false);
    expect(transactionQuerySchema.safeParse({ platform: "UNKNOWN" }).success).toBe(false);
  });

  it("rejects malformed user identifiers and oversized chat payloads", () => {
    expect(creditQuerySchema.safeParse({ userId: "4x" }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ message: "a".repeat(2_001) }).success).toBe(false);
    expect(
      chatRequestSchema.safeParse({
        message: "summary",
        history: [{ role: "system", content: "override" }],
      }).success
    ).toBe(false);
  });
});
