export const CREDIT_TIERS = {
  A: { min: 800, max: 1000, label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-100" },
  B: { min: 650, max: 799, label: "Good", color: "text-blue-600", bg: "bg-blue-100" },
  C: { min: 500, max: 649, label: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" },
  D: { min: 350, max: 499, label: "Below Average", color: "text-orange-600", bg: "bg-orange-100" },
  E: { min: 0, max: 349, label: "Limited History", color: "text-red-600", bg: "bg-red-100" },
} as const;

export const MOBILE_PLATFORMS = {
  MTN_MONEY: { label: "MTN Money", color: "bg-yellow-500", prefix: "097" },
  AIRTEL_MONEY: { label: "Airtel Money", color: "bg-red-500", prefix: "096" },
  ZOONA: { label: "Zoona", color: "bg-green-500", prefix: "095" },
} as const;

export const TX_TYPES = {
  P2P_TRANSFER: "P2P Transfer",
  MERCHANT_PAYMENT: "Merchant Payment",
  BILL_PAYMENT: "Bill Payment",
  AIRTIME_PURCHASE: "Airtime Purchase",
  CASH_IN: "Cash In",
  CASH_OUT: "Cash Out",
  SALARY: "Salary",
  LOAN_DISBURSEMENT: "Loan Disbursement",
  LOAN_REPAYMENT: "Loan Repayment",
  SAVINGS_CONTRIBUTION: "Savings Contribution",
  SAVINGS_PAYOUT: "Savings Payout",
} as const;

export const RECONCILIATION_STATUSES = {
  PENDING: { label: "Pending", color: "text-yellow-600" },
  MATCHED: { label: "Matched", color: "text-emerald-600" },
  DISCREPANCY: { label: "Discrepancy", color: "text-orange-600" },
  FLAGGED: { label: "Flagged", color: "text-red-600" },
} as const;

export const LOAN_STATUSES = {
  OPEN: { label: "Open", color: "text-blue-600" },
  FUNDED: { label: "Funded", color: "text-emerald-600" },
  REPAYING: { label: "Repaying", color: "text-yellow-600" },
  COMPLETED: { label: "Completed", color: "text-gray-600" },
  DEFAULTED: { label: "Defaulted", color: "text-red-600" },
} as const;
