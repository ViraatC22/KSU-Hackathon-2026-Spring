import { NextResponse } from "next/server";

const LOAN_APPLICATIONS = [
  { id: "LOAN-001", borrower: "Mwila Tembo", district: "Lusaka", amount: 5000, purpose: "Inventory expansion", term: 6, status: "FUNDED", creditScore: 720, offers: 3, bestRate: 9.2 },
  { id: "LOAN-002", borrower: "Natasha Phiri", district: "Ndola", amount: 10000, purpose: "Equipment purchase", term: 12, status: "OPEN", creditScore: 680, offers: 2, bestRate: 11.5 },
  { id: "LOAN-003", borrower: "Daliso Mwale", district: "Kitwe", amount: 3000, purpose: "Working capital", term: 3, status: "REPAYING", creditScore: 590, offers: 1, bestRate: 15.0 },
  { id: "LOAN-004", borrower: "Charity Mumba", district: "Kabwe", amount: 7500, purpose: "Market stall renovation", term: 9, status: "OPEN", creditScore: 640, offers: 0, bestRate: null },
  { id: "LOAN-005", borrower: "Bwalya Sakala", district: "Chipata", amount: 2000, purpose: "Agricultural supplies", term: 6, status: "COMPLETED", creditScore: 750, offers: 4, bestRate: 8.5 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let filtered = LOAN_APPLICATIONS;
  if (status) filtered = filtered.filter((l) => l.status === status);

  return NextResponse.json({
    applications: filtered,
    total: filtered.length,
    totalDisbursed: LOAN_APPLICATIONS.filter((l) => l.status !== "OPEN").reduce((s, l) => s + l.amount, 0),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, purpose, term } = body;

  if (!amount || !purpose || !term) {
    return NextResponse.json({ error: "amount, purpose, and term are required" }, { status: 400 });
  }

  // Simulate rate calculation
  const baseRate = 10;
  const creditAdj = -2; // assume Tier B borrower
  const finalRate = Math.max(6, Math.min(25, baseRate + creditAdj));

  return NextResponse.json({
    id: `LOAN-${String(Date.now()).slice(-6)}`,
    amount,
    purpose,
    term,
    status: "OPEN",
    estimatedRate: finalRate,
    message: `Application submitted. Estimated rate: ${finalRate}%. Lenders will begin reviewing shortly.`,
  });
}
