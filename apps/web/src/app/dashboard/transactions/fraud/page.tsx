"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle, Shield, ShieldAlert, ShieldCheck, Activity,
  Zap, Clock, ArrowLeftRight, ChevronLeft,
} from "lucide-react";
import { generateUsers, generateTransactions } from "@/lib/utils/synthetic";
import { MOBILE_PLATFORMS } from "@/lib/constants";
import { formatZMW } from "@/lib/utils/zambia-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell,
} from "recharts";
import Link from "next/link";

const USERS = generateUsers(500);
const TRANSACTIONS = generateTransactions(500, 50000);

const FLAGGED = TRANSACTIONS.filter((t) => t.fraudScore > 0.5).sort((a, b) => b.fraudScore - a.fraudScore);
const HIGH_RISK = FLAGGED.filter((t) => t.fraudScore > 0.7);
const MEDIUM_RISK = FLAGGED.filter((t) => t.fraudScore <= 0.7);

// ─── Rule engine definitions ─────────────────────────────────────────────────
const RULES = [
  {
    id: "R01",
    name: "Velocity Attack",
    description: "More than 5 transactions in any 5-minute window from single account",
    condition: "tx_count(5min) > 5",
    severity: "critical" as const,
    triggered: Math.round(HIGH_RISK.length * 0.35),
    model: "Velocity Engine",
  },
  {
    id: "R02",
    name: "Account Takeover Signal",
    description: "New device fingerprint combined with large withdrawal within 10 minutes",
    condition: "new_device AND amount > K2000 AND type=CASH_OUT",
    severity: "critical" as const,
    triggered: Math.round(HIGH_RISK.length * 0.15),
    model: "Isolation Forest",
  },
  {
    id: "R03",
    name: "Large P2P Transfer",
    description: "Peer-to-peer transfer exceeds K5,000 — abnormal for informal sector",
    condition: "type=P2P AND amount > K5000",
    severity: "high" as const,
    triggered: Math.round(HIGH_RISK.length * 0.30),
    model: "Rule Engine",
  },
  {
    id: "R04",
    name: "Cross-Platform Burst",
    description: "Transactions across 3+ different mobile money platforms within 1 hour",
    condition: "unique_platforms(1hr) >= 3",
    severity: "high" as const,
    triggered: Math.round(MEDIUM_RISK.length * 0.25),
    model: "Graph Analysis",
  },
  {
    id: "R05",
    name: "Late-Night Large Amount",
    description: "Transactions over K1,500 between 01:00–05:00 local time",
    condition: "hour IN (1,2,3,4,5) AND amount > K1500",
    severity: "high" as const,
    triggered: Math.round(MEDIUM_RISK.length * 0.20),
    model: "Rule Engine",
  },
  {
    id: "R06",
    name: "New Counterparty Burst",
    description: "Sending money to 5 or more new recipients not seen in past 30 days",
    condition: "new_recipients(30d) >= 5 AND window=24hr",
    severity: "medium" as const,
    triggered: Math.round(MEDIUM_RISK.length * 0.35),
    model: "Velocity Engine",
  },
  {
    id: "R07",
    name: "Rapid Cash-In / Cash-Out",
    description: "CASH_IN immediately followed by CASH_OUT within 10 minutes (muling pattern)",
    condition: "CASH_IN then CASH_OUT within 10min AND amount_diff < 5%",
    severity: "medium" as const,
    triggered: Math.round(MEDIUM_RISK.length * 0.20),
    model: "Sequence Model",
  },
  {
    id: "R08",
    name: "Round Amount Series",
    description: "3 or more identical round-number amounts sent within 1 hour (structuring)",
    condition: "identical_round_amounts(1hr) >= 3",
    severity: "medium" as const,
    triggered: Math.round(MEDIUM_RISK.length * 0.15),
    model: "Autoencoder",
  },
  {
    id: "R09",
    name: "Hourly Volume Spike",
    description: "Transaction volume 4x above user's 30-day rolling hourly average",
    condition: "hourly_volume > 4 * avg_30d_hourly",
    severity: "low" as const,
    triggered: Math.round(MEDIUM_RISK.length * 0.05),
    model: "Isolation Forest",
  },
  {
    id: "R10",
    name: "Geographic Anomaly",
    description: "Transaction originates from district not seen in user history",
    condition: "origin_district NOT IN user_history_districts",
    severity: "low" as const,
    triggered: Math.round(MEDIUM_RISK.length * 0.05),
    model: "Rule Engine",
  },
];

const SEVERITY_CONFIG = {
  critical: { color: "text-red-400", border: "border-red-900/60", bg: "bg-red-950/30", badge: "destructive" as const, dot: "bg-red-400" },
  high: { color: "text-orange-400", border: "border-orange-900/50", bg: "bg-orange-950/20", badge: "secondary" as const, dot: "bg-orange-400" },
  medium: { color: "text-yellow-400", border: "border-yellow-900/40", bg: "bg-yellow-950/15", badge: "secondary" as const, dot: "bg-yellow-400" },
  low: { color: "text-blue-400", border: "border-blue-900/40", bg: "bg-blue-950/10", badge: "secondary" as const, dot: "bg-blue-400" },
};

// Fraud by hour (synthetic distribution — peaks at 1–4am)
const FRAUD_BY_HOUR = Array.from({ length: 24 }, (_, h) => {
  const base = FLAGGED.length / 24;
  const peak = h >= 1 && h <= 4 ? 3.2 : h >= 22 ? 1.8 : h >= 9 && h <= 17 ? 0.5 : 1.0;
  return { hour: `${h.toString().padStart(2, "0")}:00`, alerts: Math.round(base * peak * (0.8 + Math.random() * 0.4)) };
});

const scatterData = TRANSACTIONS.slice(-2000).map((t) => ({
  amount: Math.min(t.amount, 8000),
  fraudScore: t.fraudScore,
}));

const CHART_STYLE = {
  background: "hsl(20 10% 12%)",
  border: "1px solid hsl(20 8% 22%)",
  borderRadius: "6px",
  fontSize: "11px",
};

export default function FraudDetectionPage() {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Fraud Detection Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Module 2B: Isolation Forest · Velocity Rules · Autoencoder · Graph Analysis
          </p>
        </div>
        <Link href="/dashboard/transactions">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Ledger
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Alerts" value={FLAGGED.length} description="Flagged transactions" icon={AlertTriangle} accentColor="red" />
        <StatCard title="Critical / High" value={HIGH_RISK.length} description="Fraud score > 70%" icon={ShieldAlert} accentColor="red" />
        <StatCard title="Medium Risk" value={MEDIUM_RISK.length} description="Fraud score 50–70%" icon={Shield} accentColor="copper" />
        <StatCard title="Detection Rate" value="99.2%" description="AUC-ROC: 0.87" icon={ShieldCheck} accentColor="green" />
      </div>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules" className="gap-1.5"><Zap className="h-3.5 w-3.5" /> Rule Engine</TabsTrigger>
          <TabsTrigger value="alerts" className="gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Live Alerts</TabsTrigger>
          <TabsTrigger value="analysis" className="gap-1.5"><Activity className="h-3.5 w-3.5" /> Analysis</TabsTrigger>
        </TabsList>

        {/* ─── Rule Engine Tab ─── */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {RULES.length} active rules across 4 detection models · Updated daily
            </p>
            <Badge variant="outline" className="text-emerald-400 border-emerald-800 gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems active
            </Badge>
          </div>

          <div className="space-y-2">
            {RULES.map((rule) => {
              const cfg = SEVERITY_CONFIG[rule.severity];
              const isSelected = selectedRule === rule.id;
              return (
                <Card
                  key={rule.id}
                  className={`cursor-pointer transition-all duration-150 border ${cfg.border} ${isSelected ? cfg.bg : "hover:bg-secondary/50"}`}
                  onClick={() => setSelectedRule(isSelected ? null : rule.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Severity indicator */}
                      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                        <div className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">{rule.id}</span>
                      </div>

                      {/* Rule info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">{rule.name}</span>
                          <Badge variant="outline" className={`text-[10px] px-1.5 h-4 ${cfg.color} border-current`}>
                            {rule.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 h-4 text-muted-foreground">
                            {rule.model}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                        {isSelected && (
                          <div className="mt-3 p-2.5 rounded-md bg-black/30 border border-white/10">
                            <p className="text-[10px] text-muted-foreground mb-1 font-mono uppercase tracking-wide">Condition</p>
                            <code className="text-xs text-emerald-400 font-mono">{rule.condition}</code>
                          </div>
                        )}
                      </div>

                      {/* Trigger count */}
                      <div className="shrink-0 text-right">
                        <div className={`text-2xl font-bold font-mono ${cfg.color}`}>{rule.triggered}</div>
                        <div className="text-[10px] text-muted-foreground">triggers</div>
                        <div className="mt-1.5 h-1.5 w-20 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rule.severity === "critical" ? "bg-red-500" : rule.severity === "high" ? "bg-orange-500" : rule.severity === "medium" ? "bg-yellow-500" : "bg-blue-500"}`}
                            style={{ width: `${Math.min(100, (rule.triggered / (FLAGGED.length * 0.4)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detection models */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Detection Models</CardTitle>
              <CardDescription className="text-xs">Ensemble of 4 models — results combined via weighted vote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { name: "Isolation Forest", desc: "Unsupervised outlier detection on amount, frequency, counterparty patterns", param: "Contamination: 0.05", icon: Activity, color: "text-blue-400" },
                  { name: "Velocity Engine", desc: "Configurable rule-based checks for rapid-fire transactions per user tier", param: "Window: 5min / 1hr / 24hr", icon: Zap, color: "text-yellow-400" },
                  { name: "Autoencoder", desc: "Deep learning model — high reconstruction error signals unusual behavior", param: "MSE threshold: 0.15", icon: Shield, color: "text-purple-400" },
                  { name: "Graph Analysis", desc: "Detects fraud rings and cross-platform muling via network topology", param: "Community detection", icon: ArrowLeftRight, color: "text-teal-400" },
                ].map((model) => (
                  <div key={model.name} className="p-3 border rounded-lg space-y-1.5 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <model.icon className={`h-3.5 w-3.5 ${model.color}`} />
                      <span className="text-xs font-semibold">{model.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{model.desc}</p>
                    <Badge variant="outline" className="text-[9px] px-1.5 h-4">{model.param}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Live Alerts Tab ─── */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Flagged Transactions</CardTitle>
              <CardDescription className="text-xs">{FLAGGED.length} transactions requiring review · Sorted by fraud score</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono text-xs">ID</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FLAGGED.slice(0, 30).map((tx) => (
                    <TableRow
                      key={tx.ndalamaId}
                      className={tx.fraudScore > 0.7 ? "bg-red-950/25" : "bg-orange-950/15"}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">{tx.ndalamaId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {MOBILE_PLATFORMS[tx.originalPlatform]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{USERS[tx.senderIndex]?.name}</TableCell>
                      <TableCell className="text-sm">{USERS[tx.receiverIndex]?.name}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium">{formatZMW(tx.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${tx.fraudScore > 0.7 ? "bg-red-500" : "bg-orange-500"}`}
                              style={{ width: `${tx.fraudScore * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs font-mono font-semibold ${tx.fraudScore > 0.7 ? "text-red-400" : "text-orange-400"}`}>
                            {(tx.fraudScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {tx.fraudFlags.map((flag) => (
                            <Badge key={flag} variant="destructive" className="text-[9px] px-1 py-0 h-4">
                              {flag.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tx.timestamp.toLocaleDateString("en-ZM", { month: "short", day: "numeric" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Analysis Tab ─── */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Fraud by hour of day */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  Fraud Alerts by Hour of Day
                </CardTitle>
                <CardDescription className="text-xs">Pattern shows peak activity 01:00–04:00 (Zambia Time)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={FRAUD_BY_HOUR} margin={{ top: 4, right: 4, bottom: 4, left: -16 }}>
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 8, fill: "hsl(30 8% 50%)" }}
                      interval={3}
                      tickFormatter={(v) => v.slice(0, 2)}
                    />
                    <YAxis tick={{ fontSize: 9, fill: "hsl(30 8% 50%)" }} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Bar dataKey="alerts" radius={[2, 2, 0, 0]} name="Alerts">
                      {FRAUD_BY_HOUR.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.alerts > 25 ? "#EF4444" : entry.alerts > 15 ? "#F97316" : "hsl(20 8% 35%)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Amount vs Fraud Score scatter */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  Anomaly Detection Map
                </CardTitle>
                <CardDescription className="text-xs">Transaction amount vs fraud probability · 2,000 sample</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <ScatterChart margin={{ top: 4, right: 4, bottom: 4, left: -10 }}>
                    <XAxis
                      type="number"
                      dataKey="amount"
                      name="Amount (ZMW)"
                      tick={{ fontSize: 9, fill: "hsl(30 8% 50%)" }}
                      tickFormatter={(v) => `K${v}`}
                    />
                    <YAxis
                      type="number"
                      dataKey="fraudScore"
                      name="Fraud Score"
                      domain={[0, 1]}
                      tick={{ fontSize: 9, fill: "hsl(30 8% 50%)" }}
                    />
                    <ZAxis range={[12, 12]} />
                    <Tooltip
                      contentStyle={CHART_STYLE}
                      formatter={(v, name) => [
                        name === "Amount (ZMW)" ? formatZMW(Number(v)) : `${(Number(v) * 100).toFixed(1)}%`,
                        name,
                      ]}
                    />
                    <Scatter data={scatterData.filter((d) => d.fraudScore <= 0.5)} fill="hsl(20 8% 35%)" fillOpacity={0.4} name="Normal" />
                    <Scatter data={scatterData.filter((d) => d.fraudScore > 0.5 && d.fraudScore <= 0.7)} fill="#F97316" fillOpacity={0.7} name="Medium" />
                    <Scatter data={scatterData.filter((d) => d.fraudScore > 0.7)} fill="#EF4444" fillOpacity={0.9} name="High Risk" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Fraud type breakdown */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Alert Categories by Rule</CardTitle>
                <CardDescription className="text-xs">Trigger count by detection rule across all flagged transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={RULES.map((r) => ({ name: r.name, triggers: r.triggered, severity: r.severity }))}
                    layout="vertical"
                    margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 9, fill: "hsl(30 8% 50%)" }} />
                    <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 10, fill: "hsl(30 8% 60%)" }} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Bar dataKey="triggers" radius={[0, 4, 4, 0]} name="Triggers">
                      {RULES.map((rule, i) => (
                        <Cell
                          key={i}
                          fill={
                            rule.severity === "critical" ? "#EF4444" :
                            rule.severity === "high" ? "#F97316" :
                            rule.severity === "medium" ? "#EAB308" : "#3B82F6"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
