import { NextResponse } from "next/server";

const CIRCLES = [
  {
    id: "CHI-001", name: "Lusaka Market Women's Circle", members: 12, contribution: 200,
    frequency: "WEEKLY", totalRounds: 12, currentRound: 8, healthScore: 0.92, status: "ACTIVE",
    nextPayout: "Grace Banda", totalSaved: 19200,
  },
  {
    id: "CHI-002", name: "Copperbelt Miners' Savings", members: 8, contribution: 500,
    frequency: "MONTHLY", totalRounds: 8, currentRound: 3, healthScore: 0.85, status: "ACTIVE",
    nextPayout: "Joseph Mulenga", totalSaved: 12000,
  },
  {
    id: "CHI-003", name: "Chipata Farmers' Circle", members: 15, contribution: 100,
    frequency: "BIWEEKLY", totalRounds: 15, currentRound: 15, healthScore: 0.78, status: "COMPLETED",
    nextPayout: "-", totalSaved: 22500,
  },
  {
    id: "CHI-004", name: "Mongu Teachers' Fund", members: 10, contribution: 300,
    frequency: "MONTHLY", totalRounds: 10, currentRound: 1, healthScore: 1.0, status: "ACTIVE",
    nextPayout: "TBD", totalSaved: 3000,
  },
];

export async function GET() {
  return NextResponse.json({
    circles: CIRCLES,
    total: CIRCLES.length,
    activeCircles: CIRCLES.filter((c) => c.status === "ACTIVE").length,
    totalSaved: CIRCLES.reduce((s, c) => s + c.totalSaved, 0),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, contribution, frequency, members } = body;

  if (!name || !contribution || !frequency) {
    return NextResponse.json({ error: "name, contribution, and frequency are required" }, { status: 400 });
  }

  return NextResponse.json({
    id: `CHI-${String(Date.now()).slice(-6)}`,
    name,
    contribution,
    frequency,
    members: members || 0,
    totalRounds: members || 10,
    currentRound: 1,
    healthScore: 1.0,
    status: "ACTIVE",
    message: "Savings circle created successfully!",
  });
}
