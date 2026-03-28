"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Landmark, TrendingUp, Clock, CheckCircle, DollarSign } from "lucide-react";
import { LOAN_STATUSES, CREDIT_TIERS } from "@/lib/constants";
import { formatZMW } from "@/lib/utils/zambia-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Link from "next/link";

interface LoanApp {
  id: string;
  borrower: string;
  district: string;
  amount: number;
  purpose: string;
  term: number;
  status: keyof typeof LOAN_STATUSES;
  creditScore: number;
  creditTier: string;
  offers: number;
  bestRate: number | null;
  createdAt: Date;
}

const LOAN_APPS: LoanApp[] = [
  { id: "LOAN-001", borrower: "Mwila Tembo", district: "Lusaka", amount: 5000, purpose: "Inventory expansion - tomatoes", term: 6, status: "FUNDED", creditScore: 720, creditTier: "B", offers: 3, bestRate: 9.2, createdAt: new Date("2026-02-01") },
  { id: "LOAN-002", borrower: "Natasha Phiri", district: "Ndola", amount: 10000, purpose: "Equipment purchase - sewing machines", term: 12, status: "OPEN", creditScore: 680, creditTier: "B", offers: 2, bestRate: 11.5, createdAt: new Date("2026-03-05") },
  { id: "LOAN-003", borrower: "Daliso Mwale", district: "Kitwe", amount: 3000, purpose: "Working capital", term: 3, status: "REPAYING", creditScore: 590, creditTier: "C", offers: 1, bestRate: 15.0, createdAt: new Date("2026-01-15") },
  { id: "LOAN-004", borrower: "Charity Mumba", district: "Kabwe", amount: 7500, purpose: "Market stall renovation", term: 9, status: "OPEN", creditScore: 640, creditTier: "C", offers: 0, bestRate: null, createdAt: new Date("2026-03-10") },
  { id: "LOAN-005", borrower: "Bwalya Sakala", district: "Chipata", amount: 2000, purpose: "Agricultural supplies", term: 6, status: "COMPLETED", creditScore: 750, creditTier: "B", offers: 4, bestRate: 8.5, createdAt: new Date("2025-09-20") },
  { id: "LOAN-006", borrower: "Victor Zulu", district: "Livingstone", amount: 15000, purpose: "Tourism equipment", term: 18, status: "FUNDED", creditScore: 810, creditTier: "A", offers: 5, bestRate: 7.8, createdAt: new Date("2026-01-28") },
  { id: "LOAN-007", borrower: "Hope Lungu", district: "Solwezi", amount: 4000, purpose: "Poultry farm startup", term: 6, status: "DEFAULTED", creditScore: 420, creditTier: "D", offers: 1, bestRate: 22.0, createdAt: new Date("2025-08-10") },
  { id: "LOAN-008", borrower: "Gift Chanda", district: "Lusaka", amount: 8000, purpose: "Transport vehicle deposit", term: 12, status: "REPAYING", creditScore: 660, creditTier: "B", offers: 2, bestRate: 12.0, createdAt: new Date("2025-12-05") },
];

const totalDisbursed = LOAN_APPS.filter((l) => l.status !== "OPEN").reduce((s, l) => s + l.amount, 0);
const avgRate = LOAN_APPS.filter((l) => l.bestRate).reduce((s, l) => s + (l.bestRate || 0), 0) / LOAN_APPS.filter((l) => l.bestRate).length;

const statusBreakdown = Object.entries(
  LOAN_APPS.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {})
).map(([status, count]) => ({
  status: LOAN_STATUSES[status as keyof typeof LOAN_STATUSES]?.label || status,
  count,
}));

export default function LendingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SME Lending Marketplace</h1>
          <p className="text-muted-foreground">
            Module 4: AI-driven loan matching with dynamic risk pricing
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/lending/lender">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">Lender View</Badge>
          </Link>
          <Link href="/dashboard/lending/simulator">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">Rate Simulator</Badge>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Applications" value={LOAN_APPS.filter((l) => l.status === "OPEN").length} description="Awaiting offers" icon={Clock} />
        <StatCard title="Total Disbursed" value={formatZMW(totalDisbursed)} description={`${LOAN_APPS.length} applications total`} icon={DollarSign} />
        <StatCard title="Avg Interest Rate" value={`${avgRate.toFixed(1)}%`} description="Across funded loans" icon={TrendingUp} />
        <StatCard title="Repayment Rate" value="94.2%" description="On-time payments" icon={CheckCircle} />
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{LOAN_APPS.length} loan applications</p>
            <Button className="gap-2">
              <Landmark className="h-4 w-4" /> New Application
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Credit Score</TableHead>
                    <TableHead>Offers</TableHead>
                    <TableHead>Best Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LOAN_APPS.map((loan) => {
                    const tierInfo = CREDIT_TIERS[loan.creditTier as keyof typeof CREDIT_TIERS];
                    const statusInfo = LOAN_STATUSES[loan.status];
                    return (
                      <TableRow key={loan.id}>
                        <TableCell className="font-mono text-xs">{loan.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{loan.borrower}</p>
                            <p className="text-xs text-muted-foreground">{loan.district}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">{loan.purpose}</TableCell>
                        <TableCell className="text-right font-medium">{formatZMW(loan.amount)}</TableCell>
                        <TableCell className="text-sm">{loan.term}mo</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={`font-medium ${tierInfo?.color || ""}`}>{loan.creditScore}</span>
                            <Badge variant="secondary" className={`text-xs ${tierInfo?.bg || ""} ${tierInfo?.color || ""}`}>
                              {loan.creditTier}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{loan.offers}</TableCell>
                        <TableCell className="text-sm font-medium">
                          {loan.bestRate ? `${loan.bestRate}%` : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${statusInfo?.color || ""}`}>
                            {statusInfo?.label || loan.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application Status</CardTitle>
                <CardDescription>Loan pipeline breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={statusBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dynamic Pricing Formula</CardTitle>
                <CardDescription>How interest rates are calculated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">base_rate = 10%</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="flex justify-between"><span>+ credit_score_adjustment</span><span className="text-muted-foreground">-4% to +8%</span></p>
                    <p className="flex justify-between"><span>+ revenue_trend_adjustment</span><span className="text-muted-foreground">-2% to +3%</span></p>
                    <p className="flex justify-between"><span>+ seasonal_adjustment</span><span className="text-muted-foreground">-1% to +2%</span></p>
                    <p className="flex justify-between"><span>+ sector_risk_adjustment</span><span className="text-muted-foreground">-1% to +3%</span></p>
                    <p className="flex justify-between"><span>+ collateral_adjustment</span><span className="text-muted-foreground">-3% to 0%</span></p>
                    <p className="flex justify-between"><span>+ history_adjustment</span><span className="text-muted-foreground">-2% to 0%</span></p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">final_rate = clamp(sum, 6%, 25%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
