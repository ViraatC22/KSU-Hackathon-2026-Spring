import { z } from "zod";

const positiveMoney = z.coerce
  .number()
  .finite()
  .positive()
  .max(1_000_000, "Amount must not exceed K1,000,000");

export const loanApplicationSchema = z.object({
  amount: positiveMoney,
  purpose: z.string().trim().min(3).max(240),
  term: z.coerce.number().int().min(1).max(60),
});

export const chilimbaSchema = z.object({
  name: z.string().trim().min(3).max(120),
  contribution: positiveMoney,
  frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
  members: z.coerce.number().int().min(2).max(100),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2_000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4_000),
      })
    )
    .max(10)
    .default([]),
});

export const transactionQuerySchema = z.object({
  platform: z.enum(["MTN_MONEY", "AIRTEL_MONEY", "ZOONA"]).optional(),
  type: z
    .enum([
      "P2P_TRANSFER",
      "MERCHANT_PAYMENT",
      "BILL_PAYMENT",
      "AIRTIME_PURCHASE",
      "CASH_IN",
      "CASH_OUT",
      "SALARY",
    ])
    .optional(),
  status: z.enum(["MATCHED", "PENDING", "DISCREPANCY", "FLAGGED"]).optional(),
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export const creditQuerySchema = z.object({
  userId: z.coerce.number().int().min(0).max(499).optional(),
});

export function validationIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "request",
    message: issue.message,
  }));
}
