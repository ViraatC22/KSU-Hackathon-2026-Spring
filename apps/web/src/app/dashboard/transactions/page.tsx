"use client";

import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TransactionNetwork } from "@/components/dashboard/transaction-network";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeftRight, AlertTriangle, CheckCircle, Clock, Search,
  TrendingUp, Shield, Network, BarChart3,
} from "lucide-react";
import { generateUsers, generateTransactions } from "@/lib/utils/synthetic";
import { MOBILE_PLATFORMS, TX_TYPES, RECONCILIATION_STATUSES } from "@/lib/constants";
import { formatZMW } from "@/lib/utils/zambia-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const USERS = generateUsers(500);
const TRANSACTIONS = generateTransactions(500, 50000);

function formatDate(d: Date) {
  return d.toLocaleDateString("en-ZM", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-ZM", { hour: "2-digit", minute: "2-digit" });
}

const PLATFORM_COLORS = { MTN_MONEY: "#EAB308", AIRTEL_MONEY: "#EF4444", ZOONA: "#22C55E" };
const STATUS_ICONS = {
  MATCHED: <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />,
  PENDING: <Clock className="h-3.5 w-3.5 text-yellow-500" />,
  DISCREPANCY: <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />,
  FLAGGED: <Shield className="h-3.5 w-3.5 text-red-500" />,
};

const CHART_STYLE = {
  background: "hsl(20 10% 12%)",
  border: "1px solid hsl(20 8% 22%)",
  borderRadius: "6px",
  fontSize: "11px",
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [highlightFraud, setHighlightFraud] = useState(false);
  const pageSize = 25;

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((tx) => {
      if (platformFilter !== "all" && tx.originalPlatform !== platformFilter) return false;
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (statusFilter !== "all" && tx.reconciliationStatus !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          tx.ndalamaId.toLowerCase().includes(q) ||
          tx.originalTxId.toLowerCase().includes(q) ||
          USERS[tx.senderIndex]?.name.toLowerCase().includes(q) ||
          USERS[tx.receiverIndex]?.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, platformFilter, typeFilter, statusFilter]);

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const totalVolume = TRANSACTIONS.reduce((s, t) => s + t.amount, 0);
  const flaggedCount = TRANSACTIONS.filter((t) => t.fraudScore > 0.5).length;
  const matchedPct = Math.round(
    (TRANSACTIONS.filter((t) => t.reconciliationStatus === "MATCHED").length / TRANSACTIONS.length) * 100
  );

  const platformBreakdown = Object.entries(
    TRANSACTIONS.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.originalPlatform] = (acc[tx.originalPlatform] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name: MOBILE_PLATFORMS[name as keyof typeof MOBILE_PLATFORMS]?.label || name,
    value,
    fill: PLATFORM_COLORS[name as keyof typeof PLATFORM_COLORS] || "#888",
  }));

  const typeBreakdown = Object.entries(
    TRANSACTIONS.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, value]) => ({ name: TX_TYPES[name as keyof typeof TX_TYPES] || name, value }));

  const monthlyVolume = useMemo(() => {
    const months: Record<string, number> = {};
    TRANSACTIONS.forEach((tx) => {
      const key = `${tx.timestamp.getFullYear()}-${String(tx.timestamp.getMonth() + 1).padStart(2, "0")}`;
      months[key] = (months[key] || 0) + tx.amount;
    });
    return Object.entries(months)
      .sort()
      .slice(-6)
      .map(([month, volume]) => ({ month: month.slice(5), volume: Math.round(volume) }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Cross-Platform Transactions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Module 2: Unified ledger across MTN Money, Airtel Money & Zoona · Real-time fraud detection
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 text-emerald-400 border-emerald-800">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live sync
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Transactions" value={TRANSACTIONS.length.toLocaleString()} description="Across all platforms" icon={ArrowLeftRight} accentColor="teal" />
        <StatCard title="Total Volume" value={formatZMW(totalVolume)} description="Last 6 months" icon={TrendingUp} accentColor="copper" trend={{ value: 14, label: "vs prior period" }} />
        <StatCard title="Reconciliation Rate" value={`${matchedPct}%`} description="Auto-matched" icon={CheckCircle} accentColor="green" />
        <StatCard title="Fraud Alerts" value={flaggedCount} description="Flagged for review" icon={AlertTriangle} accentColor={flaggedCount > 0 ? "red" : "default"} />
      </div>

      <Tabs defaultValue="ledger">
        <TabsList className="grid grid-cols-3 w-[360px]">
          <TabsTrigger value="ledger" className="gap-1.5">
            <ArrowLeftRight className="h-3.5 w-3.5" /> Ledger
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-1.5">
            <Network className="h-3.5 w-3.5" /> Network
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* ─── Ledger Tab ─── */}
        <TabsContent value="ledger" className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, sender, receiver..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="pl-9"
              />
            </div>
            <Select value={platformFilter} onValueChange={(v) => { setPlatformFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="MTN_MONEY">MTN Money</SelectItem>
                <SelectItem value="AIRTEL_MONEY">Airtel Money</SelectItem>
                <SelectItem value="ZOONA">Zoona</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(TX_TYPES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(RECONCILIATION_STATUSES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">{filtered.length.toLocaleString()} transactions found</p>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono text-xs">ID</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fraud</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((tx) => (
                    <TableRow
                      key={tx.ndalamaId}
                      className={
                        tx.fraudScore > 0.7
                          ? "bg-red-950/25 hover:bg-red-950/40"
                          : tx.fraudScore > 0.5
                          ? "bg-orange-950/20 hover:bg-orange-950/35"
                          : ""
                      }
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">{tx.ndalamaId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs" style={{
                          color: PLATFORM_COLORS[tx.originalPlatform as keyof typeof PLATFORM_COLORS],
                          borderColor: PLATFORM_COLORS[tx.originalPlatform as keyof typeof PLATFORM_COLORS] + "44",
                        }}>
                          {MOBILE_PLATFORMS[tx.originalPlatform]?.label || tx.originalPlatform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{USERS[tx.senderIndex]?.name || "Unknown"}</TableCell>
                      <TableCell className="text-sm">{USERS[tx.receiverIndex]?.name || "Unknown"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {TX_TYPES[tx.type as keyof typeof TX_TYPES] || tx.type}
                      </TableCell>
                      <TableCell className="text-right font-medium font-mono text-sm">
                        {formatZMW(tx.amount)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatDate(tx.timestamp)}<br />
                        <span className="text-muted-foreground">{formatTime(tx.timestamp)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {STATUS_ICONS[tx.reconciliationStatus as keyof typeof STATUS_ICONS]}
                          <span className={`text-xs ${RECONCILIATION_STATUSES[tx.reconciliationStatus as keyof typeof RECONCILIATION_STATUSES]?.color || ""}`}>
                            {RECONCILIATION_STATUSES[tx.reconciliationStatus as keyof typeof RECONCILIATION_STATUSES]?.label || tx.reconciliationStatus}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {tx.fraudScore > 0.7 ? (
                          <Badge variant="destructive" className="text-xs font-mono">
                            {(tx.fraudScore * 100).toFixed(0)}%
                          </Badge>
                        ) : tx.fraudScore > 0.5 ? (
                          <Badge variant="secondary" className="text-xs font-mono text-orange-400">
                            {(tx.fraudScore * 100).toFixed(0)}%
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground font-mono">
                            {(tx.fraudScore * 100).toFixed(0)}%
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages} · {filtered.length.toLocaleString()} results
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ─── Network Tab ─── */}
        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Network className="h-4 w-4" style={{ color: "var(--copper-400)" }} />
                    Transaction Network Graph
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Force-directed graph · 65 most active users · node size = activity volume · hover for details
                  </CardDescription>
                </div>
                <Button
                  variant={highlightFraud ? "destructive" : "outline"}
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setHighlightFraud((h) => !h)}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {highlightFraud ? "Hide Fraud" : "Highlight Fraud"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div style={{ height: "540px" }}>
                <TransactionNetwork
                  users={USERS}
                  transactions={TRANSACTIONS}
                  highlightFraud={highlightFraud}
                />
              </div>
            </CardContent>
          </Card>

          {/* Network legend card */}
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { platform: "MTN Money", color: "#EAB308", count: TRANSACTIONS.filter(t => t.originalPlatform === "MTN_MONEY").length },
              { platform: "Airtel Money", color: "#EF4444", count: TRANSACTIONS.filter(t => t.originalPlatform === "AIRTEL_MONEY").length },
              { platform: "Zoona", color: "#22C55E", count: TRANSACTIONS.filter(t => t.originalPlatform === "ZOONA").length },
            ].map((item) => (
              <Card key={item.platform} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}66` }} />
                  <div>
                    <p className="text-sm font-medium">{item.platform}</p>
                    <p className="text-xs text-muted-foreground font-mono">{item.count.toLocaleString()} transactions</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── Analytics Tab ─── */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Platform Distribution</CardTitle>
                <CardDescription className="text-xs">Transaction count by mobile money platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={platformBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={40}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {platformBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CHART_STYLE} formatter={(v) => Number(v).toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Transaction Types</CardTitle>
                <CardDescription className="text-xs">Volume by transaction category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={typeBreakdown} margin={{ top: 4, right: 4, bottom: 40, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(20 8% 20%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(30 8% 55%)" }} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(30 8% 55%)" }} />
                    <Tooltip contentStyle={CHART_STYLE} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--copper-500)" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Monthly Transaction Volume (ZMW)</CardTitle>
                <CardDescription className="text-xs">Total value of transactions processed per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlyVolume} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(20 8% 20%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(30 8% 55%)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(30 8% 55%)" }} tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={CHART_STYLE} formatter={(v) => formatZMW(Number(v))} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="var(--copper-400)"
                      strokeWidth={2.5}
                      dot={{ fill: "var(--copper-500)", r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Volume (ZMW)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
