import { NextResponse } from "next/server";
import { DISTRICT_DATA } from "@/lib/utils/synthetic";

const DISTRICT_METRICS = DISTRICT_DATA.map((d) => {
  const mobilePenetration = 0.3 + Math.random() * 0.6;
  const agentDensity = Math.random() * 5;
  const txVolume = Math.random() * 800;
  const creditAccess = 0.1 + Math.random() * 0.6;
  const savingsParticipation = Math.random() * 0.4;
  const connectivity = 0.2 + Math.random() * 0.7;
  const inclusionScore = Math.round(
    mobilePenetration * 25 + agentDensity * 4 + (txVolume / 800) * 20 +
    creditAccess * 15 + savingsParticipation * 25 + connectivity * 10
  );

  return { ...d, mobilePenetration, agentDensity, txVolume, creditAccess, savingsParticipation, connectivity, inclusionScore };
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");

  if (district) {
    const found = DISTRICT_METRICS.find((d) => d.name.toLowerCase() === district.toLowerCase());
    return found ? NextResponse.json(found) : NextResponse.json({ error: "District not found" }, { status: 404 });
  }

  return NextResponse.json({
    districts: DISTRICT_METRICS,
    total: DISTRICT_METRICS.length,
    avgInclusion: Math.round(DISTRICT_METRICS.reduce((s, d) => s + d.inclusionScore, 0) / DISTRICT_METRICS.length),
    underserved: DISTRICT_METRICS.filter((d) => d.inclusionScore < 30).length,
  });
}
