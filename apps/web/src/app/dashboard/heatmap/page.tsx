"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Map, TrendingUp, Users, Lightbulb, Smartphone, CreditCard,
  Wifi, PiggyBank, Building2, ArrowUpRight,
} from "lucide-react";
import { DISTRICT_DATA } from "@/lib/utils/synthetic";
import { type DataLayer } from "@/components/map/heatmap-map";
import dynamic from "next/dynamic";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const HeatmapMap = dynamic(() => import("@/components/map/heatmap-map"), { ssr: false });

// Stable seed-based random (no flickering on re-render)
function seededRand(seed: number, offset: number) {
  const x = Math.sin(seed + offset) * 10000;
  return x - Math.floor(x);
}

const DISTRICT_METRICS = DISTRICT_DATA.map((d, idx) => {
  const mobilePenetration = 0.28 + seededRand(idx, 1) * 0.62;
  const agentDensity = seededRand(idx, 2) * 5.2;
  const txVolume = seededRand(idx, 3) * 820;
  const creditAccess = 0.08 + seededRand(idx, 4) * 0.62;
  const savingsParticipation = seededRand(idx, 5) * 0.42;
  const connectivity = 0.18 + seededRand(idx, 6) * 0.72;

  const inclusionScore = Math.round(
    mobilePenetration * 25 +
    agentDensity * 4 +
    (txVolume / 820) * 20 +
    creditAccess * 15 +
    savingsParticipation * 25 +
    connectivity * 11
  );

  let recommendation = "";
  if (inclusionScore < 30)
    recommendation = `Deploy 5+ mobile agents in ${d.name} — 3,000 new users projected in 6 months`;
  else if (inclusionScore < 50)
    recommendation = `Launch savings circle awareness in ${d.name} — moderate mobile but low credit access`;
  else if (inclusionScore < 70)
    recommendation = `Expand lending in ${d.name} — high mobile adoption, credit products under-utilised`;
  else
    recommendation = `${d.name} is well-served. Optimise existing services and track churn`;

  return {
    ...d, mobilePenetration, agentDensity, txVolume,
    creditAccess, savingsParticipation, connectivity,
    inclusionScore, recommendation,
  };
});

const LAYERS: { key: DataLayer; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "inclusion", label: "Inclusion Score", icon: TrendingUp },
  { key: "mobile", label: "Mobile Money", icon: Smartphone },
  { key: "credit", label: "Credit Access", icon: CreditCard },
  { key: "agents", label: "Agent Density", icon: Building2 },
  { key: "savings", label: "Savings Groups", icon: PiggyBank },
  { key: "connectivity", label: "Connectivity", icon: Wifi },
];

function getLayerValueForDistrict(d: typeof DISTRICT_METRICS[0], layer: DataLayer): number {
  switch (layer) {
    case "inclusion": return d.inclusionScore;
    case "mobile": return Math.round(d.mobilePenetration * 100);
    case "credit": return Math.round(d.creditAccess * 100);
    case "agents": return Math.min(100, Math.round(d.agentDensity * 20));
    case "savings": return Math.min(100, Math.round(d.savingsParticipation * 250));
    case "connectivity": return Math.round(d.connectivity * 100);
  }
}

function scoreColor(score: number) {
  if (score >= 70) return "text-teal-400";
  if (score >= 50) return "text-copper";
  if (score >= 30) return "text-yellow-400";
  return "text-red-400";
}

function scoreBg(score: number) {
  if (score >= 70) return "var(--zambezi-400)";
  if (score >= 50) return "var(--copper-400)";
  if (score >= 30) return "#EAB308";
  return "#EF4444";
}

const CHART_STYLE = {
  background: "hsl(20 10% 12%)",
  border: "1px solid hsl(20 8% 22%)",
  borderRadius: "6px",
  fontSize: "11px",
};

export default function HeatmapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<DataLayer>("inclusion");
  const [sortBy, setSortBy] = useState("inclusion");

  const selected = DISTRICT_METRICS.find((d) => d.name === selectedDistrict);

  const avgInclusion = Math.round(DISTRICT_METRICS.reduce((s, d) => s + d.inclusionScore, 0) / DISTRICT_METRICS.length);
  const underserved = DISTRICT_METRICS.filter((d) => d.inclusionScore < 30).length;
  const wellServed = DISTRICT_METRICS.filter((d) => d.inclusionScore >= 70).length;

  const sorted = useMemo(() => [...DISTRICT_METRICS].sort((a, b) => {
    if (sortBy === "inclusion") return b.inclusionScore - a.inclusionScore;
    if (sortBy === "population") return b.population - a.population;
    if (sortBy === "layer") return getLayerValueForDistrict(b, activeLayer) - getLayerValueForDistrict(a, activeLayer);
    return a.name.localeCompare(b.name);
  }), [sortBy, activeLayer]);

  const provinceChart = useMemo(() => {
    const agg = DISTRICT_METRICS.reduce<Record<string, { sum: number; count: number }>>((acc, d) => {
      if (!acc[d.province]) acc[d.province] = { sum: 0, count: 0 };
      acc[d.province].sum += getLayerValueForDistrict(d, activeLayer);
      acc[d.province].count++;
      return acc;
    }, {});
    return Object.entries(agg)
      .map(([province, { sum, count }]) => ({ province: province.replace(" Province", ""), score: Math.round(sum / count) }))
      .sort((a, b) => b.score - a.score);
  }, [activeLayer]);

  // Top 3 priority districts (lowest inclusion score)
  const priorityDistricts = useMemo(
    () => [...DISTRICT_METRICS].sort((a, b) => a.inclusionScore - b.inclusionScore).slice(0, 4),
    []
  );

  const layerConfig = LAYERS.find((l) => l.key === activeLayer)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Financial Inclusion Heatmap</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Module 5: Geospatial intelligence · {DISTRICT_METRICS.length} districts · 10 provinces · AI expansion insights
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 text-teal-400 border-teal-800">
          <Map className="h-3 w-3" />
          Zambia · Live
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Districts Tracked" value={DISTRICT_METRICS.length} description="Across 10 provinces" icon={Map} accentColor="teal" />
        <StatCard title="Avg Inclusion Score" value={avgInclusion} description="Out of 100 composite" icon={TrendingUp} accentColor="copper" />
        <StatCard title="Underserved Areas" value={underserved} description="Score below 30 — critical" icon={Users} accentColor="red" />
        <StatCard title="Well-Served" value={wellServed} description="Score ≥ 70" icon={Lightbulb} accentColor="green" />
      </div>

      {/* Layer toggles */}
      <div className="flex flex-wrap gap-2">
        {LAYERS.map((layer) => {
          const LayerIcon = layer.icon;
          const active = activeLayer === layer.key;
          return (
            <Button
              key={layer.key}
              variant={active ? "default" : "outline"}
              size="sm"
              className="gap-1.5 h-8 text-xs"
              style={active ? {
                background: "linear-gradient(135deg, var(--copper-600), var(--copper-700))",
                borderColor: "transparent",
              } : {}}
              onClick={() => setActiveLayer(layer.key)}
            >
              <LayerIcon className="h-3.5 w-3.5" />
              {layer.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Map className="h-4 w-4" style={{ color: "var(--copper-400)" }} />
                  Interactive Heatmap — {layerConfig.label}
                </CardTitle>
                <CardDescription className="text-xs">Click any district marker for AI-powered insights</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="rounded-lg overflow-hidden border border-white/10" style={{ height: "420px" }}>
              <HeatmapMap
                districts={DISTRICT_METRICS}
                onSelect={setSelectedDistrict}
                selected={selectedDistrict}
                activeLayer={activeLayer}
              />
            </div>
            <div className="flex items-center gap-5 mt-3 text-[11px]">
              <span className="text-muted-foreground font-medium">{layerConfig.label}:</span>
              {[
                { bg: scoreBg(15), label: "Critical (<30)" },
                { bg: scoreBg(40), label: "Low (30–49)" },
                { bg: scoreBg(60), label: "Moderate (50–69)" },
                { bg: scoreBg(80), label: "Good (70+)" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.bg }} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar — District detail or province summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {selected ? selected.name : "Province Comparison"}
              </CardTitle>
              <CardDescription className="text-xs">
                {selected ? `${selected.province} Province` : `${layerConfig.label} by province`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selected ? (
                <div className="space-y-3">
                  <div className="text-center py-2">
                    <div className={`text-5xl font-bold font-mono ${scoreColor(selected.inclusionScore)}`}>
                      {selected.inclusionScore}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Inclusion Score · {selected.population.toLocaleString()} people</p>
                  </div>

                  <div className="space-y-2">
                    {([
                      { label: "Mobile Penetration", value: `${(selected.mobilePenetration * 100).toFixed(0)}%`, score: selected.mobilePenetration * 100 },
                      { label: "Credit Access", value: `${(selected.creditAccess * 100).toFixed(0)}%`, score: selected.creditAccess * 100 },
                      { label: "Agent Density", value: `${selected.agentDensity.toFixed(1)}/1k`, score: selected.agentDensity * 20 },
                      { label: "Savings Groups", value: `${(selected.savingsParticipation * 100).toFixed(0)}%`, score: selected.savingsParticipation * 250 },
                      { label: "Connectivity", value: `${(selected.connectivity * 100).toFixed(0)}%`, score: selected.connectivity * 100 },
                    ] as { label: string; value: string; score: number }[]).map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-28 shrink-0">{item.label}</span>
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, item.score)}%`, backgroundColor: scoreBg(item.score) }} />
                        </div>
                        <span className="text-xs font-mono w-10 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg border border-teal-900/50 bg-teal-950/15">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-3.5 w-3.5 text-teal-400 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-teal-300/90 leading-relaxed">{selected.recommendation}</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={() => setSelectedDistrict(null)}>
                    Back to Summary
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {provinceChart.map((p) => (
                    <div key={p.province} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20 shrink-0 truncate">{p.province}</span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, p.score)}%`, backgroundColor: scoreBg(p.score) }} />
                      </div>
                      <span className={`text-xs font-mono w-7 text-right ${scoreColor(p.score)}`}>{p.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Priority Insights */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-red-400" />
                Priority Interventions
              </CardTitle>
              <CardDescription className="text-xs">4 most underserved districts — AI recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityDistricts.map((d) => (
                <button
                  key={d.name}
                  className="w-full text-left p-2.5 rounded-lg border border-red-900/40 bg-red-950/15 hover:bg-red-950/25 transition-colors"
                  onClick={() => setSelectedDistrict(d.name)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{d.name}</span>
                    <span className="text-xs font-mono text-red-400">{d.inclusionScore}/100</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{d.recommendation}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Province chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">{layerConfig.label} by Province</CardTitle>
              <CardDescription className="text-xs">Average {layerConfig.label.toLowerCase()} across districts per province</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={provinceChart} margin={{ top: 4, right: 16, bottom: 4, left: -12 }}>
              <XAxis dataKey="province" tick={{ fontSize: 10, fill: "hsl(30 8% 55%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(30 8% 55%)" }} domain={[0, 100]} />
              <Tooltip contentStyle={CHART_STYLE} formatter={(v) => [`${v}`, layerConfig.label]} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} name={layerConfig.label}>
                {provinceChart.map((p, i) => (
                  <Cell key={i} fill={scoreBg(p.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* District table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm">All Districts</CardTitle>
            <CardDescription className="text-xs">{DISTRICT_METRICS.length} districts with inclusion metrics</CardDescription>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="inclusion">By Inclusion Score</SelectItem>
              <SelectItem value="layer">By Active Layer</SelectItem>
              <SelectItem value="population">By Population</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Inclusion</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Connectivity</TableHead>
                <TableHead>AI Insight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((d) => (
                <TableRow
                  key={d.name}
                  className={`cursor-pointer transition-colors hover:bg-secondary/50 ${selectedDistrict === d.name ? "bg-secondary" : ""}`}
                  onClick={() => setSelectedDistrict(d.name)}
                >
                  <TableCell className="font-medium text-sm">{d.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.province}</TableCell>
                  <TableCell className="text-xs font-mono">{d.population.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-10 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.inclusionScore}%`, backgroundColor: scoreBg(d.inclusionScore) }} />
                      </div>
                      <span className={`text-xs font-mono ${scoreColor(d.inclusionScore)}`}>{d.inclusionScore}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{(d.mobilePenetration * 100).toFixed(0)}%</TableCell>
                  <TableCell className="text-xs font-mono">{(d.creditAccess * 100).toFixed(0)}%</TableCell>
                  <TableCell className="text-xs font-mono">{(d.connectivity * 100).toFixed(0)}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">{d.recommendation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />
    </div>
  );
}
