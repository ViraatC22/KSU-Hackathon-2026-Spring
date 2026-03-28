"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/dashboard/stat-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FileText, Upload, CheckCircle, Clock, AlertTriangle, Eye, XCircle,
  Scan, Brain, Zap, ChevronRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
  tesseractConf: number;
  claudeConf: number;
  box: { x: number; y: number; w: number; h: number };
}

interface MockDocument {
  id: string;
  userName: string;
  type: string;
  typeLabel: string;
  status: "PROCESSING" | "VERIFIED" | "REJECTED" | "MANUAL_REVIEW";
  confidence: number | null;
  uploadedAt: Date;
  docNote: string;
  extractedFields: ExtractedField[];
}

const MOCK_DOCUMENTS: MockDocument[] = [
  {
    id: "DOC-001", userName: "Mwila Tembo", type: "NRC", typeLabel: "National Registration Card",
    status: "VERIFIED", confidence: 0.95, uploadedAt: new Date("2025-12-15"),
    docNote: "Printed government ID — high quality scan",
    extractedFields: [
      { field: "Full Name", value: "Mwila Tembo", confidence: 0.98, tesseractConf: 0.94, claudeConf: 0.98, box: { x: 28, y: 22, w: 42, h: 7 } },
      { field: "NRC Number", value: "123456/10/1", confidence: 0.96, tesseractConf: 0.90, claudeConf: 0.96, box: { x: 22, y: 36, w: 38, h: 7 } },
      { field: "Date of Birth", value: "15/05/1990", confidence: 0.94, tesseractConf: 0.88, claudeConf: 0.94, box: { x: 22, y: 50, w: 32, h: 7 } },
      { field: "District", value: "Lusaka", confidence: 0.92, tesseractConf: 0.85, claudeConf: 0.92, box: { x: 28, y: 64, w: 26, h: 7 } },
      { field: "Gender", value: "Female", confidence: 0.99, tesseractConf: 0.97, claudeConf: 0.99, box: { x: 62, y: 64, w: 18, h: 7 } },
    ],
  },
  {
    id: "DOC-002", userName: "Grace Banda", type: "BUSINESS_PERMIT", typeLabel: "Business Permit",
    status: "VERIFIED", confidence: 0.88, uploadedAt: new Date("2025-12-20"),
    docNote: "Lusaka City Council official permit — minor ink smudging",
    extractedFields: [
      { field: "Business Name", value: "Grace's Market Stall", confidence: 0.91, tesseractConf: 0.78, claudeConf: 0.91, box: { x: 20, y: 18, w: 55, h: 8 } },
      { field: "Registration No", value: "BIZ-2024-08821", confidence: 0.85, tesseractConf: 0.72, claudeConf: 0.85, box: { x: 20, y: 35, w: 38, h: 7 } },
      { field: "Business Type", value: "Retail Trade", confidence: 0.88, tesseractConf: 0.80, claudeConf: 0.88, box: { x: 20, y: 52, w: 40, h: 7 } },
      { field: "Expiry Date", value: "31/12/2025", confidence: 0.90, tesseractConf: 0.83, claudeConf: 0.90, box: { x: 20, y: 68, w: 34, h: 7 } },
    ],
  },
  {
    id: "DOC-003", userName: "Joseph Mulenga", type: "NRC", typeLabel: "National Registration Card",
    status: "PROCESSING", confidence: null, uploadedAt: new Date("2026-03-10"),
    docNote: "Just uploaded — Claude Vision pipeline running",
    extractedFields: [],
  },
  {
    id: "DOC-004", userName: "Natasha Phiri", type: "RECEIPT", typeLabel: "Handwritten Receipt",
    status: "MANUAL_REVIEW", confidence: 0.52, uploadedAt: new Date("2026-03-08"),
    docNote: "Handwritten Chibemba — Claude Vision significantly outperforms Tesseract",
    extractedFields: [
      { field: "Amount", value: "K2,500", confidence: 0.65, tesseractConf: 0.31, claudeConf: 0.65, box: { x: 55, y: 18, w: 30, h: 9 } },
      { field: "Date", value: "05/03/2026", confidence: 0.72, tesseractConf: 0.45, claudeConf: 0.72, box: { x: 18, y: 18, w: 30, h: 9 } },
      { field: "Description", value: "Maize supply - 50kg bags x5", confidence: 0.45, tesseractConf: 0.18, claudeConf: 0.45, box: { x: 18, y: 38, w: 65, h: 22 } },
      { field: "Seller", value: "Unclear", confidence: 0.28, tesseractConf: 0.12, claudeConf: 0.28, box: { x: 18, y: 68, w: 42, h: 8 } },
    ],
  },
  {
    id: "DOC-005", userName: "Mwila Tembo", type: "UTILITY_BILL", typeLabel: "Utility Bill",
    status: "VERIFIED", confidence: 0.91, uploadedAt: new Date("2026-02-15"),
    docNote: "ZESCO digital-print bill — high quality",
    extractedFields: [
      { field: "Provider", value: "ZESCO Limited", confidence: 0.98, tesseractConf: 0.96, claudeConf: 0.98, box: { x: 20, y: 12, w: 45, h: 10 } },
      { field: "Account No", value: "04-2847591", confidence: 0.93, tesseractConf: 0.88, claudeConf: 0.93, box: { x: 20, y: 32, w: 35, h: 7 } },
      { field: "Amount Due", value: "K485.00", confidence: 0.95, tesseractConf: 0.91, claudeConf: 0.95, box: { x: 55, y: 54, w: 28, h: 8 } },
      { field: "Due Date", value: "28/02/2026", confidence: 0.90, tesseractConf: 0.84, claudeConf: 0.90, box: { x: 20, y: 54, w: 32, h: 8 } },
    ],
  },
  {
    id: "DOC-006", userName: "Bwalya Chisanga", type: "NRC", typeLabel: "National Registration Card",
    status: "REJECTED", confidence: 0.22, uploadedAt: new Date("2026-03-05"),
    docNote: "Document too blurry — both engines failed",
    extractedFields: [
      { field: "Full Name", value: "Illegible", confidence: 0.15, tesseractConf: 0.08, claudeConf: 0.15, box: { x: 28, y: 22, w: 42, h: 7 } },
      { field: "NRC Number", value: "Partial: ???456/??/1", confidence: 0.20, tesseractConf: 0.10, claudeConf: 0.20, box: { x: 22, y: 36, w: 38, h: 7 } },
    ],
  },
];

const STATUS_CONFIG = {
  PROCESSING: { label: "Processing", textColor: "text-blue-400", borderColor: "border-blue-900", icon: Clock },
  VERIFIED: { label: "Verified", textColor: "text-emerald-400", borderColor: "border-emerald-900", icon: CheckCircle },
  REJECTED: { label: "Rejected", textColor: "text-red-400", borderColor: "border-red-900", icon: XCircle },
  MANUAL_REVIEW: { label: "Manual Review", textColor: "text-yellow-400", borderColor: "border-yellow-900", icon: AlertTriangle },
};

const PIPELINE_STEPS = ["Upload", "Preprocess", "Classify", "Tesseract OCR", "Claude Vision", "Validate"];

function getCompletedSteps(status: string) {
  if (status === "VERIFIED") return 6;
  if (status === "REJECTED") return 5;
  if (status === "MANUAL_REVIEW") return 5;
  return 2;
}

function confColor(c: number) {
  if (c >= 0.8) return "text-emerald-400";
  if (c >= 0.6) return "text-yellow-400";
  return "text-red-400";
}

function confBg(c: number) {
  if (c >= 0.8) return "var(--zambezi-400)";
  if (c >= 0.6) return "#EAB308";
  return "#EF4444";
}

const CHART_STYLE = {
  background: "hsl(20 10% 12%)",
  border: "1px solid hsl(20 8% 22%)",
  borderRadius: "6px",
  fontSize: "11px",
};

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<string>("DOC-001");
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);
  const selected = MOCK_DOCUMENTS.find((d) => d.id === selectedDoc)!;

  const verified = MOCK_DOCUMENTS.filter((d) => d.status === "VERIFIED").length;
  const pending = MOCK_DOCUMENTS.filter((d) => d.status === "PROCESSING" || d.status === "MANUAL_REVIEW").length;
  const avgConf = Math.round(
    MOCK_DOCUMENTS.filter((d) => d.confidence !== null)
      .reduce((s, d) => s + (d.confidence || 0), 0) /
    MOCK_DOCUMENTS.filter((d) => d.confidence !== null).length * 100
  );

  const completedSteps = getCompletedSteps(selected.status);

  // Engine comparison chart data
  const engineData = selected.extractedFields.map((f) => ({
    name: f.field.split(" ")[0],
    Tesseract: Math.round(f.tesseractConf * 100),
    "Claude Vision": Math.round(f.claudeConf * 100),
  }));

  const claudeGain = selected.extractedFields.length > 0
    ? (selected.extractedFields.reduce((s, f) => s + (f.claudeConf - f.tesseractConf), 0) / selected.extractedFields.length * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">AI Document Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Module 7: Dual-engine OCR · Tesseract + Claude Vision · KYC verification & loan documents
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 text-blue-400 border-blue-800">
          <Brain className="h-3 w-3" />
          Claude Vision
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Documents Processed" value={MOCK_DOCUMENTS.length} description="Total uploads" icon={FileText} accentColor="teal" />
        <StatCard title="Verified" value={verified} description="KYC complete" icon={CheckCircle} accentColor="green" />
        <StatCard title="Pending Review" value={pending} description="Needs attention" icon={Clock} accentColor="copper" />
        <StatCard title="Avg Confidence" value={`${avgConf}%`} description="Dual-engine extraction" icon={Eye} accentColor="teal" />
      </div>

      {/* Upload card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Upload className="h-4 w-4" style={{ color: "var(--copper-400)" }} />
            Upload Document
          </CardTitle>
          <CardDescription className="text-xs">NRC, business permit, receipt, or utility bill — processed through dual OCR pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px] space-y-1.5">
              <Label className="text-xs">Document Type</Label>
              <Select defaultValue="NRC">
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NRC">National Registration Card</SelectItem>
                  <SelectItem value="BUSINESS_PERMIT">Business Permit</SelectItem>
                  <SelectItem value="RECEIPT">Receipt / Invoice</SelectItem>
                  <SelectItem value="UTILITY_BILL">Utility Bill</SelectItem>
                  <SelectItem value="BANK_STATEMENT">Bank Statement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <Label className="text-xs">File</Label>
              <Input type="file" accept="image/*,.pdf" className="h-8 text-xs" />
            </div>
            <Button className="h-8 gap-2 text-xs"
              style={{ background: "linear-gradient(135deg, var(--copper-500), var(--copper-700))" }}>
              <Upload className="h-3.5 w-3.5" /> Process Document
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Document list */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Documents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {MOCK_DOCUMENTS.map((doc) => {
                const cfg = STATUS_CONFIG[doc.status];
                const StatusIcon = cfg.icon;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`w-full p-3.5 text-left transition-colors ${selectedDoc === doc.id ? "bg-secondary" : "hover:bg-secondary/50"}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.textColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-sm font-medium truncate">{doc.userName}</p>
                          <Badge variant="outline" className={`text-[9px] px-1 h-4 shrink-0 ${cfg.textColor} ${cfg.borderColor}`}>
                            {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{doc.typeLabel}</p>
                        {doc.confidence !== null && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${doc.confidence * 100}%`, backgroundColor: confBg(doc.confidence) }} />
                            </div>
                            <span className={`text-[10px] font-mono ${confColor(doc.confidence)}`}>{(doc.confidence * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Document detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{selected.typeLabel} — {selected.userName}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {selected.id} · Uploaded {selected.uploadedAt.toLocaleDateString("en-ZM")} · {selected.docNote}
                  </CardDescription>
                </div>
                <Badge variant="outline" className={`${STATUS_CONFIG[selected.status].textColor} ${STATUS_CONFIG[selected.status].borderColor} text-xs`}>
                  {STATUS_CONFIG[selected.status].label}
                </Badge>
              </div>

              {/* Pipeline */}
              <div className="mt-4 flex items-center gap-1 overflow-x-auto">
                {PIPELINE_STEPS.map((step, i) => {
                  const done = i < completedSteps;
                  const active = i === completedSteps - 1;
                  const isClaudeStep = step === "Claude Vision";
                  return (
                    <div key={step} className="flex items-center gap-1 shrink-0">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                        active ? "text-white" :
                        done ? "text-emerald-400 bg-emerald-950/40 border border-emerald-900/60" :
                        "text-muted-foreground bg-secondary/40"
                      }`}
                        style={active ? { background: "linear-gradient(135deg, var(--copper-600), var(--copper-700))" } : {}}
                      >
                        {isClaudeStep && <Brain className="h-2.5 w-2.5" />}
                        {done && !active && <CheckCircle className="h-2.5 w-2.5" />}
                        {step}
                      </div>
                      {i < PIPELINE_STEPS.length - 1 && (
                        <ChevronRight className={`h-3 w-3 shrink-0 ${done ? "text-emerald-400/60" : "text-muted-foreground/40"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardHeader>
          </Card>

          {selected.status === "PROCESSING" ? (
            <Card>
              <CardContent className="py-16 text-center space-y-3">
                <div className="h-12 w-12 rounded-full border-4 border-t-copper-500 border-secondary animate-spin mx-auto"
                  style={{ borderTopColor: "var(--copper-400)" }} />
                <p className="text-sm font-medium">Processing through dual OCR pipeline…</p>
                <p className="text-xs text-muted-foreground">Tesseract OCR → Claude Vision → Field validation</p>
              </CardContent>
            </Card>
          ) : selected.extractedFields.length > 0 ? (
            <>
              {/* Document preview with bounding boxes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Scan className="h-4 w-4 text-blue-400" />
                    Document Preview — Extracted Regions
                  </CardTitle>
                  <CardDescription className="text-xs">Hover over highlighted regions to inspect field extraction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative rounded-lg overflow-hidden border border-white/10"
                    style={{ paddingBottom: "56%", background: "hsl(30 5% 20%)" }}
                  >
                    {/* Document "paper" texture */}
                    <div className="absolute inset-4 rounded bg-[hsl(40_15%_92%)] shadow-inner">
                      {/* Simulated document lines */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute left-4 right-4 h-px bg-[hsl(30_10%_82%)]"
                          style={{ top: `${12 + i * 12}%` }} />
                      ))}
                      {/* Document header block */}
                      <div className="absolute top-2 left-4 right-4 h-8 bg-[hsl(220_30%_35%)] rounded-sm" />
                      <div className="absolute top-3 left-6 text-white text-[8px] font-bold opacity-90">
                        {selected.type === "NRC" ? "REPUBLIC OF ZAMBIA — NATIONAL REGISTRATION CARD" :
                         selected.type === "BUSINESS_PERMIT" ? "LUSAKA CITY COUNCIL — BUSINESS PERMIT" :
                         selected.type === "RECEIPT" ? "RECEIPT / CHITAMBIKO" : "ZESCO LIMITED — STATEMENT OF ACCOUNT"}
                      </div>

                      {/* Bounding boxes */}
                      {selected.extractedFields.map((f) => (
                        <div
                          key={f.field}
                          className="absolute cursor-pointer transition-all duration-150 rounded-sm"
                          style={{
                            left: `${f.box.x}%`,
                            top: `${f.box.y}%`,
                            width: `${f.box.w}%`,
                            height: `${f.box.h}%`,
                            border: `1.5px solid ${confBg(f.confidence)}`,
                            backgroundColor: hoveredBox === f.field
                              ? `${confBg(f.confidence)}33`
                              : `${confBg(f.confidence)}18`,
                          }}
                          onMouseEnter={() => setHoveredBox(f.field)}
                          onMouseLeave={() => setHoveredBox(null)}
                        >
                          {hoveredBox === f.field && (
                            <div className="absolute -top-8 left-0 z-10 bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap border border-white/10">
                              <span className="text-white/60">{f.field}: </span>
                              <span className="font-semibold">{f.value}</span>
                              <span className={`ml-1.5 ${confColor(f.confidence)}`}>{(f.confidence * 100).toFixed(0)}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color legend */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {[
                      { color: "var(--zambezi-400)", label: "High confidence (≥80%)" },
                      { color: "#EAB308", label: "Medium (60–80%)" },
                      { color: "#EF4444", label: "Low (<60%)" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-sm border" style={{ borderColor: item.color, backgroundColor: item.color + "33" }} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Dual engine comparison */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      Dual-Engine Comparison
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Claude Vision gains +{claudeGain}% avg confidence vs Tesseract alone
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={engineData} margin={{ top: 4, right: 4, bottom: 28, left: -12 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(30 8% 55%)" }} angle={-30} textAnchor="end" height={44} />
                        <YAxis tick={{ fontSize: 9, fill: "hsl(30 8% 55%)" }} domain={[0, 100]} />
                        <Tooltip contentStyle={CHART_STYLE} formatter={(v) => [`${v}%`]} />
                        <Bar dataKey="Tesseract" fill="hsl(20 8% 40%)" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="Claude Vision" fill="var(--copper-400)" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 justify-center text-[10px] text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-sm bg-[hsl(20_8%_40%)]" /> Tesseract
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--copper-400)" }} /> Claude Vision
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Extracted Fields</CardTitle>
                    <CardDescription className="text-xs">Field-level confidence with engine breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Field</TableHead>
                          <TableHead className="text-xs">Value</TableHead>
                          <TableHead className="text-xs text-right">Conf.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selected.extractedFields.map((f) => (
                          <TableRow
                            key={f.field}
                            className={`cursor-pointer transition-colors ${hoveredBox === f.field ? "bg-secondary" : ""}`}
                            onMouseEnter={() => setHoveredBox(f.field)}
                            onMouseLeave={() => setHoveredBox(null)}
                          >
                            <TableCell className="text-xs font-medium py-2">{f.field}</TableCell>
                            <TableCell className="text-xs text-muted-foreground py-2 font-mono max-w-[100px] truncate">{f.value}</TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center justify-end gap-2">
                                <div className="h-1.5 w-10 bg-secondary rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${f.confidence * 100}%`, backgroundColor: confBg(f.confidence) }} />
                                </div>
                                <span className={`text-[10px] font-mono w-7 text-right ${confColor(f.confidence)}`}>
                                  {(f.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Review warning */}
              {selected.status === "MANUAL_REVIEW" && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-yellow-900/60 bg-yellow-950/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-yellow-300">Flagged for Manual Review</p>
                    <p className="text-xs text-yellow-400/80 mt-0.5">
                      Overall confidence {((selected.confidence || 0) * 100).toFixed(0)}% is below the 70% auto-verify threshold.
                      A human reviewer must confirm the extracted fields before this document is used for KYC or loan eligibility.
                    </p>
                  </div>
                </div>
              )}

              {selected.status === "REJECTED" && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-red-900/60 bg-red-950/20">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-300">Document Rejected</p>
                    <p className="text-xs text-red-400/80 mt-0.5">
                      Both Tesseract OCR and Claude Vision returned confidence below the minimum threshold (30%).
                      Please re-upload a clearer, well-lit photo of the document.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : null}

          {/* OCR engine info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pipeline Architecture</CardTitle>
              <CardDescription className="text-xs">How Ndalama AI processes Zambian documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    icon: Scan,
                    color: "text-blue-400",
                    name: "Tesseract OCR",
                    desc: "Open-source OCR engine — fast processing for printed text. Works well on typed NRCs and utility bills.",
                    badge: "Engine 1",
                  },
                  {
                    icon: Brain,
                    color: "text-purple-400",
                    name: "Claude Vision",
                    desc: "Claude's multimodal vision understands context. Dramatically better on handwritten Bemba and Nyanja receipts.",
                    badge: "Engine 2",
                  },
                  {
                    icon: Zap,
                    color: "text-yellow-400",
                    name: "Fusion Layer",
                    desc: "Weighted ensemble combines both outputs — Claude Vision weighted higher for low-quality or handwritten docs.",
                    badge: "Confidence",
                  },
                ].map((item) => (
                  <div key={item.name} className="p-3 rounded-lg bg-secondary/40 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-xs font-semibold">{item.name}</span>
                      <Badge variant="outline" className="text-[9px] px-1 h-4 ml-auto">{item.badge}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />
        </div>
      </div>
    </div>
  );
}
