import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Simulated user financial data (in production, fetched from DB per userId)
const USER_FINANCIAL_DATA = {
  monthlyRevenue: 8450,
  monthlyExpenses: 3200,
  netProfit: 5250,
  creditScore: 720,
  creditTier: "B",
  transactions: 247,
  platform: "MTN Money + Airtel Money",
  chilimbaCircles: 1,
  chilimbaReliability: 0.95,
  accountAgeDays: 270,
  topRevenue: [
    { category: "Charcoal Sales", amount: 4800 },
    { category: "Vegetable Sales", amount: 2100 },
    { category: "Other", amount: 1550 },
  ],
  topExpenses: [
    { category: "Transport", amount: 1400 },
    { category: "Stock Purchase", amount: 1200 },
    { category: "Market Fees", amount: 600 },
  ],
  loanEligibility: {
    maxAmount: 5000,
    rateRange: "8-12%",
    currentOffers: [
      { lender: "Lupiya Capital", amount: 5000, rate: 9.2, term: 6 },
      { lender: "ZamFund", amount: 3500, rate: 10.5, term: 3 },
    ],
  },
  savingsCircle: {
    name: "Lusaka Market Women's Circle",
    contribution: 200,
    frequency: "weekly",
    currentRound: 8,
    totalRounds: 12,
  },
};

const tools: Anthropic.Tool[] = [
  {
    name: "log_transaction",
    description: "Record a financial transaction (sale, purchase, expense) mentioned by the user. Use this whenever the user mentions selling something, buying something, or paying for something.",
    input_schema: {
      type: "object" as const,
      properties: {
        type: { type: "string", enum: ["revenue", "expense", "cogs"], description: "Type of transaction" },
        category: { type: "string", description: "Business category like 'charcoal_sales', 'transport', 'rent', 'vegetable_sales'" },
        amount: { type: "number", description: "Amount in ZMW (kwacha). 'pin' = ZMW. Convert 'K150' or '150 kwacha' to 150." },
        quantity: { type: "number", description: "Number of items if mentioned" },
        unit: { type: "string", description: "Unit if mentioned (bags, crates, kg, litres)" },
        description: { type: "string", description: "Brief description of the transaction" },
      },
      required: ["type", "category", "amount"],
    },
  },
  {
    name: "get_financial_summary",
    description: "Get the user's financial summary for a time period. Use when asked about earnings, profit, income, or spending.",
    input_schema: {
      type: "object" as const,
      properties: {
        period: { type: "string", enum: ["today", "this_week", "this_month", "last_month"], description: "Time period" },
      },
      required: ["period"],
    },
  },
  {
    name: "check_credit_score",
    description: "Check the user's Ndalama credit score and the factors that affect it.",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "check_loan_eligibility",
    description: "Check what loans the user qualifies for and at what rates.",
    input_schema: {
      type: "object" as const,
      properties: {
        desired_amount: { type: "number", description: "How much they want to borrow" },
        purpose: { type: "string", description: "What they want the loan for" },
      },
    },
  },
  {
    name: "get_savings_circle_status",
    description: "Get the status of the user's Chilimba savings circles.",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "generate_cash_flow_forecast",
    description: "Generate a 30-day cash flow forecast based on recent patterns.",
    input_schema: { type: "object" as const, properties: {} },
  },
];

function executeTool(name: string, input: Record<string, unknown>): string {
  const d = USER_FINANCIAL_DATA;
  switch (name) {
    case "log_transaction": {
      const { type, category, amount, quantity, unit } = input as {
        type: string; category: string; amount: number; quantity?: number; unit?: string;
      };
      const runningTotal = type === "revenue" ? d.monthlyRevenue + amount : d.monthlyExpenses + amount;
      const catLabel = (category as string).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const qtyStr = quantity ? ` (${quantity}${unit ? " " + unit : ""})` : "";
      return JSON.stringify({
        success: true,
        recorded: { type, category, amount, quantity, unit },
        confirmation: `Recorded: K${amount} ${type} — ${catLabel}${qtyStr}`,
        running_monthly_total: runningTotal,
        insight: type === "revenue"
          ? `Monthly ${type} now K${runningTotal.toLocaleString()}. At this rate, projected month-end: K${Math.round(runningTotal * 30 / new Date().getDate()).toLocaleString()}.`
          : `Monthly expenses now K${runningTotal.toLocaleString()}. Current profit margin: ${Math.round(((d.monthlyRevenue - runningTotal) / d.monthlyRevenue) * 100)}%.`,
      });
    }
    case "get_financial_summary": {
      const { period } = input as { period: string };
      const multiplier = period === "today" ? 1/30 : period === "this_week" ? 7/30 : 1;
      return JSON.stringify({
        period,
        revenue: Math.round(d.monthlyRevenue * multiplier),
        expenses: Math.round(d.monthlyExpenses * multiplier),
        net_profit: Math.round(d.netProfit * multiplier),
        profit_margin: Math.round((d.netProfit / d.monthlyRevenue) * 100),
        top_revenue_categories: d.topRevenue.map((r) => ({ ...r, amount: Math.round(r.amount * multiplier) })),
        top_expense_categories: d.topExpenses.map((e) => ({ ...e, amount: Math.round(e.amount * multiplier) })),
        trend: "+8% vs same period last month",
      });
    }
    case "check_credit_score": {
      return JSON.stringify({
        score: d.creditScore,
        tier: d.creditTier,
        tier_label: "Good",
        top_positive_factors: [
          { factor: "Transaction regularity", points: 120, detail: "Sells charcoal daily — consistent income pattern" },
          { factor: "KYC verified", points: 85, detail: "NRC verified with 95% confidence" },
          { factor: "Chilimba reliability", points: 75, detail: "8/8 on-time contributions (100%)" },
          { factor: "Platform diversity", points: 45, detail: "Active on MTN Money and Airtel Money" },
        ],
        top_negative_factors: [
          { factor: "Account age", points: -30, detail: "Only 9 months old — more history needed" },
          { factor: "Balance volatility", points: -20, detail: "High daily variation in cash flow" },
        ],
        how_to_improve: "Make 3 more on-time Chilimba contributions (+15 pts). Complete KYC address verification (+10 pts). Maintain current transaction frequency for 3 more months (+25 pts).",
      });
    }
    case "check_loan_eligibility": {
      const { desired_amount, purpose } = input as { desired_amount?: number; purpose?: string };
      const requested = desired_amount || 5000;
      const eligible = requested <= d.loanEligibility.maxAmount;
      return JSON.stringify({
        credit_score: d.creditScore,
        credit_tier: d.creditTier,
        eligible,
        max_eligible_amount: d.loanEligibility.maxAmount,
        requested_amount: requested,
        purpose: purpose || "not specified",
        offers: eligible ? d.loanEligibility.currentOffers : [],
        rate_range: d.loanEligibility.rateRange,
        chilimba_discount_applied: d.chilimbaReliability > 0.9,
        chilimba_discount_amount: "2.5% rate reduction for verified savings circle member",
        message: eligible
          ? `You qualify for K${requested.toLocaleString()} at ${d.loanEligibility.rateRange} annual. ${d.chilimbaReliability > 0.9 ? "Your Chilimba reliability score gives you a 2.5% rate discount." : ""}`
          : `Your current limit is K${d.loanEligibility.maxAmount.toLocaleString()}. Improve your credit score to access larger amounts.`,
      });
    }
    case "get_savings_circle_status": {
      const c = d.savingsCircle;
      const roundsLeft = c.totalRounds - c.currentRound;
      return JSON.stringify({
        circle_name: c.name,
        contribution: c.contribution,
        frequency: c.frequency,
        current_round: c.currentRound,
        total_rounds: c.totalRounds,
        rounds_remaining: roundsLeft,
        progress_percent: Math.round((c.currentRound / c.totalRounds) * 100),
        next_payout_estimate: `K${(c.contribution * 12).toLocaleString()} (when your turn comes)`,
        reliability_score: "100% — all contributions on time",
        credit_impact: "Your perfect Chilimba record adds ~75 points to your credit score",
      });
    }
    case "generate_cash_flow_forecast": {
      const weeklyRevenue = d.monthlyRevenue / 4.3;
      const weeklyExpenses = d.monthlyExpenses / 4.3;
      return JSON.stringify({
        forecast_period: "30 days",
        projected_revenue: Math.round(d.monthlyRevenue * 1.08),
        projected_expenses: Math.round(d.monthlyExpenses * 1.03),
        projected_net: Math.round(d.monthlyRevenue * 1.08 - d.monthlyExpenses * 1.03),
        confidence_interval: { lower: Math.round(d.netProfit * 0.85), upper: Math.round(d.netProfit * 1.25) },
        weekly_breakdown: [1, 2, 3, 4].map((week) => ({
          week: `Week ${week}`,
          revenue: Math.round(weeklyRevenue * (0.9 + Math.random() * 0.2)),
          expenses: Math.round(weeklyExpenses * (0.9 + Math.random() * 0.2)),
        })),
        alerts: [
          "Restock charcoal by Day 8 based on sales velocity",
          "Market fees due around Day 15 — budget K600",
        ],
        revenue_trend: "+8% month-over-month for the last 3 months",
        recommendation: "Strong trajectory. Consider applying for K3,000 inventory loan to scale charcoal stock — model shows 22% ROI in 30 days.",
      });
    }
    default:
      return JSON.stringify({ error: "Unknown tool" });
  }
}

const SYSTEM_PROMPT = `You are Ndalama AI, a personal financial advisor chatbot for market traders and small business owners in Zambia. You are warm, direct, and practical — like a trusted friend who happens to know finance.

PERSONALITY:
- Speak like a knowledgeable Zambian friend, not a formal bank. Use "K" for kwacha.
- Be concise but insightful. No fluff.
- Celebrate wins. Warn about risks clearly but without alarm.
- Use tools FIRST before answering — always check real data.

CAPABILITIES (use tools for all of these):
- Record sales and expenses from natural language ("I sold 3 bags charcoal for K150")
- Provide financial summaries and trend analysis
- Explain credit scores and how to improve them
- Show loan eligibility and compare offers
- Track Chilimba savings circle contributions
- Generate cash flow forecasts

LANGUAGE: Respond in whatever language the user writes in. Support English, Bemba, and Nyanja naturally.

NUMBERS: Always use K prefix for kwacha amounts. Use commas for thousands (K1,200 not K1200). Be specific — "K5,250 profit" not "good profit".

TOOL USE: Use tools immediately when the user mentions a transaction, asks about money, or requests information. Don't ask for more info than needed — make reasonable assumptions and confirm.`;

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // If no API key, fall back to rule-based
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        role: "assistant",
        content: getFallbackResponse(message),
        intent: "general",
        timestamp: new Date().toISOString(),
        fallback: true,
      });
    }

    const messages: Anthropic.MessageParam[] = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    // Agentic loop: allow up to 3 tool calls
    let finalText = "";
    let intent = "general";
    const loopMessages = [...messages];

    for (let i = 0; i < 4; i++) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools,
        messages: loopMessages,
      });

      // Collect any text blocks
      const textBlocks = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text");
      if (textBlocks.length > 0) {
        finalText = textBlocks.map((b) => b.text).join("\n");
      }

      // Detect intent from content
      const allText = response.content.map((b) => ("text" in b ? b.text : ("name" in b ? (b as { name: string }).name : ""))).join(" ").toLowerCase();
      if (allText.includes("log_transaction") || allText.includes("recorded") || allText.includes("revenue") || allText.includes("expense")) intent = "financial_record";
      else if (allText.includes("credit") || allText.includes("score")) intent = "credit_inquiry";
      else if (allText.includes("loan") || allText.includes("borrow")) intent = "loan_inquiry";
      else if (allText.includes("forecast") || allText.includes("predict")) intent = "forecast";
      else if (allText.includes("summary") || allText.includes("profit")) intent = "financial_summary";

      if (response.stop_reason === "end_turn") break;

      // Process tool calls
      const toolUseBlocks = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      if (toolUseBlocks.length === 0) break;

      // Add assistant turn + tool results
      loopMessages.push({ role: "assistant", content: response.content });
      loopMessages.push({
        role: "user",
        content: toolUseBlocks.map((tool) => ({
          type: "tool_result" as const,
          tool_use_id: tool.id,
          content: executeTool(tool.name, tool.input as Record<string, unknown>),
        })),
      });
    }

    return NextResponse.json({
      role: "assistant",
      content: finalText || "I processed your request. How else can I help?",
      intent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      role: "assistant",
      content: getFallbackResponse(""),
      intent: "error",
      timestamp: new Date().toISOString(),
      fallback: true,
    });
  }
}

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("sold") || lower.includes("sale")) return "Recorded your sale! Keep tracking transactions to build a stronger credit profile.";
  if (lower.includes("paid") || lower.includes("expense")) return "Expense recorded. I'll track this against your budget.";
  if (lower.includes("score") || lower.includes("credit")) return "Your Ndalama Score is 720 (Tier B — Good). Top factors: transaction regularity, KYC verified, Chilimba participation.";
  if (lower.includes("borrow") || lower.includes("loan")) return "With score 720 (Tier B), you qualify for up to K5,000 at 8-12% annual. Visit the Lending Marketplace to see current offers.";
  if (lower.includes("forecast")) return "30-day forecast: Revenue K9,200 (+8%), Expenses K3,800, Net K5,400. Restock charcoal by Day 8.";
  if (lower.includes("summary") || lower.includes("how much")) return "March summary: Revenue K8,450 · Expenses K3,200 · Net Profit K5,250 (62% margin). Charcoal sales are your top earner at K4,800.";
  return "I can help you track sales, expenses, check your credit score, and find loan options. What would you like to do?";
}
