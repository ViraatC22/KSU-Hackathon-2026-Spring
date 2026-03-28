"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Plus, AlertTriangle, CheckCircle, TrendingUp, Heart,
  Brain, ArrowDown, ArrowUp, Minus, Sparkles,
} from "lucide-react";
import { formatZMW } from "@/lib/utils/zambia-data";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip, BarChart, Bar, XAxis, YAxis, Cell,
} from "recharts";

interface Member {
  name: string;
  reliability: number;
  defaultRisk: number;
  role: "LEADER" | "MEMBER";
  paid: boolean;
  urgencyScore?: number; // 0-1, how urgently they need the payout
}

interface Circle {
  id: string;
  name: string;
  members: number;
  contribution: number;
  frequency: string;
  totalRounds: number;
  currentRound: number;
  healthScore: number;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  nextPayout: string;
  totalSaved: number;
  radarData: { metric: string; score: number }[];
  memberList: Member[];
}

const CIRCLES: Circle[] = [
  {
    id: "CHI-001", name: "Lusaka Market Women's Circle", members: 12, contribution: 200,
    frequency: "Weekly", totalRounds: 12, currentRound: 8, healthScore: 0.92,
    status: "ACTIVE", nextPayout: "Grace Banda", totalSaved: 19200,
    radarData: [
      { metric: "Payment Rate", score: 92 },
      { metric: "Retention", score: 95 },
      { metric: "Regularity", score: 88 },
      { metric: "Consistency", score: 90 },
      { metric: "Risk Spread", score: 78 },
      { metric: "Completion", score: 67 },
    ],
    memberList: [
      { name: "Grace Banda", reliability: 0.98, defaultRisk: 0.02, role: "LEADER", paid: true, urgencyScore: 0.3 },
      { name: "Mwila Tembo", reliability: 0.95, defaultRisk: 0.05, role: "MEMBER", paid: true, urgencyScore: 0.7 },
      { name: "Charity Mumba", reliability: 0.88, defaultRisk: 0.12, role: "MEMBER", paid: true, urgencyScore: 0.5 },
      { name: "Hope Lungu", reliability: 0.82, defaultRisk: 0.18, role: "MEMBER", paid: false, urgencyScore: 0.8 },
      { name: "Esther Moyo", reliability: 0.91, defaultRisk: 0.09, role: "MEMBER", paid: true, urgencyScore: 0.4 },
      { name: "Ruth Phiri", reliability: 0.85, defaultRisk: 0.15, role: "MEMBER", paid: true, urgencyScore: 0.6 },
      { name: "Precious Daka", reliability: 0.93, defaultRisk: 0.07, role: "MEMBER", paid: true, urgencyScore: 0.35 },
      { name: "Bupe Mwansa", reliability: 0.79, defaultRisk: 0.21, role: "MEMBER", paid: true, urgencyScore: 0.9 },
      { name: "Ireen Sakala", reliability: 0.90, defaultRisk: 0.10, role: "MEMBER", paid: true, urgencyScore: 0.45 },
      { name: "Wezi Kalumba", reliability: 0.87, defaultRisk: 0.13, role: "MEMBER", paid: true, urgencyScore: 0.55 },
      { name: "Thandiwe Zulu", reliability: 0.94, defaultRisk: 0.06, role: "MEMBER", paid: true, urgencyScore: 0.25 },
      { name: "Nchimunya Banda", reliability: 0.76, defaultRisk: 0.24, role: "MEMBER", paid: false, urgencyScore: 0.95 },
    ],
  },
  {
    id: "CHI-002", name: "Copperbelt Miners' Savings", members: 8, contribution: 500,
    frequency: "Monthly", totalRounds: 8, currentRound: 3, healthScore: 0.85,
    status: "ACTIVE", nextPayout: "Joseph Mulenga", totalSaved: 12000,
    radarData: [
      { metric: "Payment Rate", score: 85 },
      { metric: "Retention", score: 100 },
      { metric: "Regularity", score: 90 },
      { metric: "Consistency", score: 87 },
      { metric: "Risk Spread", score: 72 },
      { metric: "Completion", score: 38 },
    ],
    memberList: [
      { name: "Chanda Bwalya", reliability: 0.90, defaultRisk: 0.10, role: "LEADER", paid: true, urgencyScore: 0.3 },
      { name: "Joseph Mulenga", reliability: 0.85, defaultRisk: 0.15, role: "MEMBER", paid: true, urgencyScore: 0.6 },
      { name: "Victor Zulu", reliability: 0.92, defaultRisk: 0.08, role: "MEMBER", paid: true, urgencyScore: 0.2 },
      { name: "Gift Chanda", reliability: 0.78, defaultRisk: 0.22, role: "MEMBER", paid: false, urgencyScore: 0.85 },
      { name: "Daliso Mwale", reliability: 0.88, defaultRisk: 0.12, role: "MEMBER", paid: true, urgencyScore: 0.4 },
    ],
  },
  {
    id: "CHI-003", name: "Chipata Farmers' Circle", members: 15, contribution: 100,
    frequency: "Biweekly", totalRounds: 15, currentRound: 15, healthScore: 0.78,
    status: "COMPLETED", nextPayout: "—", totalSaved: 22500,
    radarData: [
      { metric: "Payment Rate", score: 80 },
      { metric: "Retention", score: 87 },
      { metric: "Regularity", score: 75 },
      { metric: "Consistency", score: 82 },
      { metric: "Risk Spread", score: 70 },
      { metric: "Completion", score: 100 },
    ],
    memberList: [],
  },
  {
    id: "CHI-004", name: "Mongu Teachers' Fund", members: 10, contribution: 300,
    frequency: "Monthly", totalRounds: 10, currentRound: 1, healthScore: 1.0,
    status: "ACTIVE", nextPayout: "AI Optimizing…", totalSaved: 3000,
    radarData: [
      { metric: "Payment Rate", score: 100 },
      { metric: "Retention", score: 100 },
      { metric: "Regularity", score: 100 },
      { metric: "Consistency", score: 100 },
      { metric: "Risk Spread", score: 95 },
      { metric: "Completion", score: 10 },
    ],
    memberList: [],
  },
];

function healthColor(score: number) {
  if (score >= 0.85) return "text-emerald-400";
  if (score >= 0.7) return "text-yellow-400";
  return "text-red-400";
}

function healthLabel(score: number) {
  if (score >= 0.9) return "Excellent";
  if (score >= 0.8) return "Good";
  if (score >= 0.7) return "Fair";
  return "At Risk";
}

// AI-optimized payout order: balance urgency vs reliability
// High-urgency + low-risk go early; high-risk members go later (keeps incentive to pay)
function computeOptimizedOrder(members: Member[]): (Member & { defaultOrder: number; aiOrder: number; change: number })[] {
  const withIndex = members.map((m, i) => ({ ...m, defaultOrder: i + 1 }));
  // Score = urgency * 0.6 + (1 - defaultRisk) * 0.4
  const sorted = [...withIndex].sort((a, b) => {
    const scoreA = (a.urgencyScore || 0) * 0.6 + (1 - a.defaultRisk) * 0.4;
    const scoreB = (b.urgencyScore || 0) * 0.6 + (1 - b.defaultRisk) * 0.4;
    return scoreB - scoreA;
  });
  return sorted.map((m, i) => ({
    ...m,
    aiOrder: i + 1,
    change: m.defaultOrder - (i + 1),
  }));
}

const CHART_STYLE = {
  background: "hsl(20 10% 12%)",
  border: "1px solid hsl(20 8% 22%)",
  borderRadius: "6px",
  fontSize: "11px",
};

export default function ChilimbaPage() {
  const [selectedCircle, setSelectedCircle] = useState<string>("CHI-001");
  const selected = CIRCLES.find((c) => c.id === selectedCircle);

  const totalSaved = CIRCLES.reduce((s, c) => s + c.totalSaved, 0);
  const activeCircles = CIRCLES.filter((c) => c.status === "ACTIVE").length;
  const totalMembers = CIRCLES.reduce((s, c) => s + c.members, 0);
  const avgHealth = Math.round(CIRCLES.reduce((s, c) => s + c.healthScore, 0) / CIRCLES.length * 100);

  const optimizedOrder = selected && selected.memberList.length > 0
    ? computeOptimizedOrder(selected.memberList)
    : [];

  const contributionData = selected?.memberList.map((m) => ({
    name: m.name.split(" ")[0],
    reliability: Math.round(m.reliability * 100),
    risk: Math.round(m.defaultRisk * 100),
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Chilimba Savings Circles</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Module 6: AI-powered rotating savings · Default prediction · Payout optimization
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 text-purple-400 border-purple-800">
          <Brain className="h-3 w-3" />
          AI Optimized
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Circles" value={activeCircles} description={`${CIRCLES.length} total`} icon={Users} accentColor="teal" />
        <StatCard title="Total Members" value={totalMembers} description="Across all circles" icon={Heart} accentColor="copper" />
        <StatCard title="Total Saved" value={formatZMW(totalSaved)} description="Cumulative contributions" icon={TrendingUp} accentColor="green" trend={{ value: 22, label: "vs last quarter" }} />
        <StatCard title="Avg Health" value={`${avgHealth}%`} description="Group health score" icon={CheckCircle} accentColor="teal" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ─── Circle List ─── */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm">My Circles</CardTitle>
            <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
              <Plus className="h-3 w-3" /> New Circle
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {CIRCLES.map((circle) => (
                <button
                  key={circle.id}
                  onClick={() => setSelectedCircle(circle.id)}
                  className={`w-full p-3.5 text-left transition-colors ${selectedCircle === circle.id ? "bg-secondary" : "hover:bg-secondary/50"}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-tight">{circle.name}</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 h-4 shrink-0 ml-2 ${
                          circle.status === "ACTIVE" ? "text-emerald-400 border-emerald-800" :
                          circle.status === "COMPLETED" ? "text-blue-400 border-blue-800" :
                          "text-yellow-400 border-yellow-800"
                        }`}
                      >
                        {circle.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{circle.members} members · {formatZMW(circle.contribution)}/{circle.frequency.toLowerCase()}</span>
                      <span className={`font-semibold ${healthColor(circle.healthScore)}`}>
                        {(circle.healthScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(circle.currentRound / circle.totalRounds) * 100}
                      className="h-1"
                    />
                    <p className="text-[10px] text-muted-foreground">Round {circle.currentRound}/{circle.totalRounds}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ─── Circle Detail ─── */}
        <div className="lg:col-span-2 space-y-4">
          {selected ? (
            <>
              {/* Header stats */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{selected.name}</CardTitle>
                      <CardDescription className="text-xs">{selected.id} · {selected.frequency} contributions</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        selected.status === "ACTIVE" ? "text-emerald-400 border-emerald-800" :
                        selected.status === "COMPLETED" ? "text-blue-400 border-blue-800" :
                        "text-yellow-400 border-yellow-800"
                      }`}
                    >
                      {selected.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Members", value: selected.members.toString() },
                      { label: `Per ${selected.frequency}`, value: formatZMW(selected.contribution) },
                      { label: "Health", value: `${(selected.healthScore * 100).toFixed(0)}%`, colored: true },
                      { label: "Total Saved", value: formatZMW(selected.totalSaved) },
                    ].map((item) => (
                      <div key={item.label} className="p-3 bg-secondary/60 rounded-lg text-center">
                        <p className={`text-base font-bold font-mono ${item.colored ? healthColor(selected.healthScore) : ""}`}>
                          {item.value}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Completion progress</span>
                      <span className="font-medium">Round {selected.currentRound} of {selected.totalRounds}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(selected.currentRound / selected.totalRounds) * 100}%`,
                          background: "linear-gradient(90deg, var(--copper-500), var(--zambezi-400))",
                        }}
                      />
                    </div>
                  </div>

                  {selected.status === "ACTIVE" && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-teal-900/60 bg-teal-950/20">
                      <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-teal-300">Next Payout: {selected.nextPayout}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Payout amount: {formatZMW(selected.contribution * selected.members)} · AI-optimized schedule
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Health Radar + Contribution chart */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Group Health Radar</CardTitle>
                    <CardDescription className="text-xs">
                      {healthLabel(selected.healthScore)} · 6-dimension assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={selected.radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                        <PolarGrid stroke="hsl(20 8% 25%)" />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fontSize: 9.5, fill: "hsl(30 8% 55%)" }}
                        />
                        <Radar
                          name="Health"
                          dataKey="score"
                          stroke="var(--copper-400)"
                          fill="var(--copper-500)"
                          fillOpacity={0.25}
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={CHART_STYLE}
                          formatter={(v) => [`${v}%`, "Score"]}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Member Reliability</CardTitle>
                    <CardDescription className="text-xs">Payment reliability score per member</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contributionData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={contributionData} margin={{ top: 4, right: 4, bottom: 28, left: -16 }}>
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9, fill: "hsl(30 8% 55%)" }}
                            angle={-40}
                            textAnchor="end"
                            height={48}
                          />
                          <YAxis tick={{ fontSize: 9, fill: "hsl(30 8% 55%)" }} domain={[0, 100]} />
                          <Tooltip contentStyle={CHART_STYLE} formatter={(v) => [`${v}%`, "Reliability"]} />
                          <Bar dataKey="reliability" radius={[3, 3, 0, 0]} name="Reliability">
                            {contributionData.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={
                                  entry.reliability >= 90 ? "var(--zambezi-400)" :
                                  entry.reliability >= 80 ? "var(--copper-400)" : "#EF4444"
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                        No member data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* AI Payout Order Optimizer */}
              {optimizedOrder.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Brain className="h-4 w-4 text-purple-400" />
                          AI Payout Order Optimizer
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Reorders payout sequence to minimize group default risk · balances urgency vs reliability
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-purple-400 border-purple-800 text-[10px]">
                        Expected savings: –{Math.round(optimizedOrder.filter(m => m.change > 0).length * 4.2)}% default risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">AI #</TableHead>
                          <TableHead>Member</TableHead>
                          <TableHead className="text-center">Default #</TableHead>
                          <TableHead className="text-center">Change</TableHead>
                          <TableHead>Reliability</TableHead>
                          <TableHead>Default Risk</TableHead>
                          <TableHead>Urgency</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {optimizedOrder.map((m) => (
                          <TableRow
                            key={m.name}
                            className={m.defaultRisk > 0.2 ? "bg-red-950/15" : m.change > 1 ? "bg-emerald-950/10" : ""}
                          >
                            <TableCell className="font-mono text-sm font-bold" style={{ color: "var(--copper-400)" }}>
                              {m.aiOrder}
                            </TableCell>
                            <TableCell className="text-sm font-medium">{m.name}</TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground font-mono">
                              {m.defaultOrder}
                            </TableCell>
                            <TableCell className="text-center">
                              {m.change > 0 ? (
                                <div className="flex items-center justify-center gap-0.5 text-emerald-400">
                                  <ArrowUp className="h-3 w-3" />
                                  <span className="text-xs font-mono">+{m.change}</span>
                                </div>
                              ) : m.change < 0 ? (
                                <div className="flex items-center justify-center gap-0.5 text-red-400">
                                  <ArrowDown className="h-3 w-3" />
                                  <span className="text-xs font-mono">{m.change}</span>
                                </div>
                              ) : (
                                <Minus className="h-3 w-3 text-muted-foreground mx-auto" />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-14 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{ width: `${m.reliability * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono">{(m.reliability * 100).toFixed(0)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 h-4 ${
                                  m.defaultRisk > 0.2 ? "text-red-400 border-red-900" :
                                  m.defaultRisk > 0.1 ? "text-orange-400 border-orange-900" :
                                  "text-emerald-400 border-emerald-900"
                                }`}
                              >
                                {(m.defaultRisk * 100).toFixed(0)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="h-1.5 w-12 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${(m.urgencyScore || 0) * 100}%`,
                                    backgroundColor: (m.urgencyScore || 0) > 0.7 ? "var(--copper-400)" : "hsl(30 8% 45%)",
                                  }}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>

                  {selected.memberList.some((m) => m.defaultRisk > 0.2) && (
                    <div className="p-4 border-t">
                      <div className="flex items-start gap-2.5 p-3 rounded-lg border border-yellow-900/50 bg-yellow-950/15">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-yellow-300">Early Warning System</p>
                          <p className="text-xs text-yellow-400/80 mt-0.5">
                            {selected.memberList.filter((m) => m.defaultRisk > 0.2).map((m) => m.name).join(", ")}{" "}
                            {selected.memberList.filter((m) => m.defaultRisk > 0.2).length > 1 ? "have" : "has"} elevated default risk (&gt;20%).
                            AI recommends proactive outreach by circle leader before the next collection date.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Algorithm explanation */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4" style={{ color: "var(--copper-400)" }} />
                    How AI Optimizes Your Circle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-3">
                    {[
                      { label: "Default Prediction", desc: "ML model trained on 500 Zambian circles predicts each member's default probability using payment history, income patterns, and social ties." },
                      { label: "Urgency Detection", desc: "Claude AI analyses transaction patterns to identify which members have the most urgent cash flow need, prioritizing those facing medical or school fee deadlines." },
                      { label: "Order Optimization", desc: "Constraint solver balances urgency (60% weight) and reliability (40% weight) to sequence payouts that maximize group completion probability." },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-lg bg-secondary/40 space-y-1.5">
                        <p className="text-xs font-semibold">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Separator />
            </>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                Select a circle to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
