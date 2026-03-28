"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import Link from "next/link";

const DEMOGRAPHIC_PARITY = [
  { group: "Female", avgScore: 618, count: 248, approvalRate: 0.64 },
  { group: "Male", avgScore: 605, count: 252, approvalRate: 0.61 },
];

const REGIONAL_FAIRNESS = [
  { region: "Lusaka", avgScore: 645, count: 95, approvalRate: 0.72 },
  { region: "Copperbelt", avgScore: 622, count: 82, approvalRate: 0.66 },
  { region: "Southern", avgScore: 598, count: 58, approvalRate: 0.59 },
  { region: "Eastern", avgScore: 585, count: 52, approvalRate: 0.55 },
  { region: "Northern", avgScore: 570, count: 45, approvalRate: 0.52 },
  { region: "Central", avgScore: 592, count: 40, approvalRate: 0.57 },
  { region: "Luapula", avgScore: 565, count: 35, approvalRate: 0.50 },
  { region: "Western", avgScore: 555, count: 30, approvalRate: 0.48 },
  { region: "North-Western", avgScore: 548, count: 33, approvalRate: 0.46 },
  { region: "Muchinga", avgScore: 540, count: 30, approvalRate: 0.44 },
];

const AGE_FAIRNESS = [
  { group: "18-25", avgScore: 520, count: 85, approvalRate: 0.45 },
  { group: "26-35", avgScore: 615, count: 155, approvalRate: 0.63 },
  { group: "36-45", avgScore: 650, count: 130, approvalRate: 0.70 },
  { group: "46-55", avgScore: 630, count: 80, approvalRate: 0.67 },
  { group: "56+", avgScore: 590, count: 50, approvalRate: 0.58 },
];

const FAIRNESS_METRICS = [
  { metric: "Demographic Parity (Gender)", value: 0.95, threshold: 0.80, status: "pass" },
  { metric: "Equalized Odds (Gender)", value: 0.92, threshold: 0.80, status: "pass" },
  { metric: "Demographic Parity (Region)", value: 0.61, threshold: 0.80, status: "warning" },
  { metric: "Equalized Odds (Region)", value: 0.68, threshold: 0.80, status: "warning" },
  { metric: "Demographic Parity (Age)", value: 0.72, threshold: 0.80, status: "warning" },
  { metric: "Calibration (Overall)", value: 0.89, threshold: 0.80, status: "pass" },
];

export default function BiasAuditPage() {
  const passCount = FAIRNESS_METRICS.filter((m) => m.status === "pass").length;
  const warnCount = FAIRNESS_METRICS.filter((m) => m.status === "warning").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fairness & Bias Audit</h1>
          <p className="text-muted-foreground">
            Module 1: Monitoring AI credit scoring for fairness across gender, region & age
          </p>
        </div>
        <Link href="/dashboard/credit-score">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">Back to Scores</Badge>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checks Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{passCount}/{FAIRNESS_METRICS.length}</div>
            <p className="text-xs text-muted-foreground">Above 80% threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warnCount}</div>
            <p className="text-xs text-muted-foreground">Regional & age disparities detected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Fairness</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Moderate</div>
            <p className="text-xs text-muted-foreground">Gender fair, regional bias present</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fairness Metrics</CardTitle>
          <CardDescription>Automated checks against 80% demographic parity threshold</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FAIRNESS_METRICS.map((m) => (
                <TableRow key={m.metric}>
                  <TableCell className="font-medium">{m.metric}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={m.value * 100} className="h-2 w-20" />
                      <span className="text-sm">{(m.value * 100).toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{(m.threshold * 100).toFixed(0)}%</TableCell>
                  <TableCell>
                    {m.status === "pass" ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Pass</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gender Parity</CardTitle>
            <CardDescription>Average credit score by gender</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DEMOGRAPHIC_PARITY} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 800]} />
                <YAxis type="category" dataKey="group" width={60} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {DEMOGRAPHIC_PARITY.map((d) => (
                <div key={d.group} className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{(d.approvalRate * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">{d.group} Approval Rate</div>
                  <div className="text-xs text-muted-foreground">{d.count} users</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Age Group Analysis</CardTitle>
            <CardDescription>Score distribution across age brackets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={AGE_FAIRNESS}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis domain={[0, 800]} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-xs text-muted-foreground">
              18-25 age group shows lower scores due to shorter transaction history, not age bias.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Regional Fairness Analysis</CardTitle>
            <CardDescription>Average credit scores and approval rates by province</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={REGIONAL_FAIRNESS}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis yAxisId="left" domain={[0, 800]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 1]} tickFormatter={(v) => `${(Number(v) * 100).toFixed(0)}%`} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="avgScore" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Avg Score" />
                <Bar yAxisId="right" dataKey="approvalRate" fill="#10B981" radius={[4, 4, 0, 0]} name="Approval Rate" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Regional Disparity Detected</p>
                  <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                    Urban provinces (Lusaka, Copperbelt) score 15-20% higher than rural provinces.
                    This correlates with higher transaction volumes and platform availability in urban areas.
                    Recommendation: weight mobile coverage as a control variable to reduce geographic bias.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
