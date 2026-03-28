"use client";

import { useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeftRight, CreditCard, Landmark, Users, FileText,
  Map, MessageSquare, TrendingUp, Zap, AlertTriangle, Shield,
} from "lucide-react";

const modules = [
  { number: 2, title: "Transactions", description: "Cross-platform reconciliation & real-time fraud detection", href: "/dashboard/transactions", icon: ArrowLeftRight, color: "text-blue-400", bg: "bg-blue-950/30" },
  { number: 1, title: "Credit Score", description: "AI credit scoring with SHAP explainability & fairness audit", href: "/dashboard/credit-score", icon: CreditCard, color: "text-orange-400", bg: "bg-orange-950/30" },
  { number: 7, title: "Documents", description: "AI document processor for KYC & loan applications", href: "/dashboard/documents", icon: FileText, color: "text-purple-400", bg: "bg-purple-950/30" },
  { number: 4, title: "Lending", description: "SME lending marketplace with dynamic risk pricing", href: "/dashboard/lending", icon: Landmark, color: "text-yellow-400", bg: "bg-yellow-950/30" },
  { number: 6, title: "Chilimba", description: "Digital savings circles with AI group management", href: "/dashboard/chilimba", icon: Users, color: "text-pink-400", bg: "bg-pink-950/30" },
  { number: 3, title: "AI Advisor", description: "Claude-powered conversational financial advisor", href: "/dashboard/advisor", icon: MessageSquare, color: "text-teal-400", bg: "bg-teal-950/30" },
  { number: 5, title: "Heatmap", description: "Predictive financial inclusion geospatial map", href: "/dashboard/heatmap", icon: Map, color: "text-red-400", bg: "bg-red-950/30" },
];

const keyMetrics = [
  { label: "Users Scored", value: "500", sub: "Across 10 provinces" },
  { label: "Avg Credit Score", value: "612", sub: "Tier C — improving" },
  { label: "Model AUC-ROC", value: "0.87", sub: "Ensemble accuracy" },
  { label: "Bias Gap (Gender)", value: "4.1%", sub: "Within fair threshold" },
];

export default function DashboardPage() {
  const [fraudTriggered, setFraudTriggered] = useState(false);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">
            <span className="text-gradient-copper">Ndalama AI</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Financial Inclusion Platform for Zambia · 7 million unbanked. No longer invisible.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="destructive"
            className="gap-2 text-xs"
            onClick={() => setFraudTriggered(!fraudTriggered)}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Simulate Fraud
          </Button>
          <Badge variant="outline" className="gap-1.5 text-emerald-400 border-emerald-800">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems live
          </Badge>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="500"
          description="Across all 10 provinces"
          icon={Users}
          accentColor="copper"
          trend={{ value: 12, label: "from last month" }}
        />
        <StatCard
          title="Transaction Volume"
          value="K2.4M"
          description="50,000 unified transactions"
          icon={ArrowLeftRight}
          accentColor="teal"
          trend={{ value: 8.2, label: "from last month" }}
        />
        <StatCard
          title="Avg Credit Score"
          value="612"
          description="Tier C — Fair"
          icon={TrendingUp}
          accentColor="copper"
          trend={{ value: 3.1, label: "from last month" }}
        />
        <StatCard
          title="Active Loans"
          value="47"
          description="K890,000 total disbursed"
          icon={Landmark}
          accentColor="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Modules Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Platform Modules</h2>
            <Badge variant="outline" className="text-xs gap-1">
              <Zap className="h-3 w-3" style={{ color: "var(--copper-400)" }} />
              Event-Driven Architecture
            </Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {modules.map((mod) => (
              <Link key={mod.href} href={mod.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full module-card card-hover">
                  <CardHeader className="flex flex-row items-start gap-3 p-4">
                    <div className={`rounded-lg p-2 ${mod.bg} shrink-0`}>
                      <mod.icon className={`h-4 w-4 ${mod.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm flex items-center gap-2">
                        Module {mod.number}: {mod.title}
                        <Badge variant="outline" className="text-[10px] px-1 py-0 ml-auto opacity-60">M{mod.number}</Badge>
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs leading-relaxed">
                        {mod.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* ML Metrics Row */}
          <div>
            <h2 className="text-lg font-semibold mb-3">AI/ML Engine Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {keyMetrics.map((m) => (
                <Card key={m.label} className="p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{m.label}</p>
                  <p className="text-xl font-bold stat-number mt-1" style={{ color: "var(--copper-400)" }}>{m.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{m.sub}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Architecture Note */}
          <Card className="border-dashed" style={{ borderColor: "var(--copper-800)" }}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--copper-400)" }} />
                <div>
                  <p className="text-sm font-medium">Event-Driven Integration Layer</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    All 7 modules share a unified event bus. A transaction in Module 2 triggers fraud detection,
                    which can freeze credit scoring in Module 1 and pause loans in Module 4 — all in under 200ms.
                    Watch the activity feed to see cross-module reactions in real-time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card className="h-full" style={{ minHeight: "580px" }}>
            <CardContent className="p-4 h-full flex flex-col">
              <ActivityFeed autoPlay={true} maxItems={25} className="flex-1" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
