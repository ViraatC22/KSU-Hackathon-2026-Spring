import { NextResponse } from "next/server";
import { generateUsers, generateTransactions } from "@/lib/utils/synthetic";

const USERS = generateUsers(500);
const TRANSACTIONS = generateTransactions(500, 50000);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "0");
  const limit = parseInt(searchParams.get("limit") || "25");

  let filtered = TRANSACTIONS;

  if (platform) filtered = filtered.filter((t) => t.originalPlatform === platform);
  if (type) filtered = filtered.filter((t) => t.type === type);
  if (status) filtered = filtered.filter((t) => t.reconciliationStatus === status);

  const total = filtered.length;
  const paginated = filtered.slice(page * limit, (page + 1) * limit).map((tx) => ({
    ...tx,
    sender: USERS[tx.senderIndex]?.name || "Unknown",
    receiver: USERS[tx.receiverIndex]?.name || "Unknown",
  }));

  return NextResponse.json({
    transactions: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
