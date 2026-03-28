"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatZMW } from "@/lib/utils/zambia-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowLeft, Calculator, TrendingDown, TrendingUp, Info } from "lucide-react";
import Link from "next/link";

// ─── Rate Calculator (TypeScript port from UPGRADE1.md) ─────────────────────
interface RateInput {
  creditScore: number;
  revenueGrowthRate: number;
  accountAgeDays: number;
  chilimbaReliabilityScore: number;
  chilimbaCirclesCompleted: number;
  sector: string;
  season: string;
  isRepeatBorrower: boolean;
  requestedAmount: number;
  requestedTermMonths: number;
}

interface RateOutput {
  baseRate: number;
  creditScoreAdjustment: number;
  revenueAdjustment: number;
  accountAgeAdjustment: number;
  chilimbaAdjustment: number;
  sectorAdjustment: number;
  seasonalAdjustment: number;
  repeatBorrowerAdjustment: number;
  amountRiskAdjustment: number;
  termAdjustment: number;
  finalRate: number;
  monthlyPayment: number;
  totalRepayment: number;
}

function calculateRate(input: RateInput): RateOutput {
  const BASE_RATE = 15;

  let creditAdj = 0;
  if (input.creditScore >= 800) creditAdj = -5.0;
  else if (input.creditScore >= 700) creditAdj = -3.5;
  else if (input.creditScore >= 600) creditAdj = -1.5;
  else if (input.creditScore >= 500) creditAdj = 0;
  else if (input.creditScore >= 400) creditAdj = 2.5;
  else creditAdj = 5.0;

  let revenueAdj = 0;
  if (input.revenueGrowthRate > 0.2) revenueAdj = -1.5;
  else if (input.revenueGrowthRate > 0.05) revenueAdj = -0.5;
  else if (input.revenueGrowthRate < -0.1) revenueAdj = 1.5;

  let ageAdj = 0;
  if (input.accountAgeDays > 365) ageAdj = -2.0;
  else if (input.accountAgeDays > 180) ageAdj = -1.0;
  else if (input.accountAgeDays < 60) ageAdj = 2.0;

  let chilimbaAdj = 0;
  if (input.chilimbaReliabilityScore > 0.9 && input.chilimbaCirclesCompleted >= 1) {
    chilimbaAdj = -2.5;
  } else if (input.chilimbaReliabilityScore > 0.7) {
    chilimbaAdj = -1.2;
  }

  const sectorMap: Record<string, number> = { market_trading: 0, agriculture: 1.5, services: -0.5, transport: 1.0, other: 0.5 };
  const sectorAdj = sectorMap[input.sector] || 0;

  const seasonMap: Record<string, number> = { harvest: -1.0, dry: 0, planting: 1.5, rainy: 0.5 };
  const seasonAdj = seasonMap[input.season] || 0;

  const repeatAdj = input.isRepeatBorrower ? -2.0 : 0;

  let amountAdj = 0;
  if (input.requestedAmount > 20000) amountAdj = 1.5;
  else if (input.requestedAmount > 10000) amountAdj = 0.5;

  let termAdj = 0;
  if (input.requestedTermMonths > 12) termAdj = 1.0;
  else if (input.requestedTermMonths > 6) termAdj = 0.5;

  const rawRate = BASE_RATE + creditAdj + revenueAdj + ageAdj + chilimbaAdj + sectorAdj + seasonAdj + repeatAdj + amountAdj + termAdj;
  const finalRate = Math.max(6.0, Math.min(35.0, rawRate));

  const monthlyRate = finalRate / 100 / 12;
  const monthlyPayment = input.requestedAmount * (monthlyRate * Math.pow(1 + monthlyRate, input.requestedTermMonths)) / (Math.pow(1 + monthlyRate, input.requestedTermMonths) - 1);
  const totalRepayment = monthlyPayment * input.requestedTermMonths;

  return {
    baseRate: BASE_RATE,
    creditScoreAdjustment: creditAdj,
    revenueAdjustment: revenueAdj,
    accountAgeAdjustment: ageAdj,
    chilimbaAdjustment: chilimbaAdj,
    sectorAdjustment: sectorAdj,
    seasonalAdjustment: seasonAdj,
    repeatBorrowerAdjustment: repeatAdj,
    amountRiskAdjustment: amountAdj,
    termAdjustment: termAdj,
    finalRate: Math.round(finalRate * 10) / 10,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
  };
}

function SliderField({ label, min, max, value, onChange, step = 1, format }: {
  label: string; min: number; max: number; value: number;
  onChange: (v: number) => void; step?: number; format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="text-sm font-mono font-bold" style={{ color: "var(--copper-400)" }}>
          {format ? format(value) : value}
        </span>
      </div>
      <div className="relative h-2 bg-secondary rounded-full">
        <div className="absolute h-full rounded-full transition-all duration-150"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--copper-700), var(--copper-400))" }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
        <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-card shadow-sm transition-all duration-150"
          style={{ left: `calc(${pct}% - 8px)`, backgroundColor: "var(--copper-400)" }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

const SECTOR_OPTIONS = [
  { value: "market_trading", label: "Market Trading" },
  { value: "agriculture", label: "Agriculture" },
  { value: "services", label: "Services" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Other" },
];

const SEASON_OPTIONS = [
  { value: "dry", label: "Dry Season" },
  { value: "rainy", label: "Rainy Season" },
  { value: "harvest", label: "Harvest Season" },
  { value: "planting", label: "Planting Season" },
];

export default function RateSimulatorPage() {
  const [creditScore, setCreditScore] = useState(720);
  const [amount, setAmount] = useState(5000);
  const [term, setTerm] = useState(6);
  const [chilimbaScore, setChilimbaScore] = useState(0.85);
  const [chilimbaCompleted, setChilimbaCompleted] = useState(1);
  const [accountAge, setAccountAge] = useState(270);
  const [revenueGrowth, setRevenueGrowth] = useState(0.12);
  const [sector, setSector] = useState("market_trading");
  const [season, setSeason] = useState("dry");
  const [isRepeat, setIsRepeat] = useState(false);

  const result = useMemo(() => calculateRate({
    creditScore, requestedAmount: amount, requestedTermMonths: term,
    chilimbaReliabilityScore: chilimbaScore, chilimbaCirclesCompleted: chilimbaCompleted,
    accountAgeDays: accountAge, revenueGrowthRate: revenueGrowth,
    sector, season, isRepeatBorrower: isRepeat,
  }), [creditScore, amount, term, chilimbaScore, chilimbaCompleted, accountAge, revenueGrowth, sector, season, isRepeat]);

  const adjustments = [
    { label: "Base Rate", value: result.baseRate, isBase: true },
    { label: "Credit Score", value: result.creditScoreAdjustment },
    { label: "Revenue Trend", value: result.revenueAdjustment },
    { label: "Account Age", value: result.accountAgeAdjustment },
    { label: "Chilimba Backing", value: result.chilimbaAdjustment },
    { label: "Sector Risk", value: result.sectorAdjustment },
    { label: "Seasonal Risk", value: result.seasonalAdjustment },
    { label: "Repeat Borrower", value: result.repeatBorrowerAdjustment },
    { label: "Amount Risk", value: result.amountRiskAdjustment },
    { label: "Term Risk", value: result.termAdjustment },
  ].filter((a) => a.isBase || a.value !== 0);

  const chartData = adjustments.map((a) => ({
    name: a.label,
    value: a.value,
    fill: a.isBase ? "hsl(30 8% 35%)" : a.value < 0 ? "#3aba72" : a.value > 0 ? "#d94545" : "hsl(30 8% 35%)",
  }));

  const rateColor = result.finalRate <= 10 ? "#3aba72" : result.finalRate <= 15 ? "#e4a832" : result.finalRate <= 20 ? "#e47d3c" : "#d94545";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/lending">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Loan Rate Simulator</h1>
          <p className="text-muted-foreground text-sm">
            Module 4: Dynamic risk pricing — every factor is transparent
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Final Interest Rate" value={`${result.finalRate}%`} description="Annual percentage rate" icon={Calculator} accentColor="copper" />
        <StatCard title="Monthly Payment" value={formatZMW(result.monthlyPayment)} description={`Over ${term} months`} icon={TrendingDown} accentColor="teal" />
        <StatCard title="Total Repayment" value={formatZMW(result.totalRepayment)} description={`Cost of credit: ${formatZMW(result.totalRepayment - amount)}`} icon={TrendingUp} accentColor={result.finalRate > 20 ? "red" : "green"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sliders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Loan Parameters</CardTitle>
            <CardDescription>Drag sliders to see how each factor changes the rate in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <SliderField label="Credit Score" min={200} max={1000} value={creditScore} onChange={setCreditScore} />
            <SliderField label="Loan Amount (ZMW)" min={500} max={50000} step={500} value={amount} onChange={setAmount} format={(v) => `K${v.toLocaleString()}`} />
            <SliderField label="Loan Term" min={1} max={24} value={term} onChange={setTerm} format={(v) => `${v} months`} />
            <SliderField label="Chilimba Reliability Score" min={0} max={1} step={0.05} value={chilimbaScore} onChange={setChilimbaScore} format={(v) => `${(v * 100).toFixed(0)}%`} />
            <SliderField label="Chilimba Circles Completed" min={0} max={5} value={chilimbaCompleted} onChange={setChilimbaCompleted} />
            <SliderField label="Account Age (days)" min={30} max={730} step={30} value={accountAge} onChange={setAccountAge} format={(v) => `${Math.round(v / 30)} months`} />
            <SliderField label="Revenue Growth Rate" min={-0.3} max={0.5} step={0.05} value={revenueGrowth} onChange={setRevenueGrowth} format={(v) => `${(v * 100).toFixed(0)}%`} />

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Sector</label>
                <select value={sector} onChange={(e) => setSector(e.target.value)}
                  className="w-full rounded-lg border bg-input px-3 py-2 text-sm">
                  {SECTOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Season</label>
                <select value={season} onChange={(e) => setSeason(e.target.value)}
                  className="w-full rounded-lg border bg-input px-3 py-2 text-sm">
                  {SEASON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="repeat" checked={isRepeat} onChange={(e) => setIsRepeat(e.target.checked)} className="rounded" />
              <label htmlFor="repeat" className="text-sm">Repeat borrower (loyalty discount)</label>
              {isRepeat && <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-800">-2.0%</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Rate Breakdown */}
        <div className="space-y-4">
          {/* Big rate display */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Final Annual Rate</p>
                  <p className="text-6xl font-bold font-mono mt-1 leading-none" style={{ color: rateColor }}>
                    {result.finalRate}<span className="text-2xl">%</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Base 15% {result.finalRate < 15 ? `→ ${(15 - result.finalRate).toFixed(1)}% below market` : `→ ${(result.finalRate - 15).toFixed(1)}% above market`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Monthly payment</p>
                  <p className="text-2xl font-bold font-mono" style={{ color: "var(--copper-400)" }}>{formatZMW(result.monthlyPayment)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total: {formatZMW(result.totalRepayment)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adjustment breakdown chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Rate Factor Breakdown</CardTitle>
              <CardDescription>How each factor adjusts from the 15% base rate</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(20 8% 18%)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(30 8% 50%)" }} tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(30 8% 58%)" }} width={110} />
                  <Tooltip contentStyle={{ background: "hsl(20 10% 12%)", border: "1px solid hsl(20 8% 22%)", borderRadius: "8px", fontSize: "12px" }} formatter={(v) => { const n = Number(v); return [`${n > 0 ? "+" : ""}${n}%`, "Adjustment"]; }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Chilimba insight */}
          {result.chilimbaAdjustment < 0 && (
            <Card className="border" style={{ borderColor: "var(--zambezi-600)" }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "var(--zambezi-600)" }}>
                    <Info className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--zambezi-400)" }}>
                      Chilimba Discount Applied: {result.chilimbaAdjustment}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Proven savings discipline through Chilimba circles reduces lender risk. This is Ndalama AI&apos;s
                      key differentiator — no other platform uses savings circle behavior as a credit signal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
