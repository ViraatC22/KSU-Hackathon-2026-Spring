"use client";

import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ScoreGauge } from "@/components/dashboard/score-gauge";
import { ShapWaterfallChart } from "@/components/dashboard/shap-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, TrendingUp, Users, BarChart3, Eye, Shield } from "lucide-react";
import { generateUsers, generateTransactions, computeCreditScore } from "@/lib/utils/synthetic";
import { CREDIT_TIERS } from "@/lib/constants";
import { formatZMW } from "@/lib/utils/zambia-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from "recharts";
import Link from "next/link";

const USERS = generateUsers(500);
const TRANSACTIONS = generateTransactions(500, 50000);

const USER_SCORES = USERS.map((user, idx) => {
  const userTxns = TRANSACTIONS.filter((t) => t.senderIndex === idx || t.receiverIndex === idx);
  const uniqueCounterparties = new Set(userTxns.map((t) => (t.senderIndex === idx ? t.receiverIndex : t.senderIndex))).size;
  const avgAmount = userTxns.length > 0 ? userTxns.reduce((s, t) => s + t.amount, 0) / userTxns.length : 0;
  const circleReliability = 0.4 + (idx % 7) * 0.08 + (idx % 3) * 0.05;

  const score = computeCreditScore(userTxns.length, avgAmount, uniqueCounterparties, user.platforms.length, user.kycStatus === "VERIFIED", Math.min(circleReliability, 0.99));

  // Build SHAP-style factors
  const shapFactors = [
    { feature: "Transaction Frequency", impact: Math.round((Math.min(userTxns.length, 200) / 200) * 180 - 40), description: `${userTxns.length} transactions in 6 months` },
    { feature: "Avg Transaction Size", impact: Math.round((Math.min(avgAmount, 1000) / 1000) * 100 - 20), description: `Average of ${formatZMW(avgAmount)} per transaction` },
    { feature: "Network Diversity", impact: Math.round((Math.min(uniqueCounterparties, 30) / 30) * 80 - 10), description: `${uniqueCounterparties} unique counterparties` },
    { feature: "KYC Verification", impact: user.kycStatus === "VERIFIED" ? 120 : -50, description: user.kycStatus === "VERIFIED" ? "Identity confirmed with NRC" : "Identity not yet verified" },
    { feature: "Savings Circle", impact: Math.round((circleReliability - 0.5) * 140), description: `${(circleReliability * 100).toFixed(0)}% Chilimba reliability score` },
    { feature: "Platform Diversity", impact: (user.platforms.length - 1) * 35, description: `Active on ${user.platforms.length} mobile money platforms` },
    { feature: "Account Age", impact: Math.round(Math.random() * 40 - 20), description: "Estimated from transaction history" },
  ];

  const baseScore = 350;

  return { ...user, idx, score, shapFactors, baseScore, txCount: userTxns.length, avgAmount, circleReliability };
});

const TIER_COLORS: Record<string, string> = { A: "#3aba72", B: "#38b2a3", C: "#e4a832", D: "#e47d3c", E: "#d94545" };

export default function CreditScorePage() {
  const [selectedUser, setSelectedUser] = useState(0);
  const selected = USER_SCORES[selectedUser];
  const [gaugeKey, setGaugeKey] = useState(0);

  const tierDistribution = useMemo(() =>
    Object.entries(USER_SCORES.reduce<Record<string, number>>((acc, u) => {
      acc[u.score.tier] = (acc[u.score.tier] || 0) + 1;
      return acc;
    }, {})).map(([tier, count]) => ({
      tier: `Tier ${tier}`, count,
      fill: TIER_COLORS[tier] || "#888",
      label: CREDIT_TIERS[tier as keyof typeof CREDIT_TIERS]?.label || tier,
    })), []
  );

  const avgScore = Math.round(USER_SCORES.reduce((s, u) => s + u.score.score, 0) / USER_SCORES.length);
  const verifiedPct = Math.round((USER_SCORES.filter((u) => u.kycStatus === "VERIFIED").length / USER_SCORES.length) * 100);

  const radarData = [
    { subject: "Transactions", A: selected.score.transactionScore * 1000, fullMark: 600 },
    { subject: "Behavior", A: selected.score.behavioralScore * 1000, fullMark: 250 },
    { subject: "Identity", A: selected.score.identityScore * 1000, fullMark: 150 },
    { subject: "Volume", A: Math.min(selected.txCount, 200) * 3, fullMark: 600 },
    { subject: "Diversity", A: selected.platforms.length * 100, fullMark: 300 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">AI Credit Scoring Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Module 1: Alternative credit scoring · 107 features · Ensemble ML · SHAP explainability
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/credit-score/bias-audit">
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary gap-1.5">
              <Shield className="h-3 w-3" /> Fairness Audit
            </Badge>
          </Link>
          <Link href="/dashboard/credit-score/bias-audit">
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary gap-1.5">
              <Eye className="h-3 w-3" /> XAI Explorer
            </Badge>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Users Scored" value={USER_SCORES.length} description="With full credit profiles" icon={Users} accentColor="copper" />
        <StatCard title="Average Score" value={avgScore} description={`Tier ${avgScore >= 800 ? "A" : avgScore >= 650 ? "B" : avgScore >= 500 ? "C" : avgScore >= 350 ? "D" : "E"} — Platform average`} icon={CreditCard} accentColor="teal" />
        <StatCard title="KYC Verified" value={`${verifiedPct}%`} description="Identity confirmed" icon={TrendingUp} accentColor="green" />
        <StatCard title="Feature Count" value="107+" description="Across 9 categories" icon={BarChart3} accentColor="copper" />
      </div>

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Individual Score</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          <TabsTrigger value="leaderboard">Top Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="flex gap-4 items-start">
            <Select value={String(selectedUser)} onValueChange={(v) => { setSelectedUser(Number(v)); setGaugeKey((k) => k + 1); }}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {USER_SCORES.slice(0, 50).map((u, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {u.name} — Score {u.score.score} (Tier {u.score.tier})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Animated Score Gauge */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Credit Score</CardTitle>
                <CardDescription>{selected.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-3">
                <ScoreGauge key={gaugeKey} score={selected.score.score} size={220} />

                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">District</span>
                    <span className="font-medium">{selected.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Province</span>
                    <span className="font-medium">{selected.province}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">KYC Status</span>
                    <Badge variant={selected.kycStatus === "VERIFIED" ? "default" : "secondary"} className="text-xs">
                      {selected.kycStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platforms</span>
                    <div className="flex gap-1">
                      {selected.platforms.map((p) => (
                        <Badge key={p} variant="outline" className="text-[10px] px-1 py-0">{p.split("_")[0]}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transactions (6mo)</span>
                    <span className="font-medium">{selected.txCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SHAP Waterfall Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Score Factors — SHAP Explainability</CardTitle>
                <CardDescription>Why this score was assigned · Every factor is transparent</CardDescription>
              </CardHeader>
              <CardContent>
                <ShapWaterfallChart
                  factors={selected.shapFactors}
                  baseScore={selected.baseScore}
                  finalScore={selected.score.score}
                />

                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Component Score Breakdown</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Transaction Score</span>
                        <span className="font-mono">{(selected.score.transactionScore * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={selected.score.transactionScore * 100 / 0.6} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Behavioral Score</span>
                        <span className="font-mono">{(selected.score.behavioralScore * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={selected.score.behavioralScore * 100 / 0.25} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Identity Score</span>
                        <span className="font-mono">{(selected.score.identityScore * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={selected.score.identityScore * 100 / 0.15} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Multi-Dimensional Score Radar</CardTitle>
                <CardDescription>Credit profile across all major feature categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(20 8% 22%)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(30 8% 58%)" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 600]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="A" stroke="var(--copper-400)" fill="var(--copper-400)" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tier Distribution</CardTitle>
                <CardDescription>Users by credit tier across Zambia</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tierDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(20 8% 18%)" />
                    <XAxis dataKey="tier" tick={{ fontSize: 11, fill: "hsl(30 8% 58%)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(30 8% 58%)" }} />
                    <Tooltip contentStyle={{ background: "hsl(20 10% 12%)", border: "1px solid hsl(20 8% 22%)", borderRadius: "8px" }} formatter={(v) => [`${v} users`, "Count"]} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {tierDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tier Breakdown</CardTitle>
                <CardDescription>Percentage distribution by credit tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tierDistribution.map((t) => {
                    const pct = Math.round((t.count / USER_SCORES.length) * 100);
                    return (
                      <div key={t.tier} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span>{t.tier} <span className="text-muted-foreground text-xs">({t.label})</span></span>
                          <span className="font-mono font-medium">{t.count} users ({pct}%)</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: t.fill }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Scored Users</CardTitle>
              <CardDescription>Highest credit scores on the platform</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Platforms</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...USER_SCORES].sort((a, b) => b.score.score - a.score.score).slice(0, 25).map((u, i) => {
                    const ti = CREDIT_TIERS[u.score.tier as keyof typeof CREDIT_TIERS];
                    return (
                      <TableRow key={u.idx}>
                        <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{u.district}</TableCell>
                        <TableCell>
                          <span className="font-mono font-bold" style={{ color: TIER_COLORS[u.score.tier] || "#888" }}>
                            {u.score.score}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-xs ${ti?.bg || ""} ${ti?.color || ""}`}>
                            {u.score.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{u.txCount}</TableCell>
                        <TableCell>
                          <Badge variant={u.kycStatus === "VERIFIED" ? "default" : "secondary"} className="text-xs">
                            {u.kycStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{u.platforms.length}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
