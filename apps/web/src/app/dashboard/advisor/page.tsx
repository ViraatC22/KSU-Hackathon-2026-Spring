"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/dashboard/stat-card";
import { Send, Bot, User, TrendingUp, BarChart3, Loader2, Zap, MessageSquare } from "lucide-react";
import { formatZMW } from "@/lib/utils/zambia-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  timestamp: Date;
  isLoading?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1, role: "assistant", intent: "greeting",
    content: "Mwibukisheni! Welcome to Ndalama AI — I'm your personal financial advisor.\n\nI can help you:\n• Record sales and expenses (just tell me naturally)\n• Check your credit score and how to improve it\n• Find loan offers based on your profile\n• Track your Chilimba savings circle\n• Forecast your cash flow\n\nHow can I help today?",
    timestamp: new Date(Date.now() - 60000),
  },
];

const QUICK_ACTIONS = [
  { label: "I sold...", prompt: "I sold 3 bags of charcoal for K150" },
  { label: "Monthly summary", prompt: "How much did I make this month?" },
  { label: "Credit score", prompt: "What's my credit score and how can I improve it?" },
  { label: "Loan options", prompt: "I need K5,000 for a chest freezer. Can I get a loan?" },
  { label: "Cash flow forecast", prompt: "Generate my 30-day cash flow forecast" },
  { label: "Record expense", prompt: "I paid K200 for transport to the market" },
  { label: "Savings circle", prompt: "What's the status of my Chilimba circle?" },
];

const FINANCIAL_SUMMARY = {
  monthlyRevenue: 8450, monthlyExpenses: 3200, netProfit: 5250, creditScore: 720, tier: "B",
  categories: [
    { name: "Charcoal Sales", amount: 4800, type: "revenue" },
    { name: "Vegetable Sales", amount: 2100, type: "revenue" },
    { name: "Other Revenue", amount: 1550, type: "revenue" },
    { name: "Transport", amount: 1400, type: "expense" },
    { name: "Stock Purchase", amount: 1200, type: "expense" },
    { name: "Market Fees", amount: 600, type: "expense" },
  ],
};

const INTENT_COLORS: Record<string, string> = {
  financial_record: "text-emerald-400 border-emerald-800",
  credit_inquiry: "text-orange-400 border-orange-800",
  loan_inquiry: "text-blue-400 border-blue-800",
  forecast: "text-purple-400 border-purple-800",
  financial_summary: "text-teal-400 border-teal-800",
  greeting: "text-yellow-400 border-yellow-800",
};

const INTENT_LABELS: Record<string, string> = {
  financial_record: "Transaction logged",
  credit_inquiry: "Credit score",
  loan_inquiry: "Loan check",
  forecast: "Forecast",
  financial_summary: "Summary",
  greeting: "Welcome",
};

let messageIdCounter = 10;

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setInput("");

    const userMsg: Message = {
      id: ++messageIdCounter, role: "user", content: msg, timestamp: new Date(),
    };
    const loadingMsg: Message = {
      id: ++messageIdCounter, role: "assistant", content: "", timestamp: new Date(), isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: conversationHistory.slice(-10), // Last 10 turns for context
        }),
      });

      const data = await res.json();

      const newHistory = [
        ...conversationHistory,
        { role: "user", content: msg },
        { role: "assistant", content: data.content },
      ];
      setConversationHistory(newHistory.slice(-20));

      setMessages((prev) =>
        prev.map((m) =>
          m.isLoading
            ? { ...m, content: data.content, intent: data.intent, isLoading: false }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.isLoading
            ? { ...m, content: "Sorry, I'm having trouble connecting. Please try again.", isLoading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const revenueData = FINANCIAL_SUMMARY.categories
    .filter((c) => c.type === "revenue")
    .map((c) => ({ name: c.name.replace(" Sales", ""), value: c.amount }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">AI Financial Advisor</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Module 3: Claude AI with tool use · Natural language · English, Bemba, Nyanja
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 text-emerald-400 border-emerald-800">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Claude claude-sonnet-4-6
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Monthly Revenue" value={formatZMW(FINANCIAL_SUMMARY.monthlyRevenue)} description="March 2026" icon={TrendingUp} accentColor="green" trend={{ value: 8, label: "vs last month" }} />
        <StatCard title="Net Profit" value={formatZMW(FINANCIAL_SUMMARY.netProfit)} description="62% margin" icon={BarChart3} accentColor="copper" />
        <StatCard title="Credit Score" value={FINANCIAL_SUMMARY.creditScore} description={`Tier ${FINANCIAL_SUMMARY.tier} — Good`} icon={Zap} accentColor="teal" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chat Interface */}
        <Card className="lg:col-span-2 flex flex-col" style={{ height: "620px" }}>
          <CardHeader className="pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full flex items-center justify-center logo-glow"
                style={{ background: "linear-gradient(135deg, var(--copper-500), var(--copper-700))" }}>
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">Ndalama AI Advisor</CardTitle>
                <CardDescription className="text-xs">Powered by Claude · Tool use enabled</CardDescription>
              </div>
              <MessageSquare className="ml-auto h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>

          <Separator />

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, var(--copper-600), var(--copper-800))" }}>
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={`rounded-xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "text-white rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                      style={msg.role === "user" ? { background: "linear-gradient(135deg, var(--copper-600), var(--copper-700))" } : {}}>
                      {msg.isLoading ? (
                        <div className="flex items-center gap-2 py-0.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin opacity-70" />
                          <span className="text-xs opacity-70">Analyzing your finances...</span>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                    <div className={`flex items-center gap-1.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString("en-ZM", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {msg.intent && msg.intent !== "general" && INTENT_LABELS[msg.intent] && (
                        <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3.5 ${INTENT_COLORS[msg.intent] || ""}`}>
                          {INTENT_LABELS[msg.intent]}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* Quick Actions */}
          <div className="px-4 py-2 flex gap-1.5 overflow-x-auto shrink-0">
            {QUICK_ACTIONS.map((action) => (
              <Button key={action.label} variant="outline" size="sm"
                className="text-xs shrink-0 h-7 px-2.5" onClick={() => handleSend(action.prompt)} disabled={isLoading}>
                {action.label}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 pt-2 shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input
                placeholder="e.g. 'I sold 3 bags charcoal for K150' or 'Can I get a loan?'"
                value={input} onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-sm" disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}
                style={{ background: "linear-gradient(135deg, var(--copper-500), var(--copper-700))" }}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Revenue Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" style={{ color: "var(--copper-400)" }} />
                Revenue by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={revenueData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(30 8% 55%)" }} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(30 8% 55%)" }} />
                  <Tooltip contentStyle={{ background: "hsl(20 10% 12%)", border: "1px solid hsl(20 8% 22%)", borderRadius: "6px", fontSize: "11px" }} formatter={(v) => [`K${Number(v).toLocaleString()}`, ""]} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {revenueData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "var(--copper-500)" : i === 1 ? "var(--zambezi-400)" : "hsl(30 8% 35%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="space-y-1.5 mt-3 pt-3 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-mono text-emerald-400">{formatZMW(FINANCIAL_SUMMARY.monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Expenses</span>
                  <span className="font-mono text-red-400">{formatZMW(FINANCIAL_SUMMARY.monthlyExpenses)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xs font-bold">
                  <span>Net Profit</span>
                  <span className="font-mono" style={{ color: "var(--zambezi-400)" }}>{formatZMW(FINANCIAL_SUMMARY.netProfit)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">AI Capabilities</CardTitle>
              <CardDescription className="text-xs">Claude with structured tool use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Natural language transaction logging",
                  "Auto-categorization & entity extraction",
                  "30-day cash flow forecasting",
                  "Smart restock & timing alerts",
                  "Loan-ready financial reports",
                  "Chilimba circle tracking",
                  "Multi-language (English, Bemba, Nyanja)",
                ].map((cap) => (
                  <div key={cap} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: "var(--zambezi-400)" }} />
                    {cap}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
