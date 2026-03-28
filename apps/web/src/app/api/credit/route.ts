import { NextResponse } from "next/server";
import { generateUsers, generateTransactions, computeCreditScore } from "@/lib/utils/synthetic";

const USERS = generateUsers(500);
const TRANSACTIONS = generateTransactions(500, 50000);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const scores = USERS.map((user, idx) => {
    const userTxns = TRANSACTIONS.filter((t) => t.senderIndex === idx || t.receiverIndex === idx);
    const uniqueCounterparties = new Set(
      userTxns.map((t) => (t.senderIndex === idx ? t.receiverIndex : t.senderIndex))
    ).size;
    const avgAmount = userTxns.length > 0 ? userTxns.reduce((s, t) => s + t.amount, 0) / userTxns.length : 0;
    const circleReliability = Math.random() * 0.8 + 0.2;

    const score = computeCreditScore(
      userTxns.length, avgAmount, uniqueCounterparties,
      user.platforms.length, user.kycStatus === "VERIFIED", circleReliability
    );

    return { userId: idx, name: user.name, district: user.district, ...score };
  });

  if (userId) {
    const idx = parseInt(userId);
    const found = scores[idx];
    return found ? NextResponse.json(found) : NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    scores: scores.slice(0, 50),
    total: scores.length,
    avgScore: Math.round(scores.reduce((s, u) => s + u.score, 0) / scores.length),
  });
}
