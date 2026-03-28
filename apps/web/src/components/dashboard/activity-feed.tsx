"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  CreditCard, AlertTriangle, Landmark, Users, FileText,
  MessageSquare, ArrowLeftRight, CheckCircle, TrendingUp, Zap,
} from "lucide-react";

export interface FeedEvent {
  id: string;
  type: string;
  source: string;
  summary: string;
  timestamp: Date;
  severity?: "info" | "success" | "warning" | "danger";
  userId?: string;
}

const SEED_EVENTS: FeedEvent[] = [
  { id: "1", type: "CREDIT_SCORE_CALCULATED", source: "credit_scoring", summary: "Credit score updated to 720 (↑12)", timestamp: new Date(Date.now() - 2 * 60000), severity: "success" },
  { id: "2", type: "TRANSACTION_INGESTED", source: "reconciliation", summary: "Transaction of K450 via MTN Money", timestamp: new Date(Date.now() - 3 * 60000), severity: "info" },
  { id: "3", type: "KYC_COMPLETED", source: "document_intel", summary: "Identity ✓ verified — Mwila Tembo", timestamp: new Date(Date.now() - 5 * 60000), severity: "success" },
  { id: "4", type: "CHILIMBA_CONTRIBUTION", source: "chilimba", summary: "Savings contribution of K200 to Lusaka Market Women's Circle", timestamp: new Date(Date.now() - 8 * 60000), severity: "info" },
  { id: "5", type: "LOAN_OFFER_CREATED", source: "lending", summary: "Loan offer: K5,000 at 9.2% from Lupiya Capital", timestamp: new Date(Date.now() - 12 * 60000), severity: "success" },
  { id: "6", type: "FRAUD_DETECTED", source: "reconciliation", summary: "⚠ Fraud alert: Velocity breach — 8 tx/min", timestamp: new Date(Date.now() - 18 * 60000), severity: "danger" },
  { id: "7", type: "DOCUMENT_PROCESSED", source: "document_intel", summary: "NRC processed (confidence: 94%)", timestamp: new Date(Date.now() - 22 * 60000), severity: "info" },
  { id: "8", type: "LOAN_REPAYMENT_RECORDED", source: "lending", summary: "Loan repayment of K830 — on time", timestamp: new Date(Date.now() - 35 * 60000), severity: "success" },
];

const LIVE_EVENTS: Omit<FeedEvent, "id" | "timestamp">[] = [
  { type: "TRANSACTION_INGESTED", source: "reconciliation", summary: "Transaction of K150 via Airtel Money", severity: "info" },
  { type: "CREDIT_SCORE_CALCULATED", source: "credit_scoring", summary: "Credit score updated to 612 (↑8)", severity: "success" },
  { type: "CHILIMBA_CONTRIBUTION", source: "chilimba", summary: "Savings contribution of K500 to Copperbelt Miners' Savings", severity: "info" },
  { type: "FRAUD_DETECTED", source: "reconciliation", summary: "⚠ Fraud alert: Amount anomaly — 15x average", severity: "danger" },
  { type: "LOAN_APPLICATION_CREATED", source: "lending", summary: "Loan application for K7,500 submitted", severity: "info" },
  { type: "KYC_COMPLETED", source: "document_intel", summary: "Identity ✓ verified — Joseph Mulenga", severity: "success" },
  { type: "CHILIMBA_DEFAULT_RISK_ALERT", source: "chilimba", summary: "⚠ Default risk alert for Hope Lungu (21%)", severity: "warning" },
  { type: "TRANSACTION_INGESTED", source: "reconciliation", summary: "Transaction of K2,000 via ZOONA", severity: "info" },
  { type: "CREDIT_SCORE_CALCULATED", source: "credit_scoring", summary: "Credit score updated to 755 (↑15)", severity: "success" },
];

const EVENT_ICONS: Record<string, React.ElementType> = {
  CREDIT_SCORE_CALCULATED: CreditCard,
  BIAS_ALERT_DETECTED: AlertTriangle,
  TRANSACTION_INGESTED: ArrowLeftRight,
  FRAUD_DETECTED: AlertTriangle,
  RECONCILIATION_DISCREPANCY: AlertTriangle,
  FINANCIAL_RECORD_CREATED: TrendingUp,
  LOAN_APPLICATION_CREATED: Landmark,
  LOAN_OFFER_CREATED: Landmark,
  LOAN_FUNDED: Landmark,
  LOAN_REPAYMENT_RECORDED: CheckCircle,
  CHILIMBA_CONTRIBUTION: Users,
  CHILIMBA_DEFAULT_RISK_ALERT: AlertTriangle,
  CHILIMBA_PAYOUT: Users,
  CHILIMBA_CIRCLE_COMPLETED: CheckCircle,
  DOCUMENT_PROCESSED: FileText,
  KYC_COMPLETED: FileText,
};

const MODULE_LABELS: Record<string, string> = {
  credit_scoring: "M1",
  reconciliation: "M2",
  chatbot: "M3",
  lending: "M4",
  heatmap: "M5",
  chilimba: "M6",
  document_intel: "M7",
  system: "SYS",
};

const SEVERITY_STYLES: Record<string, string> = {
  info:    "bg-blue-950/40 border-blue-800/50 text-blue-300",
  success: "bg-emerald-950/40 border-emerald-800/50 text-emerald-300",
  warning: "bg-yellow-950/40 border-yellow-800/50 text-yellow-300",
  danger:  "bg-red-950/40 border-red-800/50 text-red-300",
};

const SEVERITY_ICON_COLORS: Record<string, string> = {
  info:    "text-blue-400",
  success: "text-emerald-400",
  warning: "text-yellow-400",
  danger:  "text-red-400",
};

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

let eventCounter = 100;

interface ActivityFeedProps {
  autoPlay?: boolean;
  maxItems?: number;
  className?: string;
}

export function ActivityFeed({ autoPlay = true, maxItems = 20, className }: ActivityFeedProps) {
  const [events, setEvents] = useState<FeedEvent[]>(SEED_EVENTS);
  const [newEventId, setNewEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!autoPlay) return;
    let idx = 0;
    const interval = setInterval(() => {
      const template = LIVE_EVENTS[idx % LIVE_EVENTS.length];
      const id = String(++eventCounter);
      const newEvent: FeedEvent = {
        ...template,
        id,
        timestamp: new Date(),
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, maxItems));
      setNewEventId(id);
      setTimeout(() => setNewEventId(null), 400);
      idx++;
    }, 3500);
    return () => clearInterval(interval);
  }, [autoPlay, maxItems]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" style={{ color: "var(--copper-400)" }} />
          <span className="text-sm font-semibold">Live Activity Feed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Real-time</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1.5 pr-2">
          {events.map((event) => {
            const Icon = EVENT_ICONS[event.type] || MessageSquare;
            const severity = event.severity || "info";
            const isNew = event.id === newEventId;
            return (
              <div
                key={event.id}
                className={cn(
                  "flex items-start gap-2.5 p-2.5 rounded-lg border text-xs transition-all",
                  SEVERITY_STYLES[severity],
                  isNew && "feed-item-enter"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", SEVERITY_ICON_COLORS[severity])} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium leading-tight truncate">{event.summary}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 opacity-70">
                      {MODULE_LABELS[event.source] || event.source}
                    </Badge>
                    <span className="text-[10px] opacity-60">{timeAgo(event.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// Compact version for sidebar widget
export function ActivityFeedCompact({ triggerFraud }: { triggerFraud?: boolean }) {
  const [, setEvents] = useState<FeedEvent[]>(SEED_EVENTS.slice(0, 5));

  useEffect(() => {
    if (!triggerFraud) return;
    const fraudChain: FeedEvent[] = [
      { id: "f1", type: "TRANSACTION_INGESTED", source: "reconciliation", summary: "Transaction of K12,500 via MTN Money", timestamp: new Date(), severity: "warning" },
      { id: "f2", type: "FRAUD_DETECTED", source: "reconciliation", summary: "⚠ Fraud: Amount anomaly — 28x avg", timestamp: new Date(Date.now() + 500), severity: "danger" },
      { id: "f3", type: "CREDIT_SCORE_CALCULATED", source: "credit_scoring", summary: "Credit score frozen — fraud investigation", timestamp: new Date(Date.now() + 1000), severity: "danger" },
      { id: "f4", type: "LOAN_APPLICATION_CREATED", source: "lending", summary: "Loan application paused — fraud flag active", timestamp: new Date(Date.now() + 1500), severity: "warning" },
    ];
    let delay = 0;
    fraudChain.forEach((e) => {
      setTimeout(() => setEvents((prev) => [e, ...prev].slice(0, 10)), delay);
      delay += 600;
    });
  }, [triggerFraud]);

  return <ActivityFeed autoPlay={false} maxItems={10} />;
}
