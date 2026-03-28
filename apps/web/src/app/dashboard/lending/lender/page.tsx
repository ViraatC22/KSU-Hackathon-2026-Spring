"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Landmark, TrendingUp, DollarSign, Users, CheckCircle } from "lucide-react";
import { CREDIT_TIERS } from "@/lib/constants";
import { formatZMW } from "@/lib/utils/zambia-data";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const OPEN_REQUESTS = [
  { id: "LOAN-002", borrower: "Natasha Phiri", district: "Ndola", amount: 10000, purpose: "Equipment purchase", term: 12, creditScore: 680, tier: "B" },
  { id: "LOAN-004", borrower: "Charity Mumba", district: "Kabwe", amount: 7500, purpose: "Market stall renovation", term: 9, creditScore: 640, tier: "C" },
  { id: "LOAN-009", borrower: "Esther Moyo", district: "Lusaka", amount: 3500, purpose: "Beauty supply stock", term: 6, creditScore: 710, tier: "B" },
  { id: "LOAN-010", borrower: "Mulenga Daka", district: "Kasama", amount: 6000, purpose: "Fishing equipment", term: 12, creditScore: 520, tier: "C" },
];

const PORTFOLIO = [
  { tier: "A", amount: 45000, count: 3, fill: "#10B981" },
  { tier: "B", amount: 78000, count: 6, fill: "#3B82F6" },
  { tier: "C", amount: 32000, count: 4, fill: "#EAB308" },
  { tier: "D", amount: 8000, count: 1, fill: "#F97316" },
];

const totalPortfolio = PORTFOLIO.reduce((s, p) => s + p.amount, 0);
const totalLoans = PORTFOLIO.reduce((s, p) => s + p.count, 0);

export default function LenderDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lender Dashboard</h1>
          <p className="text-muted-foreground">
            Module 4: Review vetted borrowers, set risk appetite, and manage your lending portfolio
          </p>
        </div>
        <Link href="/dashboard/lending">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">Borrower View</Badge>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Portfolio Value" value={formatZMW(totalPortfolio)} description={`${totalLoans} active loans`} icon={DollarSign} />
        <StatCard title="Avg Return" value="11.8%" description="Weighted average rate" icon={TrendingUp} />
        <StatCard title="Open Requests" value={OPEN_REQUESTS.length} description="Awaiting your offer" icon={Users} />
        <StatCard title="Repayment Rate" value="96.1%" description="Portfolio health" icon={CheckCircle} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Portfolio Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portfolio by Tier</CardTitle>
            <CardDescription>Exposure across credit tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={PORTFOLIO} dataKey="amount" nameKey="tier" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `Tier ${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {PORTFOLIO.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatZMW(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {PORTFOLIO.map((p) => (
                <div key={p.tier} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.fill }} />
                    Tier {p.tier} ({p.count} loans)
                  </span>
                  <span className="font-medium">{formatZMW(p.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open Loan Requests */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Open Loan Requests</CardTitle>
            <CardDescription>Vetted borrowers looking for funding</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {OPEN_REQUESTS.map((req) => {
                  const tierInfo = CREDIT_TIERS[req.tier as keyof typeof CREDIT_TIERS];
                  return (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{req.borrower}</p>
                          <p className="text-xs text-muted-foreground">{req.district}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{req.purpose}</TableCell>
                      <TableCell className="text-right font-medium">{formatZMW(req.amount)}</TableCell>
                      <TableCell className="text-sm">{req.term}mo</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={`font-medium ${tierInfo?.color || ""}`}>{req.creditScore}</span>
                          <Badge variant="secondary" className={`text-xs ${tierInfo?.bg || ""} ${tierInfo?.color || ""}`}>
                            {req.tier}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="text-xs gap-1">
                          <Landmark className="h-3 w-3" /> Make Offer
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
