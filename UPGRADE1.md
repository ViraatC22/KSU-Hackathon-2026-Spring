# NDALAMA AI — MASTER UPGRADE BLUEPRINT
## From Hackathon Prototype to Competition-Winning Platform

### Document Version: 2.0 | Classification: Internal Engineering Plan
### Target: Win outright against T20 university teams

---

## TABLE OF CONTENTS

1. [Strategic Assessment & Philosophy](#1-strategic-assessment--philosophy)
2. [Architecture Overhaul — The Nervous System](#2-architecture-overhaul--the-nervous-system)
3. [Module 1 Deep Dive: Credit Scoring Engine](#3-module-1-credit-scoring-engine)
4. [Module 2 Deep Dive: Reconciliation & Fraud Detection](#4-module-2-reconciliation--fraud-detection)
5. [Module 3 Deep Dive: Conversational AI Advisor](#5-module-3-conversational-ai-advisor)
6. [Module 4 Deep Dive: Lending Marketplace](#6-module-4-lending-marketplace)
7. [Module 5 Deep Dive: Predictive Inclusion Heatmap](#7-module-5-predictive-inclusion-heatmap)
8. [Module 6 Deep Dive: Chilimba Savings Circles](#8-module-6-chilimba-savings-circles)
9. [Module 7 Deep Dive: Document Intelligence](#9-module-7-document-intelligence)
10. [Frontend & Design System Revolution](#10-frontend--design-system-revolution)
11. [Data Engineering & Synthetic Data Strategy](#11-data-engineering--synthetic-data-strategy)
12. [Security, Privacy & Compliance](#12-security-privacy--compliance)
13. [Performance & Optimization](#13-performance--optimization)
14. [Testing Strategy](#14-testing-strategy)
15. [Demo Choreography & Presentation Mastery](#15-demo-choreography--presentation-mastery)
16. [Risk Mitigation & Contingency Plans](#16-risk-mitigation--contingency-plans)
17. [Day-by-Day Execution Timeline](#17-day-by-day-execution-timeline)
18. [Competitive Intelligence — How to Beat Every Other Team](#18-competitive-intelligence)

---

# 1. STRATEGIC ASSESSMENT & PHILOSOPHY

## 1.1 Why Most Hackathon Projects Lose

Having evaluated hundreds of hackathon submissions, the pattern is clear. Projects lose because of five recurring failures:

**Failure 1: Feature List Syndrome.** Teams build 7 disconnected features and call it a platform. Judges see through this instantly. The modules don't share data, don't trigger each other, and could each be a separate app. The "platform" is just a navigation menu linking unrelated pages.

**Failure 2: Toy AI.** The ML model is a single `sklearn` classifier trained on 200 rows of random data. There's no feature engineering, no explainability, no evaluation metrics. When a judge asks "what's your model's AUC?" the team freezes. The AI is cosmetic, not functional.

**Failure 3: Template UI.** The dashboard is a shadcn/ui sidebar template with default gray colors. Every card looks identical. There's no visual hierarchy, no animation, no design identity. It looks like every other hackathon project in the room.

**Failure 4: No Story.** The demo is a feature walkthrough: "here's the credit score page, here's the lending page, here's the chatbot." There's no narrative, no emotional arc, no protagonist. Judges remember stories, not feature lists.

**Failure 5: No Depth Under Pressure.** When judges probe with technical questions, the team can't explain their model architecture, their data pipeline, their scaling strategy, or their business model. Surface-level understanding gets exposed in Q&A.

## 1.2 Our Strategy: Depth Over Breadth

We're going to win by being undeniably deep in three areas while maintaining strong coverage across all seven modules:

**Pillar of Depth #1: The Credit Scoring Engine.** This is our intellectual centerpiece. When judges examine it, they should find research-grade feature engineering, ensemble modeling with calibration, SHAP explainability that's interactive, and a fairness audit system that actually adjusts thresholds in real-time. This single module should demonstrate graduate-level ML understanding.

**Pillar of Depth #2: The Integration Layer.** The event-driven architecture that connects all seven modules must be VISIBLE to judges. Not just working in the background — actively demonstrated through a real-time activity feed, cross-module data flow animations, and cascading effects that judges can see (a chatbot transaction instantly updating a credit score that instantly changes a loan rate).

**Pillar of Depth #3: The Visual Experience.** Our UI must be so distinctive that judges remember it after seeing 20+ other projects. This means a custom design system rooted in Zambian identity, cinematic animations, a hero data visualization (the transaction network graph), and dark-mode-first design that makes every chart and metric pop.

## 1.3 The Judge's Rubric (Anticipated)

Hackathon judges typically score on these dimensions. We need to dominate every one:

```
DIMENSION              WEIGHT    OUR TARGET    STRATEGY
─────────────────────────────────────────────────────────────────
Technical Complexity    25%      10/10         Ensemble ML, real-time fraud,
                                               event-driven architecture,
                                               multi-layer AI pipeline

Innovation/Creativity   25%      10/10         Chilimba digitization (cultural),
                                               fairness audit (responsible AI),
                                               transaction graph visualization

Impact/Relevance        20%      10/10         7M unbanked Zambians,
                                               concrete metrics per module,
                                               regulatory alignment (BOZ)

Design/UX               15%      10/10         Custom Zambian design system,
                                               cinematic animations,
                                               mobile-first PWA

Presentation Quality    15%      10/10         Narrative arc (Mwila's story),
                                               live demo with backup video,
                                               confident Q&A handling
```

---

# 2. ARCHITECTURE OVERHAUL — THE NERVOUS SYSTEM

## 2.1 Current State Problem

Right now, your modules are likely structured as independent page routes that each query their own data. Module 1 doesn't know what Module 6 has done. Module 3 doesn't feed into Module 1. They're seven apps wearing a trench coat pretending to be a platform.

## 2.2 Target Architecture: Event-Driven Data Flywheel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                   │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────────────┐ │
│  │  Next.js PWA │  │  WhatsApp    │  │  USSD Gateway                 │ │
│  │  Dashboard   │  │  Webhook     │  │  (future)                     │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬─────────────────────┘ │
└─────────┼──────────────────┼─────────────────────┼──────────────────────┘
          │                  │                     │
          ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │  Next.js API Routes (tRPC or REST)                                 ││
│  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────────────┐  ││
│  │  │   Auth   │ │   Rate   │ │  Request  │ │  Response            │  ││
│  │  │ Middleware│ │  Limiter │ │ Validator │ │  Transformer         │  ││
│  │  └──────────┘ └──────────┘ └───────────┘ └──────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  MODULE SERVICES │ │  AI/ML ENGINE    │ │  EVENT SYSTEM    │
│                  │ │                  │ │                  │
│  Each module     │ │  Python FastAPI  │ │  EventBus class  │
│  exposes a       │ │  microservice    │ │  + Redis PubSub  │
│  service class   │ │  serving all     │ │  for real-time   │
│  with business   │ │  ML models       │ │  cross-module    │
│  logic           │ │                  │ │  communication   │
│                  │ │  Endpoints:      │ │                  │
│  CreditService   │ │  /ml/score       │ │  Emits events    │
│  TxService       │ │  /ml/fraud       │ │  when any module │
│  ChatService     │ │  /ml/forecast    │ │  creates, updates│
│  LendingService  │ │  /ml/ocr         │ │  or processes    │
│  MapService      │ │  /ml/risk        │ │  data            │
│  ChilimbaService │ │  /ml/inclusion   │ │                  │
│  DocService      │ │  /ml/bias        │ │  Other modules   │
│                  │ │                  │ │  subscribe and   │
└────────┬─────────┘ └────────┬─────────┘ │  react           │
         │                    │           └────────┬─────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      UNIFIED DATA LAYER                                 │
│                                                                         │
│  ┌───────────────────┐  ┌──────────────────┐  ┌──────────────────────┐ │
│  │   PostgreSQL       │  │   Redis           │  │   MinIO / S3         │ │
│  │                    │  │                   │  │                      │ │
│  │   Core relational  │  │   Session cache   │  │   Document images    │ │
│  │   data: users,     │  │   Real-time event │  │   OCR results        │ │
│  │   transactions,    │  │   streams         │  │   ML model artifacts │ │
│  │   loans, circles,  │  │   Rate limiting   │  │   User uploads       │ │
│  │   scores, docs     │  │   Job queues      │  │   Generated reports  │ │
│  │                    │  │   Fraud alert      │  │                      │ │
│  │   TimescaleDB      │  │   cache           │  │                      │ │
│  │   extension for    │  │   Credit score     │  │                      │ │
│  │   time-series tx   │  │   cache            │  │                      │ │
│  │   data             │  │                   │  │                      │ │
│  └───────────────────┘  └──────────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2.3 The Event Bus — Detailed Implementation

This is the single most important piece of new infrastructure. Every module produces events, and every module can consume events from other modules. This is what transforms seven features into one platform.

### Event Type Definitions

```typescript
// lib/events/types.ts

// Every event in the system has a standard envelope
interface EventEnvelope<T extends string, P> {
  id: string;                  // Unique event ID (cuid)
  type: T;                     // Event type discriminator
  payload: P;                  // Event-specific data
  source: ModuleSource;        // Which module emitted this
  userId?: string;             // User this event relates to (if applicable)
  timestamp: Date;             // When the event occurred
  correlationId?: string;      // Links related events across modules
  metadata?: Record<string, any>;
}

type ModuleSource =
  | 'credit_scoring'    // Module 1
  | 'reconciliation'    // Module 2
  | 'chatbot'           // Module 3
  | 'lending'           // Module 4
  | 'heatmap'           // Module 5
  | 'chilimba'          // Module 6
  | 'document_intel'    // Module 7
  | 'system';           // Platform-level events

// ─── MODULE 1 EVENTS ────────────────────────────────

interface CreditScoreCalculatedEvent extends EventEnvelope<
  'CREDIT_SCORE_CALCULATED',
  {
    userId: string;
    previousScore: number | null;
    newScore: number;
    previousTier: string | null;
    newTier: string;
    scoreDelta: number;
    topPositiveFactors: Array<{ feature: string; impact: number; description: string }>;
    topNegativeFactors: Array<{ feature: string; impact: number; description: string }>;
    triggerReason: 'scheduled' | 'transaction_threshold' | 'manual' | 'kyc_completed'
      | 'chilimba_update' | 'loan_event';
  }
> {}

interface BiasAlertEvent extends EventEnvelope<
  'BIAS_ALERT_DETECTED',
  {
    metric: 'demographic_parity' | 'equalized_odds' | 'calibration';
    protectedAttribute: string;  // 'gender', 'province', 'age_group'
    groupA: { name: string; value: number };
    groupB: { name: string; value: number };
    disparityRatio: number;
    threshold: number;
    severity: 'warning' | 'critical';
    suggestedAction: string;
  }
> {}

// ─── MODULE 2 EVENTS ────────────────────────────────

interface TransactionIngestedEvent extends EventEnvelope<
  'TRANSACTION_INGESTED',
  {
    transactionId: string;
    ndalamaId: string;
    platform: 'MTN_MONEY' | 'AIRTEL_MONEY' | 'ZOONA';
    senderId: string;
    receiverId: string;
    amount: number;
    currency: string;
    type: string;
    category: string | null;
    isNewUser: boolean;           // First transaction for this user?
    userTxCountToday: number;     // Running count for velocity checks
  }
> {}

interface FraudDetectedEvent extends EventEnvelope<
  'FRAUD_DETECTED',
  {
    transactionId: string;
    affectedUserId: string;
    fraudScore: number;           // 0.0 - 1.0
    detectionLayer: 'rule_engine' | 'isolation_forest' | 'autoencoder' | 'graph_analysis';
    flags: Array<{
      code: string;               // e.g., 'VELOCITY_BREACH', 'AMOUNT_ANOMALY'
      description: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      evidence: Record<string, any>;
    }>;
    recommendedAction: 'monitor' | 'hold' | 'block' | 'review';
    relatedTransactions: string[];  // Other suspicious tx IDs in the cluster
  }
> {}

interface ReconciliationDiscrepancyEvent extends EventEnvelope<
  'RECONCILIATION_DISCREPANCY',
  {
    platform1TxId: string;
    platform2TxId: string | null;
    discrepancyType: 'amount_mismatch' | 'missing_counterpart' | 'timing_mismatch' | 'duplicate';
    details: string;
    amountDifference: number | null;
  }
> {}

// ─── MODULE 3 EVENTS ────────────────────────────────

interface FinancialRecordCreatedEvent extends EventEnvelope<
  'FINANCIAL_RECORD_CREATED',
  {
    recordId: string;
    userId: string;
    type: 'revenue' | 'expense' | 'cogs';
    category: string;
    amount: number;
    currency: string;
    description: string;
    extractedFrom: string;       // The original user message
    confidence: number;          // How confident was the extraction
    cumulativeMonthlyRevenue: number;
    cumulativeMonthlyExpenses: number;
  }
> {}

interface ForecastGeneratedEvent extends EventEnvelope<
  'FORECAST_GENERATED',
  {
    userId: string;
    forecastPeriod: string;       // '30d', '90d'
    predictedRevenue: number;
    predictedExpenses: number;
    predictedNetCashflow: number;
    confidenceInterval: { lower: number; upper: number };
    alerts: string[];             // e.g., "Cash flow may go negative in week 3"
  }
> {}

// ─── MODULE 4 EVENTS ────────────────────────────────

interface LoanApplicationCreatedEvent extends EventEnvelope<
  'LOAN_APPLICATION_CREATED',
  {
    applicationId: string;
    borrowerId: string;
    requestedAmount: number;
    purpose: string;
    term: number;
    creditScoreAtApplication: number;
    tierAtApplication: string;
    autoGeneratedFinancials: boolean;  // Were financials from Module 3?
    kycVerified: boolean;              // Was identity from Module 7?
  }
> {}

interface LoanOfferCreatedEvent extends EventEnvelope<
  'LOAN_OFFER_CREATED',
  {
    offerId: string;
    applicationId: string;
    lenderId: string;
    interestRate: number;
    rateComponents: Record<string, number>;  // Breakdown of rate calculation
    maxAmount: number;
  }
> {}

interface LoanFundedEvent extends EventEnvelope<
  'LOAN_FUNDED',
  {
    applicationId: string;
    offerId: string;
    borrowerId: string;
    lenderId: string;
    fundedAmount: number;
    interestRate: number;
    disbursementPlatform: string;
    expectedRepaymentDate: string;
  }
> {}

interface LoanRepaymentEvent extends EventEnvelope<
  'LOAN_REPAYMENT_RECORDED',
  {
    applicationId: string;
    borrowerId: string;
    paymentAmount: number;
    remainingBalance: number;
    isOnTime: boolean;
    daysLate: number;
  }
> {}

// ─── MODULE 5 EVENTS ────────────────────────────────

interface InclusionScoreUpdatedEvent extends EventEnvelope<
  'INCLUSION_SCORE_UPDATED',
  {
    districtName: string;
    province: string;
    previousScore: number;
    newScore: number;
    delta: number;
    triggerFactors: string[];     // Which metrics changed
    recommendation: string | null;
    predictedNewUsers: number | null;
  }
> {}

// ─── MODULE 6 EVENTS ────────────────────────────────

interface ChilimbaContributionEvent extends EventEnvelope<
  'CHILIMBA_CONTRIBUTION',
  {
    circleId: string;
    circleName: string;
    memberId: string;
    memberName: string;
    amount: number;
    round: number;
    totalRounds: number;
    wasOnTime: boolean;
    memberReliabilityScore: number;
    circleHealthScore: number;
  }
> {}

interface ChilimbaDefaultRiskEvent extends EventEnvelope<
  'CHILIMBA_DEFAULT_RISK_ALERT',
  {
    circleId: string;
    circleName: string;
    memberId: string;
    memberName: string;
    riskProbability: number;
    riskFactors: string[];
    suggestedIntervention: string;
    nextContributionDate: string;
  }
> {}

interface ChilimbaPayoutEvent extends EventEnvelope<
  'CHILIMBA_PAYOUT',
  {
    circleId: string;
    recipientId: string;
    amount: number;
    round: number;
    wasAiOptimized: boolean;     // Was payout order AI-suggested?
  }
> {}

interface ChilimbaCompletedEvent extends EventEnvelope<
  'CHILIMBA_CIRCLE_COMPLETED',
  {
    circleId: string;
    circleName: string;
    memberIds: string[];
    totalRounds: number;
    finalHealthScore: number;
    completionRate: number;       // % of contributions that were on time
  }
> {}

// ─── MODULE 7 EVENTS ────────────────────────────────

interface DocumentProcessedEvent extends EventEnvelope<
  'DOCUMENT_PROCESSED',
  {
    documentId: string;
    userId: string;
    documentType: 'NRC' | 'BUSINESS_PERMIT' | 'RECEIPT' | 'UTILITY_BILL';
    overallConfidence: number;
    extractedFields: Array<{
      fieldName: string;
      value: string;
      confidence: number;
      needsReview: boolean;
    }>;
    verificationStatus: 'verified' | 'manual_review' | 'rejected';
    processingTimeMs: number;
    ocrEngine: 'tesseract' | 'claude_vision' | 'hybrid';
  }
> {}

interface KycCompletedEvent extends EventEnvelope<
  'KYC_COMPLETED',
  {
    userId: string;
    status: 'verified' | 'failed';
    documentIds: string[];
    overallConfidence: number;
    verifiedFields: {
      fullName: boolean;
      nrcNumber: boolean;
      dateOfBirth: boolean;
      address: boolean;
    };
    failureReasons: string[];
  }
> {}

// ─── UNION TYPE ──────────────────────────────────────

type NdalamaEvent =
  | CreditScoreCalculatedEvent
  | BiasAlertEvent
  | TransactionIngestedEvent
  | FraudDetectedEvent
  | ReconciliationDiscrepancyEvent
  | FinancialRecordCreatedEvent
  | ForecastGeneratedEvent
  | LoanApplicationCreatedEvent
  | LoanOfferCreatedEvent
  | LoanFundedEvent
  | LoanRepaymentEvent
  | InclusionScoreUpdatedEvent
  | ChilimbaContributionEvent
  | ChilimbaDefaultRiskEvent
  | ChilimbaPayoutEvent
  | ChilimbaCompletedEvent
  | DocumentProcessedEvent
  | KycCompletedEvent;
```

### Event Bus Implementation

```typescript
// lib/events/bus.ts

import { Redis } from 'ioredis';
import { prisma } from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';

class NdalamaEventBus {
  private redis: Redis;
  private handlers: Map<string, Array<(event: NdalamaEvent) => Promise<void>>> = new Map();
  private sseClients: Set<WritableStreamDefaultWriter> = new Set();

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
    this.registerCrossModuleHandlers();
  }

  async emit(event: Omit<NdalamaEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent = {
      ...event,
      id: createId(),
      timestamp: new Date(),
    } as NdalamaEvent;

    // 1. Persist to activity log (for the feed)
    await prisma.activityLog.create({
      data: {
        eventId: fullEvent.id,
        eventType: fullEvent.type,
        source: fullEvent.source,
        userId: fullEvent.userId || null,
        payload: fullEvent.payload as any,
        correlationId: fullEvent.correlationId || null,
        timestamp: fullEvent.timestamp,
      }
    });

    // 2. Publish to Redis for real-time subscribers
    await this.redis.publish('ndalama:events', JSON.stringify(fullEvent));

    // 3. Execute registered handlers (cross-module reactions)
    const handlers = this.handlers.get(fullEvent.type) || [];
    await Promise.allSettled(
      handlers.map(handler => handler(fullEvent))
    );

    // 4. Push to SSE clients (browser real-time feed)
    this.broadcastToSSE(fullEvent);
  }

  on(eventType: string, handler: (event: NdalamaEvent) => Promise<void>): void {
    const existing = this.handlers.get(eventType) || [];
    existing.push(handler);
    this.handlers.set(eventType, existing);
  }

  // ─── CROSS-MODULE REACTION WIRING ───────────────────

  private registerCrossModuleHandlers(): void {

    // TRANSACTION → triggers fraud check, credit recalc, district update
    this.on('TRANSACTION_INGESTED', async (event) => {
      const { transactionId, senderId, amount, userTxCountToday } = event.payload;

      // Trigger fraud detection (Module 2 internal)
      await fetch(`${process.env.ML_SERVICE_URL}/ml/fraud-detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, senderId, amount, txCountToday: userTxCountToday })
      });

      // Queue credit score recalculation if threshold met
      // (recalculate every 10 transactions, not every single one)
      if (userTxCountToday % 10 === 0) {
        await this.emit({
          type: 'CREDIT_SCORE_CALCULATED',
          source: 'credit_scoring',
          userId: senderId,
          payload: await this.recalculateCreditScore(senderId, 'transaction_threshold'),
        });
      }
    });

    // FRAUD → freezes credit, pauses loans, alerts user
    this.on('FRAUD_DETECTED', async (event) => {
      const { affectedUserId, recommendedAction, transactionId } = event.payload;

      if (recommendedAction === 'block' || recommendedAction === 'hold') {
        // Temporarily flag user's credit score
        await prisma.creditScore.updateMany({
          where: { userId: affectedUserId },
          data: { fairnessFlags: { push: 'FRAUD_INVESTIGATION_ACTIVE' } }
        });

        // Pause any pending loan applications
        await prisma.loanApplication.updateMany({
          where: { borrowerId: affectedUserId, status: 'OPEN' },
          data: { status: 'PAUSED' }
        });
      }
    });

    // KYC COMPLETED → unlocks credit scoring, enables loan applications
    this.on('KYC_COMPLETED', async (event) => {
      const { userId, status } = event.payload;

      if (status === 'verified') {
        // Update user KYC status
        await prisma.user.update({
          where: { id: userId },
          data: { kycStatus: 'VERIFIED' }
        });

        // Trigger initial or recalculated credit score
        const scorePayload = await this.recalculateCreditScore(userId, 'kyc_completed');
        await this.emit({
          type: 'CREDIT_SCORE_CALCULATED',
          source: 'credit_scoring',
          userId: userId,
          payload: scorePayload,
        });
      }
    });

    // CREDIT SCORE UPDATED → recalculates loan eligibility and rates
    this.on('CREDIT_SCORE_CALCULATED', async (event) => {
      const { userId, newScore, newTier } = event.payload;

      // Find any open loan applications and refresh their rates
      const openApplications = await prisma.loanApplication.findMany({
        where: { borrowerId: userId, status: 'OPEN' },
        include: { offers: true }
      });

      for (const app of openApplications) {
        // Recalculate dynamic pricing for existing offers
        // (This is what makes the rate simulator work in real-time)
        await this.recalculateLoanOffers(app.id, newScore, newTier);
      }
    });

    // CHILIMBA CONTRIBUTION → updates credit features + logs as transaction
    this.on('CHILIMBA_CONTRIBUTION', async (event) => {
      const { memberId, amount, wasOnTime, memberReliabilityScore } = event.payload;

      // Log as a unified transaction in Module 2
      await prisma.transaction.create({
        data: {
          ndalamaId: `NDA-CHI-${createId().slice(0, 8)}`,
          originalPlatform: 'INTERNAL',
          originalTxId: `CHILIMBA-${event.id}`,
          senderId: memberId,
          receiverId: memberId,  // Self-referential for savings
          amount: amount,
          currency: 'ZMW',
          type: 'SAVINGS_CONTRIBUTION',
          timestamp: new Date(),
        }
      });

      // Queue credit score update with new savings data
      await this.emit({
        type: 'CREDIT_SCORE_CALCULATED',
        source: 'credit_scoring',
        userId: memberId,
        payload: await this.recalculateCreditScore(memberId, 'chilimba_update'),
      });
    });

    // CHILIMBA COMPLETED → major credit boost for all members
    this.on('CHILIMBA_CIRCLE_COMPLETED', async (event) => {
      const { memberIds, finalHealthScore, completionRate } = event.payload;

      // Recalculate credit score for every member in the completed circle
      for (const memberId of memberIds) {
        await this.emit({
          type: 'CREDIT_SCORE_CALCULATED',
          source: 'credit_scoring',
          userId: memberId,
          payload: await this.recalculateCreditScore(memberId, 'chilimba_update'),
        });
      }
    });

    // CHATBOT FINANCIAL RECORD → feeds into credit scoring and lending
    this.on('FINANCIAL_RECORD_CREATED', async (event) => {
      const { userId, type, amount, cumulativeMonthlyRevenue } = event.payload;

      // If user has an open loan application, update their financial summary
      const openApp = await prisma.loanApplication.findFirst({
        where: { borrowerId: userId, status: 'OPEN' }
      });

      if (openApp) {
        // Auto-refresh the financial statement attached to the application
        await this.refreshLoanFinancials(openApp.id, userId);
      }
    });

    // LOAN FUNDED → creates disbursement transaction, updates district metrics
    this.on('LOAN_FUNDED', async (event) => {
      const { borrowerId, fundedAmount, disbursementPlatform } = event.payload;

      // Create the disbursement transaction in Module 2
      await prisma.transaction.create({
        data: {
          ndalamaId: `NDA-LOAN-${createId().slice(0, 8)}`,
          originalPlatform: disbursementPlatform as any,
          originalTxId: `LOAN-DISB-${event.payload.applicationId}`,
          senderId: event.payload.lenderId,
          receiverId: borrowerId,
          amount: fundedAmount,
          currency: 'ZMW',
          type: 'LOAN_DISBURSEMENT',
          timestamp: new Date(),
        }
      });

      // Update district lending metrics for Module 5
      const user = await prisma.user.findUnique({ where: { id: borrowerId } });
      if (user) {
        await this.updateDistrictMetrics(user.district, 'loan_funded');
      }
    });

    // LOAN REPAYMENT → feeds back into credit score (positive or negative)
    this.on('LOAN_REPAYMENT_RECORDED', async (event) => {
      const { borrowerId, isOnTime, daysLate } = event.payload;

      await this.emit({
        type: 'CREDIT_SCORE_CALCULATED',
        source: 'credit_scoring',
        userId: borrowerId,
        payload: await this.recalculateCreditScore(borrowerId, 'loan_event'),
      });
    });
  }

  // Helper methods referenced above
  private async recalculateCreditScore(userId: string, trigger: string) {
    // Calls the ML service with all features for this user
    // Returns the full CreditScoreCalculatedEvent payload
    // Implementation in Module 1 section below
  }

  private async recalculateLoanOffers(applicationId: string, newScore: number, newTier: string) {
    // Recalculates dynamic pricing for all offers on this application
    // Implementation in Module 4 section below
  }

  private async refreshLoanFinancials(applicationId: string, userId: string) {
    // Regenerates the financial statement from chatbot records
    // Implementation in Module 3/4 section below
  }

  private async updateDistrictMetrics(district: string, trigger: string) {
    // Updates the inclusion score for a district
    // Implementation in Module 5 section below
  }

  private broadcastToSSE(event: NdalamaEvent) {
    const message = `data: ${JSON.stringify({
      id: event.id,
      type: event.type,
      source: event.source,
      userId: event.userId,
      timestamp: event.timestamp,
      summary: this.generateEventSummary(event),
    })}\n\n`;

    for (const client of this.sseClients) {
      try { client.write(message); } catch { this.sseClients.delete(client); }
    }
  }

  private generateEventSummary(event: NdalamaEvent): string {
    // Human-readable summary for the activity feed
    switch (event.type) {
      case 'TRANSACTION_INGESTED':
        return `Transaction of K${event.payload.amount} via ${event.payload.platform}`;
      case 'CREDIT_SCORE_CALCULATED':
        const delta = event.payload.scoreDelta;
        const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
        return `Credit score updated to ${event.payload.newScore} (${arrow}${Math.abs(delta)})`;
      case 'FRAUD_DETECTED':
        return `⚠️ Fraud alert: ${event.payload.flags[0]?.description || 'Suspicious activity'}`;
      case 'KYC_COMPLETED':
        return `Identity ${event.payload.status === 'verified' ? '✓ verified' : '✗ failed'}`;
      case 'LOAN_APPLICATION_CREATED':
        return `Loan application for K${event.payload.requestedAmount}`;
      case 'LOAN_FUNDED':
        return `Loan of K${event.payload.fundedAmount} funded at ${event.payload.interestRate}%`;
      case 'CHILIMBA_CONTRIBUTION':
        return `Savings contribution of K${event.payload.amount} to ${event.payload.circleName}`;
      case 'CHILIMBA_DEFAULT_RISK_ALERT':
        return `⚠️ Default risk alert for ${event.payload.memberName} (${(event.payload.riskProbability * 100).toFixed(0)}%)`;
      case 'DOCUMENT_PROCESSED':
        return `${event.payload.documentType} processed (confidence: ${(event.payload.overallConfidence * 100).toFixed(0)}%)`;
      default:
        return event.type;
    }
  }
}

// Singleton
export const eventBus = new NdalamaEventBus();
```

### SSE Endpoint for Real-Time Feed

```typescript
// app/api/events/stream/route.ts

import { eventBus } from '@/lib/events/bus';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const writer = {
        write: (data: string) => controller.enqueue(encoder.encode(data)),
      };
      eventBus.addSSEClient(writer);

      // Send heartbeat every 30s to keep connection alive
      const heartbeat = setInterval(() => {
        try { controller.enqueue(encoder.encode(': heartbeat\n\n')); }
        catch { clearInterval(heartbeat); }
      }, 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        eventBus.removeSSEClient(writer);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Activity Log Database Table (add to Prisma schema)

```prisma
model ActivityLog {
  id            String   @id @default(cuid())
  eventId       String   @unique
  eventType     String
  source        String
  userId        String?
  payload       Json
  correlationId String?
  timestamp     DateTime @default(now())
  summary       String?

  @@index([userId, timestamp])
  @@index([eventType, timestamp])
  @@index([source, timestamp])
  @@index([timestamp])
}
```

## 2.4 Service Layer Pattern

Every module should have a service class that encapsulates business logic. API routes should be thin — they validate input, call the service, and return the response. This keeps logic testable and reusable.

```typescript
// lib/services/credit.service.ts — EXAMPLE PATTERN

import { prisma } from '@/lib/prisma';
import { eventBus } from '@/lib/events/bus';

class CreditService {
  // All credit scoring business logic lives here
  // API routes just call these methods

  async getScore(userId: string) {
    // Check cache first (Redis, 5 min TTL)
    // If miss, query database
    // If no score exists, return null with "not yet calculated" status
  }

  async calculateScore(userId: string, trigger: string) {
    // 1. Gather features from ALL modules
    const features = await this.gatherFeatures(userId);
    // 2. Call ML service
    const mlResult = await this.callMLService(features);
    // 3. Store result
    const score = await this.storeScore(userId, mlResult);
    // 4. Emit event (triggers cross-module reactions)
    await eventBus.emit({ type: 'CREDIT_SCORE_CALCULATED', ... });
    // 5. Return
    return score;
  }

  async gatherFeatures(userId: string) {
    // This is where integration happens — we query data from EVERY module
    const [transactions, financialRecords, circles, documents, loans] = await Promise.all([
      prisma.transaction.findMany({ where: { senderId: userId }, orderBy: { timestamp: 'desc' }, take: 1000 }),
      prisma.financialRecord.findMany({ where: { userId }, orderBy: { date: 'desc' } }),
      prisma.circleMembership.findMany({ where: { userId }, include: { circle: true } }),
      prisma.document.findMany({ where: { userId, verificationStatus: 'VERIFIED' } }),
      prisma.loanApplication.findMany({ where: { borrowerId: userId }, include: { offers: true } }),
    ]);

    return this.engineerFeatures(transactions, financialRecords, circles, documents, loans);
  }

  // Feature engineering method detailed in Module 1 section
  private engineerFeatures(...args: any[]) { /* ... */ }
}

export const creditService = new CreditService();
```

---

# 3. MODULE 1: CREDIT SCORING ENGINE — DEEP DIVE

This is your intellectual centerpiece. When a judge examines this module, they should find research-grade work that demonstrates genuine ML understanding, not just API calls.

## 3.1 Feature Engineering — 147 Features Across 8 Categories

Feature engineering is where 80% of ML value comes from. Your model is only as good as the features you feed it. Here is every single feature you should compute, organized by category, with the exact computation logic.

### Category 1: Transaction Volume Features (18 features)

These capture HOW MUCH a user transacts, across multiple time windows:

```python
# services/ml-engine/features/transaction_volume.py

def compute_volume_features(transactions: list[dict]) -> dict:
    """
    Input: list of transactions sorted by timestamp (newest first)
    Each tx has: amount, timestamp, type, platform, senderId, receiverId
    """
    now = datetime.utcnow()
    features = {}

    # ─── RAW COUNTS BY TIME WINDOW ────────────────────
    for window_name, days in [('7d', 7), ('14d', 14), ('30d', 30), ('60d', 60), ('90d', 90)]:
        window_txs = [t for t in transactions if (now - t['timestamp']).days <= days]
        features[f'tx_count_{window_name}'] = len(window_txs)
        features[f'tx_total_amount_{window_name}'] = sum(t['amount'] for t in window_txs)
        features[f'tx_avg_amount_{window_name}'] = (
            features[f'tx_total_amount_{window_name}'] / max(features[f'tx_count_{window_name}'], 1)
        )

    # ─── TREND: IS ACTIVITY INCREASING OR DECREASING? ──
    # Compare last 30 days vs previous 30 days
    recent_30 = features['tx_count_30d']
    prev_30 = features['tx_count_60d'] - features['tx_count_30d']
    features['tx_count_trend_30d'] = (
        (recent_30 - prev_30) / max(prev_30, 1)  # Positive = growing
    )
    features['tx_amount_trend_30d'] = (
        (features['tx_total_amount_30d'] - (features['tx_total_amount_60d'] - features['tx_total_amount_30d']))
        / max(features['tx_total_amount_60d'] - features['tx_total_amount_30d'], 1)
    )

    # ─── VOLUME PER DAY (INTENSITY) ────────────────────
    features['tx_per_day_30d'] = features['tx_count_30d'] / 30
    features['tx_per_day_90d'] = features['tx_count_90d'] / 90

    return features  # 18 features
```

### Category 2: Transaction Regularity Features (14 features)

These capture HOW CONSISTENTLY a user transacts. Regular patterns suggest financial stability:

```python
# services/ml-engine/features/transaction_regularity.py

import numpy as np
from scipy.stats import entropy

def compute_regularity_features(transactions: list[dict]) -> dict:
    features = {}

    # ─── INTER-TRANSACTION TIME GAPS ──────────────────
    timestamps = sorted([t['timestamp'] for t in transactions])
    if len(timestamps) >= 2:
        gaps_hours = [
            (timestamps[i+1] - timestamps[i]).total_seconds() / 3600
            for i in range(len(timestamps) - 1)
        ]

        features['gap_mean_hours'] = np.mean(gaps_hours)
        features['gap_median_hours'] = np.median(gaps_hours)
        features['gap_std_hours'] = np.std(gaps_hours)
        features['gap_cv'] = features['gap_std_hours'] / max(features['gap_mean_hours'], 0.01)
        # Lower CV = more regular transactions

        # ─── REGULARITY SCORE ──────────────────────────
        # Based on entropy of hourly gap distribution
        # Perfectly regular = low entropy, irregular = high entropy
        gap_bins = np.histogram(gaps_hours, bins=24)[0]
        gap_probs = gap_bins / max(gap_bins.sum(), 1)
        features['gap_entropy'] = float(entropy(gap_probs + 1e-10))
        features['regularity_score'] = 1.0 / (1.0 + features['gap_entropy'])
    else:
        features.update({
            'gap_mean_hours': 0, 'gap_median_hours': 0,
            'gap_std_hours': 0, 'gap_cv': 0,
            'gap_entropy': 0, 'regularity_score': 0
        })

    # ─── DAY-OF-WEEK DISTRIBUTION ─────────────────────
    # Are they active every day, or only certain days?
    day_counts = [0] * 7
    for t in transactions:
        day_counts[t['timestamp'].weekday()] += 1
    day_probs = np.array(day_counts) / max(sum(day_counts), 1)
    features['day_of_week_entropy'] = float(entropy(day_probs + 1e-10))
    features['active_days_per_week'] = sum(1 for c in day_counts if c > 0)

    # ─── WEEKEND VS WEEKDAY RATIO ─────────────────────
    weekend_count = day_counts[5] + day_counts[6]
    weekday_count = sum(day_counts[:5])
    features['weekend_ratio'] = weekend_count / max(weekend_count + weekday_count, 1)

    # ─── TIME-OF-DAY DISTRIBUTION ─────────────────────
    hour_counts = [0] * 24
    for t in transactions:
        hour_counts[t['timestamp'].hour] += 1
    features['night_tx_ratio'] = (
        sum(hour_counts[22:] + hour_counts[:6]) / max(len(transactions), 1)
    )
    features['peak_hour'] = int(np.argmax(hour_counts))

    # ─── LONGEST STREAK AND DORMANCY ──────────────────
    active_dates = sorted(set(t['timestamp'].date() for t in transactions))
    if len(active_dates) >= 2:
        # Longest consecutive active days
        max_streak = current_streak = 1
        for i in range(1, len(active_dates)):
            if (active_dates[i] - active_dates[i-1]).days == 1:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 1
        features['longest_active_streak'] = max_streak

        # Longest gap (dormancy)
        date_gaps = [(active_dates[i] - active_dates[i-1]).days for i in range(1, len(active_dates))]
        features['longest_dormant_days'] = max(date_gaps) if date_gaps else 0
    else:
        features['longest_active_streak'] = len(active_dates)
        features['longest_dormant_days'] = 0

    return features  # 14 features
```

### Category 3: Network Graph Features (12 features)

These are your **differentiator**. Almost no hackathon team will compute graph-based credit features. They capture social financial behavior:

```python
# services/ml-engine/features/network_graph.py

import networkx as nx
from collections import Counter

def compute_network_features(transactions: list[dict], user_id: str) -> dict:
    """
    Build a transaction graph and compute graph-theoretic features
    for the target user. This reveals social financial patterns:
    - Do they transact with many diverse people? (good)
    - Are their contacts connected to each other? (community signal)
    - Do people send money back to them? (reciprocity = trust)
    - How central are they in the overall network? (influence)
    """
    features = {}

    # Build directed weighted graph
    G = nx.DiGraph()
    for tx in transactions:
        sender = tx['senderId']
        receiver = tx['receiverId']
        if G.has_edge(sender, receiver):
            G[sender][receiver]['weight'] += tx['amount']
            G[sender][receiver]['count'] += 1
        else:
            G.add_edge(sender, receiver, weight=tx['amount'], count=1)

    if user_id not in G:
        return {k: 0 for k in [
            'unique_counterparties', 'outgoing_counterparties', 'incoming_counterparties',
            'counterparty_diversity_index', 'reciprocity_ratio', 'network_degree_centrality',
            'network_pagerank', 'network_betweenness', 'avg_tx_per_counterparty',
            'top_counterparty_concentration', 'cluster_coefficient', 'is_bridge_node'
        ]}

    # ─── COUNTERPARTY METRICS ─────────────────────────
    outgoing = set(G.successors(user_id))
    incoming = set(G.predecessors(user_id))
    all_counterparties = outgoing | incoming

    features['unique_counterparties'] = len(all_counterparties)
    features['outgoing_counterparties'] = len(outgoing)
    features['incoming_counterparties'] = len(incoming)

    # Shannon entropy of transaction distribution across counterparties
    counterparty_amounts = {}
    for cp in all_counterparties:
        total = 0
        if G.has_edge(user_id, cp):
            total += G[user_id][cp]['weight']
        if G.has_edge(cp, user_id):
            total += G[cp][user_id]['weight']
        counterparty_amounts[cp] = total

    if counterparty_amounts:
        total_amount = sum(counterparty_amounts.values())
        probs = [a / total_amount for a in counterparty_amounts.values()]
        features['counterparty_diversity_index'] = float(entropy(probs))
    else:
        features['counterparty_diversity_index'] = 0

    # ─── RECIPROCITY ──────────────────────────────────
    # What fraction of people you send money to also send money back?
    reciprocal = outgoing & incoming
    features['reciprocity_ratio'] = len(reciprocal) / max(len(outgoing), 1)

    # ─── CENTRALITY METRICS ───────────────────────────
    features['network_degree_centrality'] = nx.degree_centrality(G).get(user_id, 0)
    features['network_pagerank'] = nx.pagerank(G, weight='weight').get(user_id, 0)

    # Betweenness: how often is this user on the shortest path between others?
    # High betweenness = important connector in the network
    try:
        features['network_betweenness'] = nx.betweenness_centrality(G).get(user_id, 0)
    except:
        features['network_betweenness'] = 0

    # ─── TRANSACTION CONCENTRATION ────────────────────
    if counterparty_amounts:
        sorted_amounts = sorted(counterparty_amounts.values(), reverse=True)
        features['avg_tx_per_counterparty'] = np.mean(sorted_amounts)
        # What % of total goes to the top counterparty?
        features['top_counterparty_concentration'] = sorted_amounts[0] / max(total_amount, 1)
    else:
        features['avg_tx_per_counterparty'] = 0
        features['top_counterparty_concentration'] = 0

    # ─── CLUSTERING ───────────────────────────────────
    # Are your contacts connected to each other?
    # High clustering = tight-knit community (positive for credit)
    G_undirected = G.to_undirected()
    features['cluster_coefficient'] = nx.clustering(G_undirected, user_id)

    # Is this user a "bridge" between communities?
    # Bridge nodes connect otherwise disconnected groups
    try:
        bridges = set()
        for u, v in nx.bridges(G_undirected):
            bridges.add(u)
            bridges.add(v)
        features['is_bridge_node'] = 1 if user_id in bridges else 0
    except:
        features['is_bridge_node'] = 0

    return features  # 12 features
```

### Category 4: Balance Behavior Features (10 features)

These simulate what a bank would see if they could observe your account balance over time:

```python
# services/ml-engine/features/balance_behavior.py

def compute_balance_features(transactions: list[dict], user_id: str) -> dict:
    """
    Reconstruct a daily balance series from transactions.
    In real deployment, this would come from mobile money API.
    For the hackathon, we simulate it from transaction history.
    """
    features = {}

    # Reconstruct daily balance from transaction flow
    daily_net = {}  # date -> net flow
    for tx in transactions:
        date = tx['timestamp'].date()
        if date not in daily_net:
            daily_net[date] = 0

        if tx['senderId'] == user_id:
            daily_net[date] -= tx['amount']  # Money out
        if tx['receiverId'] == user_id:
            daily_net[date] += tx['amount']  # Money in

    if not daily_net:
        return {k: 0 for k in [
            'avg_daily_net_flow', 'net_flow_volatility', 'negative_flow_days_ratio',
            'max_consecutive_negative_days', 'savings_ratio', 'income_stability',
            'expense_regularity', 'balance_recovery_speed', 'end_of_month_stress',
            'inflow_diversity'
        ]}

    sorted_dates = sorted(daily_net.keys())
    daily_values = [daily_net[d] for d in sorted_dates]

    # ─── FLOW METRICS ─────────────────────────────────
    features['avg_daily_net_flow'] = np.mean(daily_values)
    features['net_flow_volatility'] = np.std(daily_values)

    # How many days is net flow negative? (spending more than earning)
    negative_days = sum(1 for v in daily_values if v < 0)
    features['negative_flow_days_ratio'] = negative_days / max(len(daily_values), 1)

    # Longest streak of negative days
    max_neg_streak = current_neg = 0
    for v in daily_values:
        if v < 0:
            current_neg += 1
            max_neg_streak = max(max_neg_streak, current_neg)
        else:
            current_neg = 0
    features['max_consecutive_negative_days'] = max_neg_streak

    # ─── SAVINGS RATIO ────────────────────────────────
    total_inflow = sum(tx['amount'] for tx in transactions if tx['receiverId'] == user_id)
    total_outflow = sum(tx['amount'] for tx in transactions if tx['senderId'] == user_id)
    features['savings_ratio'] = (
        (total_inflow - total_outflow) / max(total_inflow, 1)
    )

    # ─── INCOME STABILITY ─────────────────────────────
    # Group inflows by week and measure consistency
    weekly_income = {}
    for tx in transactions:
        if tx['receiverId'] == user_id:
            week = tx['timestamp'].isocalendar()[1]
            weekly_income[week] = weekly_income.get(week, 0) + tx['amount']

    if len(weekly_income) >= 2:
        weekly_values = list(weekly_income.values())
        features['income_stability'] = 1 - (np.std(weekly_values) / max(np.mean(weekly_values), 1))
    else:
        features['income_stability'] = 0

    # ─── EXPENSE REGULARITY ───────────────────────────
    weekly_expense = {}
    for tx in transactions:
        if tx['senderId'] == user_id:
            week = tx['timestamp'].isocalendar()[1]
            weekly_expense[week] = weekly_expense.get(week, 0) + tx['amount']

    if len(weekly_expense) >= 2:
        expense_values = list(weekly_expense.values())
        features['expense_regularity'] = 1 - (np.std(expense_values) / max(np.mean(expense_values), 1))
    else:
        features['expense_regularity'] = 0

    # ─── BALANCE RECOVERY SPEED ───────────────────────
    # After a large outflow (>2x average), how quickly does balance recover?
    avg_outflow = np.mean([tx['amount'] for tx in transactions if tx['senderId'] == user_id] or [0])
    large_outflows = [
        tx for tx in transactions
        if tx['senderId'] == user_id and tx['amount'] > 2 * avg_outflow
    ]
    recovery_days = []
    for outflow_tx in large_outflows:
        outflow_date = outflow_tx['timestamp'].date()
        # Find next day with positive cumulative flow
        cumulative = -outflow_tx['amount']
        for d in sorted_dates:
            if d > outflow_date:
                cumulative += daily_net.get(d, 0)
                if cumulative >= 0:
                    recovery_days.append((d - outflow_date).days)
                    break

    features['balance_recovery_speed'] = (
        np.mean(recovery_days) if recovery_days else 30  # Default to 30 if no data
    )

    # ─── END-OF-MONTH STRESS ──────────────────────────
    # Are the last 5 days of each month typically negative?
    eom_flows = [v for d, v in daily_net.items() if d.day >= 26]
    features['end_of_month_stress'] = (
        sum(1 for f in eom_flows if f < 0) / max(len(eom_flows), 1)
    )

    # ─── INFLOW DIVERSITY ─────────────────────────────
    # How many unique sources of income?
    income_sources = set(
        tx['senderId'] for tx in transactions if tx['receiverId'] == user_id
    )
    features['inflow_diversity'] = len(income_sources)

    return features  # 10 features
```

### Category 5: Cross-Platform Features (8 features)

Unique to Ndalama — captures behavior across MTN, Airtel, and Zoona:

```python
# services/ml-engine/features/cross_platform.py

def compute_cross_platform_features(transactions: list[dict], user_id: str) -> dict:
    features = {}

    # Which platforms does this user use?
    user_txs = [t for t in transactions if t['senderId'] == user_id or t['receiverId'] == user_id]
    platforms_used = set(t['originalPlatform'] for t in user_txs)

    features['num_platforms_active'] = len(platforms_used)
    features['uses_mtn'] = 1 if 'MTN_MONEY' in platforms_used else 0
    features['uses_airtel'] = 1 if 'AIRTEL_MONEY' in platforms_used else 0
    features['uses_zoona'] = 1 if 'ZOONA' in platforms_used else 0

    # Platform concentration: what % on primary platform?
    platform_counts = Counter(t['originalPlatform'] for t in user_txs)
    if platform_counts:
        most_common_count = platform_counts.most_common(1)[0][1]
        features['primary_platform_concentration'] = most_common_count / max(len(user_txs), 1)
    else:
        features['primary_platform_concentration'] = 1.0

    # Cross-platform transfers (moving money between networks)
    # This suggests financial sophistication
    cross_platform_txs = [
        t for t in user_txs
        if t['type'] == 'P2P_TRANSFER'
        # In a real system, you'd detect cross-platform by receiver's platform
    ]
    features['cross_platform_transfer_count'] = len(cross_platform_txs)

    # Platform switching frequency: how often do they change platforms?
    platform_sequence = [t['originalPlatform'] for t in sorted(user_txs, key=lambda x: x['timestamp'])]
    switches = sum(1 for i in range(1, len(platform_sequence)) if platform_sequence[i] != platform_sequence[i-1])
    features['platform_switch_rate'] = switches / max(len(platform_sequence) - 1, 1)

    return features  # 8 features
```

### Category 6: Chilimba / Savings Features (15 features)

Your secret weapon. No competitor will have savings circle data feeding credit scores:

```python
# services/ml-engine/features/chilimba.py

def compute_chilimba_features(memberships: list[dict], payouts: list[dict]) -> dict:
    """
    memberships: CircleMembership records with circle data
    payouts: CirclePayout records
    """
    features = {}

    if not memberships:
        return {k: 0 for k in [
            'circles_total_count', 'circles_active_count', 'circles_completed_count',
            'is_circle_leader', 'leader_circle_count', 'avg_reliability_score',
            'min_reliability_score', 'total_contributed_amount', 'avg_contribution_amount',
            'on_time_rate', 'circles_completed_rate', 'avg_circle_health_at_membership',
            'total_payouts_received', 'months_in_circles', 'contribution_consistency'
        ]}

    features['circles_total_count'] = len(memberships)
    features['circles_active_count'] = sum(1 for m in memberships if m['circle']['status'] == 'ACTIVE')
    features['circles_completed_count'] = sum(1 for m in memberships if m['circle']['status'] == 'COMPLETED')

    # Leadership
    features['is_circle_leader'] = 1 if any(m['role'] == 'LEADER' for m in memberships) else 0
    features['leader_circle_count'] = sum(1 for m in memberships if m['role'] == 'LEADER')

    # Reliability
    reliability_scores = [m['reliabilityScore'] for m in memberships]
    features['avg_reliability_score'] = np.mean(reliability_scores)
    features['min_reliability_score'] = np.min(reliability_scores)

    # Contribution amounts
    contribution_amounts = [float(m['circle']['contributionAmount']) for m in memberships]
    features['total_contributed_amount'] = sum(
        float(m['circle']['contributionAmount']) * m['circle']['currentRound']
        for m in memberships
    )
    features['avg_contribution_amount'] = np.mean(contribution_amounts)

    # On-time rate (derived from reliability)
    features['on_time_rate'] = np.mean(reliability_scores)  # Simplified

    # Completion rate
    completed = features['circles_completed_count']
    total = features['circles_total_count']
    features['circles_completed_rate'] = completed / max(total, 1)

    # Circle health at time of membership
    features['avg_circle_health_at_membership'] = np.mean([
        m['circle']['healthScore'] for m in memberships
    ])

    # Payouts received
    features['total_payouts_received'] = len(payouts)

    # Duration
    join_dates = [m['joinedAt'] for m in memberships]
    if join_dates:
        earliest = min(join_dates)
        features['months_in_circles'] = (datetime.utcnow() - earliest).days / 30
    else:
        features['months_in_circles'] = 0

    # Contribution consistency (low variance = consistent)
    if len(contribution_amounts) >= 2:
        features['contribution_consistency'] = 1 - (
            np.std(contribution_amounts) / max(np.mean(contribution_amounts), 1)
        )
    else:
        features['contribution_consistency'] = 0.5

    return features  # 15 features
```

### Category 7: Identity & KYC Features (8 features)

From Module 7 document processing:

```python
# services/ml-engine/features/identity.py

def compute_identity_features(user: dict, documents: list[dict]) -> dict:
    features = {}

    features['kyc_verified'] = 1 if user['kycStatus'] == 'VERIFIED' else 0
    features['account_age_days'] = (datetime.utcnow() - user['createdAt']).days
    features['has_email'] = 1 if user.get('email') else 0
    features['num_documents_uploaded'] = len(documents)

    verified_docs = [d for d in documents if d['verificationStatus'] == 'VERIFIED']
    features['num_documents_verified'] = len(verified_docs)

    # Average confidence of verified documents
    confidences = [d['confidence'] for d in verified_docs if d.get('confidence')]
    features['avg_document_confidence'] = np.mean(confidences) if confidences else 0

    # Has specific document types?
    doc_types = set(d['type'] for d in documents)
    features['has_nrc'] = 1 if 'NRC' in doc_types else 0
    features['has_business_permit'] = 1 if 'BUSINESS_PERMIT' in doc_types else 0

    return features  # 8 features
```

### Category 8: Business / Chatbot Financial Features (12 features)

From Module 3's structured financial records:

```python
# services/ml-engine/features/business.py

def compute_business_features(financial_records: list[dict]) -> dict:
    features = {}

    if not financial_records:
        return {k: 0 for k in [
            'has_financial_records', 'total_records_count', 'monthly_avg_revenue',
            'monthly_avg_expenses', 'revenue_expense_ratio', 'revenue_growth_rate',
            'num_revenue_categories', 'num_expense_categories', 'largest_single_revenue',
            'revenue_concentration', 'record_frequency_per_week', 'financial_record_months'
        ]}

    features['has_financial_records'] = 1
    features['total_records_count'] = len(financial_records)

    # Revenue vs Expenses
    revenue_records = [r for r in financial_records if r['type'] == 'revenue']
    expense_records = [r for r in financial_records if r['type'] in ('expense', 'cogs')]

    monthly_revenue = {}
    for r in revenue_records:
        month = r['date'].strftime('%Y-%m')
        monthly_revenue[month] = monthly_revenue.get(month, 0) + float(r['amount'])

    monthly_expenses = {}
    for r in expense_records:
        month = r['date'].strftime('%Y-%m')
        monthly_expenses[month] = monthly_expenses.get(month, 0) + float(r['amount'])

    rev_values = list(monthly_revenue.values())
    exp_values = list(monthly_expenses.values())

    features['monthly_avg_revenue'] = np.mean(rev_values) if rev_values else 0
    features['monthly_avg_expenses'] = np.mean(exp_values) if exp_values else 0
    features['revenue_expense_ratio'] = (
        features['monthly_avg_revenue'] / max(features['monthly_avg_expenses'], 1)
    )

    # Revenue growth: last month vs previous month
    if len(rev_values) >= 2:
        features['revenue_growth_rate'] = (rev_values[-1] - rev_values[-2]) / max(rev_values[-2], 1)
    else:
        features['revenue_growth_rate'] = 0

    # Category diversity
    features['num_revenue_categories'] = len(set(r['category'] for r in revenue_records))
    features['num_expense_categories'] = len(set(r['category'] for r in expense_records))

    # Largest single revenue event
    features['largest_single_revenue'] = max(
        (float(r['amount']) for r in revenue_records), default=0
    )

    # Revenue concentration: does one category dominate?
    if revenue_records:
        cat_amounts = Counter()
        for r in revenue_records:
            cat_amounts[r['category']] += float(r['amount'])
        total_rev = sum(cat_amounts.values())
        top_cat = cat_amounts.most_common(1)[0][1]
        features['revenue_concentration'] = top_cat / max(total_rev, 1)
    else:
        features['revenue_concentration'] = 0

    # Record frequency
    date_range = (max(r['date'] for r in financial_records) - min(r['date'] for r in financial_records)).days
    features['record_frequency_per_week'] = len(financial_records) / max(date_range / 7, 1)

    # How many months of records?
    features['financial_record_months'] = len(set(
        r['date'].strftime('%Y-%m') for r in financial_records
    ))

    return features  # 12 features
```

### Category 9: Loan History Features (10 features)

Feedback from Module 4 — past loan behavior predicts future behavior:

```python
# services/ml-engine/features/loan_history.py

def compute_loan_features(loan_applications: list[dict]) -> dict:
    features = {}

    if not loan_applications:
        return {k: 0 for k in [
            'total_applications', 'funded_loans', 'completed_loans',
            'defaulted_loans', 'completion_rate', 'avg_loan_amount',
            'total_borrowed', 'avg_interest_rate', 'on_time_repayment_rate',
            'is_repeat_borrower'
        ]}

    features['total_applications'] = len(loan_applications)
    features['funded_loans'] = sum(1 for l in loan_applications if l['status'] in ('FUNDED', 'REPAYING', 'COMPLETED'))
    features['completed_loans'] = sum(1 for l in loan_applications if l['status'] == 'COMPLETED')
    features['defaulted_loans'] = sum(1 for l in loan_applications if l['status'] == 'DEFAULTED')
    features['completion_rate'] = features['completed_loans'] / max(features['funded_loans'], 1)

    funded = [l for l in loan_applications if l['status'] in ('FUNDED', 'REPAYING', 'COMPLETED')]
    features['avg_loan_amount'] = np.mean([float(l['amount']) for l in funded]) if funded else 0
    features['total_borrowed'] = sum(float(l['amount']) for l in funded)

    # Average interest rate (from accepted offers)
    rates = [float(l['acceptedOffer']['interestRate']) for l in funded if l.get('acceptedOffer')]
    features['avg_interest_rate'] = np.mean(rates) if rates else 0

    # On-time repayment (simplified — would need repayment records)
    features['on_time_repayment_rate'] = features['completion_rate']

    features['is_repeat_borrower'] = 1 if features['funded_loans'] >= 2 else 0

    return features  # 10 features
```

### Feature Aggregation — Total: 107 Base Features

```python
# services/ml-engine/features/aggregator.py

def aggregate_all_features(user_id: str, data: dict) -> dict:
    """
    Combine all feature categories into a single feature vector.
    data contains pre-fetched transactions, memberships, documents, etc.
    """
    all_features = {}
    all_features.update(compute_volume_features(data['transactions']))         # 18
    all_features.update(compute_regularity_features(data['transactions']))     # 14
    all_features.update(compute_network_features(data['transactions'], user_id))  # 12
    all_features.update(compute_balance_features(data['transactions'], user_id))  # 10
    all_features.update(compute_cross_platform_features(data['transactions'], user_id))  # 8
    all_features.update(compute_chilimba_features(data['memberships'], data['payouts']))  # 15
    all_features.update(compute_identity_features(data['user'], data['documents']))  # 8
    all_features.update(compute_business_features(data['financial_records']))   # 12
    all_features.update(compute_loan_features(data['loan_applications']))      # 10
    # Total: 107 features

    # Add interaction features (combinations that might be predictive)
    all_features['income_to_contribution_ratio'] = (
        all_features['monthly_avg_revenue'] / max(all_features['avg_contribution_amount'], 1)
    )
    all_features['tx_per_counterparty'] = (
        all_features['tx_count_30d'] / max(all_features['unique_counterparties'], 1)
    )
    all_features['savings_circle_credit_boost'] = (
        all_features['avg_reliability_score'] * all_features['circles_completed_rate']
    )
    # ... add more interaction features

    return all_features  # ~120+ features
```

## 3.2 Model Architecture — Ensemble with Calibration

### Why Ensemble?

A single XGBoost model will get you 80% of the way. But an ensemble of diverse models demonstrates real ML maturity. Each model type captures different patterns:

```python
# services/ml-engine/models/credit_scorer.py

import xgboost as xgb
import lightgbm as lgb
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import StratifiedKFold
import shap
import numpy as np
import joblib

class CreditScoringEnsemble:
    """
    Three-model ensemble with Platt calibration.

    Model 1: XGBoost — captures complex non-linear interactions
    Model 2: LightGBM — handles sparse features well, different tree structure
    Model 3: Logistic Regression — linear baseline, highly interpretable

    The ensemble's prediction is a weighted average of all three,
    then calibrated so that a 0.7 probability actually means 70% of users
    at that score level are creditworthy.
    """

    def __init__(self):
        self.xgb_model = None
        self.lgb_model = None
        self.lr_model = None
        self.calibrator = None
        self.feature_names = None
        self.weights = [0.45, 0.35, 0.20]  # XGB, LGB, LR
        self.xgb_explainer = None

    def train(self, X: np.ndarray, y: np.ndarray, feature_names: list[str]):
        """
        Train the full ensemble pipeline.
        X: feature matrix (n_samples x n_features)
        y: binary labels (1 = creditworthy, 0 = default/high_risk)
        """
        self.feature_names = feature_names

        # Split for calibration
        # Use 80% for training models, 20% held out for calibration
        from sklearn.model_selection import train_test_split
        X_train, X_cal, y_train, y_cal = train_test_split(
            X, y, test_size=0.2, stratify=y, random_state=42
        )

        # ─── MODEL 1: XGBOOST ────────────────────────────
        self.xgb_model = xgb.XGBClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            min_child_weight=5,
            reg_alpha=0.1,
            reg_lambda=1.0,
            scale_pos_weight=sum(y_train == 0) / max(sum(y_train == 1), 1),
            eval_metric='auc',
            early_stopping_rounds=30,
            random_state=42,
        )
        self.xgb_model.fit(
            X_train, y_train,
            eval_set=[(X_cal, y_cal)],
            verbose=False
        )

        # ─── MODEL 2: LIGHTGBM ───────────────────────────
        self.lgb_model = lgb.LGBMClassifier(
            n_estimators=300,
            max_depth=7,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            min_child_samples=20,
            reg_alpha=0.1,
            reg_lambda=1.0,
            is_unbalance=True,
            random_state=42,
        )
        self.lgb_model.fit(
            X_train, y_train,
            eval_set=[(X_cal, y_cal)],
            callbacks=[lgb.early_stopping(30, verbose=False)]
        )

        # ─── MODEL 3: LOGISTIC REGRESSION ────────────────
        from sklearn.preprocessing import StandardScaler
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_cal_scaled = self.scaler.transform(X_cal)

        self.lr_model = LogisticRegression(
            C=0.1,
            penalty='l2',
            max_iter=1000,
            class_weight='balanced',
            random_state=42,
        )
        self.lr_model.fit(X_train_scaled, y_train)

        # ─── CALIBRATION LAYER ────────────────────────────
        # Get ensemble probabilities on calibration set
        ensemble_probs_cal = self._raw_ensemble_predict(X_cal)

        # Platt scaling (logistic calibration)
        from sklearn.calibration import calibration_curve
        from sklearn.linear_model import LogisticRegression as LR
        self.calibrator = LR()
        self.calibrator.fit(ensemble_probs_cal.reshape(-1, 1), y_cal)

        # ─── EXPLAINABILITY ───────────────────────────────
        self.xgb_explainer = shap.TreeExplainer(self.xgb_model)

        # ─── EVALUATION METRICS ───────────────────────────
        self.evaluation = self._evaluate(X_cal, y_cal)

    def _raw_ensemble_predict(self, X: np.ndarray) -> np.ndarray:
        """Get weighted average probability from all three models."""
        p_xgb = self.xgb_model.predict_proba(X)[:, 1]
        p_lgb = self.lgb_model.predict_proba(X)[:, 1]
        X_scaled = self.scaler.transform(X)
        p_lr = self.lr_model.predict_proba(X_scaled)[:, 1]

        return (
            self.weights[0] * p_xgb +
            self.weights[1] * p_lgb +
            self.weights[2] * p_lr
        )

    def predict(self, features: dict) -> dict:
        """
        Score a single user. Returns score, tier, and full explanation.
        """
        # Convert features dict to array in correct order
        X = np.array([[features.get(f, 0) for f in self.feature_names]])

        # Raw ensemble probability
        raw_prob = self._raw_ensemble_predict(X)[0]

        # Calibrated probability
        cal_prob = self.calibrator.predict_proba(raw_prob.reshape(1, -1))[0][1]

        # Convert to 0-1000 score
        score = int(cal_prob * 1000)
        tier = self._get_tier(score)

        # SHAP explanation (using XGBoost as primary explainer)
        shap_values = self.xgb_explainer.shap_values(X)[0]

        # Format top factors
        factor_impacts = list(zip(self.feature_names, shap_values))
        factor_impacts.sort(key=lambda x: abs(x[1]), reverse=True)

        top_positive = [
            {
                'feature': name,
                'impact': float(impact),
                'value': features.get(name, 0),
                'description': self._describe_feature(name, features.get(name, 0), impact)
            }
            for name, impact in factor_impacts if impact > 0
        ][:8]

        top_negative = [
            {
                'feature': name,
                'impact': float(impact),
                'value': features.get(name, 0),
                'description': self._describe_feature(name, features.get(name, 0), impact)
            }
            for name, impact in factor_impacts if impact < 0
        ][:5]

        return {
            'score': score,
            'tier': tier,
            'rawProbability': float(raw_prob),
            'calibratedProbability': float(cal_prob),
            'topPositiveFactors': top_positive,
            'topNegativeFactors': top_negative,
            'allFactors': [
                {'feature': name, 'impact': float(impact)}
                for name, impact in factor_impacts
            ],
            'modelContributions': {
                'xgboost': float(self.xgb_model.predict_proba(X)[0][1]),
                'lightgbm': float(self.lgb_model.predict_proba(X)[0][1]),
                'logistic': float(self.lr_model.predict_proba(self.scaler.transform(X))[0][1]),
            }
        }

    def _get_tier(self, score: int) -> str:
        if score >= 800: return 'A'
        if score >= 650: return 'B'
        if score >= 500: return 'C'
        if score >= 350: return 'D'
        return 'E'

    def _describe_feature(self, name: str, value: float, impact: float) -> str:
        """Human-readable description of why this feature matters."""
        descriptions = {
            'tx_count_30d': f"{'High' if impact > 0 else 'Low'} transaction frequency ({int(value)} in 30 days)",
            'regularity_score': f"{'Consistent' if impact > 0 else 'Irregular'} transaction patterns (score: {value:.2f})",
            'avg_reliability_score': f"{'Strong' if impact > 0 else 'Weak'} savings circle track record ({value:.2f})",
            'savings_ratio': f"{'Positive' if impact > 0 else 'Negative'} savings behavior ({value:.1%} of income saved)",
            'unique_counterparties': f"{'Diverse' if impact > 0 else 'Limited'} financial network ({int(value)} contacts)",
            'kyc_verified': f"Identity {'verified' if value == 1 else 'not verified'}",
            'network_pagerank': f"{'Central' if impact > 0 else 'Peripheral'} position in transaction network",
            'reciprocity_ratio': f"{'High' if impact > 0 else 'Low'} mutual trust ({value:.1%} of contacts reciprocate)",
            'circles_completed_rate': f"{'Strong' if impact > 0 else 'Weak'} commitment to savings ({value:.0%} circles completed)",
            'income_stability': f"{'Stable' if impact > 0 else 'Volatile'} income pattern ({value:.2f})",
            'account_age_days': f"{'Established' if impact > 0 else 'New'} account ({int(value)} days)",
            'num_platforms_active': f"Active on {int(value)} mobile money platform{'s' if value > 1 else ''}",
            'balance_recovery_speed': f"{'Quick' if impact > 0 else 'Slow'} recovery after large expenses ({value:.0f} days avg)",
            'monthly_avg_revenue': f"Monthly revenue of K{value:,.0f}",
            'revenue_growth_rate': f"Revenue {'growing' if value > 0 else 'declining'} ({value:.1%})",
            'on_time_rate': f"{value:.0%} of savings contributions were on time",
        }
        return descriptions.get(name, f"{name}: {value:.3f}")

    def _evaluate(self, X: np.ndarray, y: np.ndarray) -> dict:
        """Full evaluation metrics for the model."""
        from sklearn.metrics import (
            roc_auc_score, precision_recall_curve, f1_score,
            accuracy_score, classification_report, brier_score_loss
        )

        probs = self._raw_ensemble_predict(X)
        cal_probs = self.calibrator.predict_proba(probs.reshape(-1, 1))[:, 1]
        preds = (cal_probs >= 0.5).astype(int)

        return {
            'auc_roc': float(roc_auc_score(y, cal_probs)),
            'accuracy': float(accuracy_score(y, preds)),
            'f1': float(f1_score(y, preds)),
            'brier_score': float(brier_score_loss(y, cal_probs)),
            'n_samples': len(y),
        }

    def save(self, path: str):
        joblib.dump(self, path)

    @classmethod
    def load(cls, path: str):
        return joblib.load(path)
```

## 3.3 Fairness Audit System — The Judge-Pleaser

This is where you separate yourself from every other team. Build a dedicated fairness module that:

1. Detects bias across protected attributes (gender, province, age group)
2. Quantifies the bias using multiple metrics
3. Offers real-time threshold adjustment to equalize outcomes
4. Logs fairness metrics over time

```python
# services/ml-engine/fairness/bias_audit.py

import numpy as np
from dataclasses import dataclass

@dataclass
class FairnessReport:
    attribute: str                    # 'gender', 'province', 'age_group'
    groups: dict                      # group_name -> group_data
    demographic_parity: dict          # Approval rates per group
    equalized_odds: dict              # TPR and FPR per group
    calibration: dict                 # Predicted vs actual per group
    disparate_impact_ratio: float     # Min group rate / max group rate
    passes_80_percent_rule: bool      # Federal standard
    suggested_thresholds: dict        # Per-group score thresholds to equalize
    overall_fairness_grade: str       # A, B, C, D, F

class FairnessAuditor:
    """
    Comprehensive bias audit system for the credit scoring model.

    Checks three families of fairness metrics:
    1. Demographic Parity: Are approval rates similar across groups?
    2. Equalized Odds: Are error rates similar across groups?
    3. Calibration: Does a score of X mean the same thing for all groups?

    Also provides threshold adjustment to actively mitigate detected bias.
    """

    def __init__(self, model):
        self.model = model

    def full_audit(
        self,
        features_list: list[dict],       # Feature dicts for all users
        labels: list[int],                # Actual outcomes (1=good, 0=bad)
        demographics: list[dict],         # {'gender': 'F', 'province': 'Lusaka', 'age_group': '25-34'}
        score_threshold: int = 500        # Default approval threshold
    ) -> dict:
        """
        Run complete fairness audit across all protected attributes.
        Returns a comprehensive report with visualizable data.
        """
        reports = {}

        for attribute in ['gender', 'province', 'age_group']:
            groups = {}
            for features, label, demo in zip(features_list, labels, demographics):
                group = demo.get(attribute, 'Unknown')
                if group not in groups:
                    groups[group] = {'features': [], 'labels': [], 'scores': []}
                groups[group]['features'].append(features)
                groups[group]['labels'].append(label)

                # Get model prediction
                result = self.model.predict(features)
                groups[group]['scores'].append(result['score'])

            # Filter groups with minimum sample size
            groups = {k: v for k, v in groups.items() if len(v['labels']) >= 30}

            if len(groups) < 2:
                continue

            # ─── DEMOGRAPHIC PARITY ───────────────────────
            approval_rates = {}
            for group_name, group_data in groups.items():
                approved = sum(1 for s in group_data['scores'] if s >= score_threshold)
                approval_rates[group_name] = {
                    'approval_rate': approved / len(group_data['scores']),
                    'total': len(group_data['scores']),
                    'approved': approved,
                    'denied': len(group_data['scores']) - approved,
                }

            # Disparate impact ratio
            rates = [v['approval_rate'] for v in approval_rates.values()]
            dir_ratio = min(rates) / max(rates) if max(rates) > 0 else 0

            # ─── EQUALIZED ODDS ───────────────────────────
            equalized_odds = {}
            for group_name, group_data in groups.items():
                predictions = [1 if s >= score_threshold else 0 for s in group_data['scores']]
                labels = group_data['labels']

                tp = sum(1 for p, l in zip(predictions, labels) if p == 1 and l == 1)
                fp = sum(1 for p, l in zip(predictions, labels) if p == 1 and l == 0)
                tn = sum(1 for p, l in zip(predictions, labels) if p == 0 and l == 0)
                fn = sum(1 for p, l in zip(predictions, labels) if p == 0 and l == 1)

                equalized_odds[group_name] = {
                    'tpr': tp / max(tp + fn, 1),  # True positive rate (sensitivity)
                    'fpr': fp / max(fp + tn, 1),  # False positive rate
                    'tnr': tn / max(fp + tn, 1),  # True negative rate (specificity)
                    'fnr': fn / max(tp + fn, 1),  # False negative rate
                    'precision': tp / max(tp + fp, 1),
                }

            # ─── CALIBRATION ──────────────────────────────
            calibration = {}
            for group_name, group_data in groups.items():
                # Bin scores into deciles and check actual positive rate per bin
                scores = np.array(group_data['scores'])
                labels = np.array(group_data['labels'])
                bins = np.linspace(0, 1000, 11)
                bin_data = []

                for i in range(len(bins) - 1):
                    mask = (scores >= bins[i]) & (scores < bins[i+1])
                    if mask.sum() >= 5:
                        predicted_rate = (bins[i] + bins[i+1]) / 2 / 1000
                        actual_rate = labels[mask].mean()
                        bin_data.append({
                            'bin_start': int(bins[i]),
                            'bin_end': int(bins[i+1]),
                            'predicted_rate': float(predicted_rate),
                            'actual_rate': float(actual_rate),
                            'count': int(mask.sum()),
                            'calibration_error': abs(predicted_rate - actual_rate),
                        })

                calibration[group_name] = bin_data

            # ─── THRESHOLD ADJUSTMENT ─────────────────────
            # Find per-group thresholds that equalize approval rates
            target_rate = np.mean([v['approval_rate'] for v in approval_rates.values()])
            suggested_thresholds = {}

            for group_name, group_data in groups.items():
                sorted_scores = sorted(group_data['scores'], reverse=True)
                target_approved = int(target_rate * len(sorted_scores))
                if 0 < target_approved < len(sorted_scores):
                    suggested_thresholds[group_name] = sorted_scores[target_approved]
                else:
                    suggested_thresholds[group_name] = score_threshold

            # ─── OVERALL GRADE ────────────────────────────
            if dir_ratio >= 0.90:
                grade = 'A'
            elif dir_ratio >= 0.80:
                grade = 'B'
            elif dir_ratio >= 0.70:
                grade = 'C'
            elif dir_ratio >= 0.60:
                grade = 'D'
            else:
                grade = 'F'

            reports[attribute] = {
                'demographic_parity': approval_rates,
                'equalized_odds': equalized_odds,
                'calibration': calibration,
                'disparate_impact_ratio': float(dir_ratio),
                'passes_80_percent_rule': dir_ratio >= 0.80,
                'suggested_thresholds': suggested_thresholds,
                'target_equalized_rate': float(target_rate),
                'overall_fairness_grade': grade,
            }

        return {
            'reports': reports,
            'overall_grade': min(
                (r['overall_fairness_grade'] for r in reports.values()),
                key=lambda g: 'ABCDF'.index(g),
                default='N/A'
            ),
            'timestamp': datetime.utcnow().isoformat(),
            'model_evaluation': self.model.evaluation,
            'total_users_audited': len(features_list),
        }
```

---

# 4. MODULE 2: RECONCILIATION & FRAUD DETECTION — DEEP DIVE

## 4.1 Multi-Layer Fraud Detection Architecture

```python
# services/ml-engine/models/fraud_detector.py

from sklearn.ensemble import IsolationForest
from tensorflow import keras
import numpy as np

class MultiLayerFraudDetector:
    """
    Four-layer fraud detection system:

    Layer 1: Rule Engine (deterministic, instant)
      - Hard rules that never miss obvious fraud
      - Configurable thresholds

    Layer 2: Isolation Forest (statistical anomaly)
      - Detects transactions that are statistically unusual
      - No labels needed — unsupervised

    Layer 3: Autoencoder (deep anomaly)
      - Learns compressed representation of normal transactions
      - High reconstruction error = anomalous

    Layer 4: Graph Analysis (structural)
      - Detects money laundering rings
      - Finds suspicious network patterns
    """

    def __init__(self):
        self.rules = FraudRuleEngine()
        self.isolation_forest = None
        self.autoencoder = None
        self.graph_analyzer = GraphFraudAnalyzer()

    def detect(self, transaction: dict, user_history: list[dict], graph_context: dict) -> dict:
        """
        Run all four layers and produce a unified fraud assessment.
        """
        results = {
            'transaction_id': transaction['id'],
            'layers': {},
            'flags': [],
            'overall_score': 0.0,
            'recommended_action': 'allow',
        }

        # Layer 1: Rules
        rule_result = self.rules.check(transaction, user_history)
        results['layers']['rule_engine'] = rule_result
        results['flags'].extend(rule_result['flags'])

        # Layer 2: Isolation Forest
        if_result = self._check_isolation_forest(transaction, user_history)
        results['layers']['isolation_forest'] = if_result
        if if_result['is_anomaly']:
            results['flags'].append({
                'code': 'STATISTICAL_ANOMALY',
                'severity': 'medium',
                'description': f"Transaction is statistically unusual (anomaly score: {if_result['score']:.3f})",
                'evidence': if_result,
            })

        # Layer 3: Autoencoder
        ae_result = self._check_autoencoder(transaction, user_history)
        results['layers']['autoencoder'] = ae_result
        if ae_result['is_anomaly']:
            results['flags'].append({
                'code': 'DEEP_ANOMALY',
                'severity': 'medium',
                'description': f"Unusual pattern detected by neural network (reconstruction error: {ae_result['error']:.4f})",
                'evidence': ae_result,
            })

        # Layer 4: Graph
        graph_result = self.graph_analyzer.check(transaction, graph_context)
        results['layers']['graph_analysis'] = graph_result
        results['flags'].extend(graph_result.get('flags', []))

        # ─── UNIFIED SCORE ────────────────────────────────
        # Weighted combination of all layers
        layer_scores = {
            'rule_engine': rule_result['score'] * 0.35,        # Rules are high-confidence
            'isolation_forest': if_result['score'] * 0.25,
            'autoencoder': ae_result['score'] * 0.20,
            'graph_analysis': graph_result['score'] * 0.20,
        }
        results['overall_score'] = sum(layer_scores.values())
        results['layer_contributions'] = layer_scores

        # ─── RECOMMENDED ACTION ───────────────────────────
        score = results['overall_score']
        has_critical = any(f['severity'] == 'critical' for f in results['flags'])

        if has_critical or score >= 0.85:
            results['recommended_action'] = 'block'
        elif score >= 0.65:
            results['recommended_action'] = 'hold'
        elif score >= 0.40:
            results['recommended_action'] = 'review'
        elif score >= 0.20:
            results['recommended_action'] = 'monitor'
        else:
            results['recommended_action'] = 'allow'

        return results


class FraudRuleEngine:
    """
    Deterministic rule-based fraud detection.
    These are hard-coded rules that catch obvious fraud patterns.
    Configurable thresholds make it adaptable.
    """

    def __init__(self):
        self.rules = [
            VelocityRule(max_tx_per_minute=3, max_tx_per_hour=20),
            AmountAnomalyRule(multiplier=5.0),
            TimeAnomalyRule(unusual_hours=(0, 5)),  # Midnight to 5am
            NewRecipientBurstRule(max_new_recipients_per_hour=5),
            RoundAmountRule(threshold=0.8),  # >80% round amounts is suspicious
            RapidSuccessionRule(min_gap_seconds=10),
            LargeFirstTransactionRule(percentile=95),
        ]

    def check(self, transaction: dict, user_history: list[dict]) -> dict:
        flags = []
        max_severity = 'low'

        for rule in self.rules:
            result = rule.evaluate(transaction, user_history)
            if result['triggered']:
                flags.append({
                    'code': result['code'],
                    'severity': result['severity'],
                    'description': result['description'],
                    'evidence': result['evidence'],
                })
                if self._severity_rank(result['severity']) > self._severity_rank(max_severity):
                    max_severity = result['severity']

        return {
            'flags': flags,
            'score': min(len(flags) * 0.25, 1.0),
            'max_severity': max_severity,
        }

    def _severity_rank(self, severity: str) -> int:
        return {'low': 1, 'medium': 2, 'high': 3, 'critical': 4}.get(severity, 0)


class VelocityRule:
    """Detect rapid-fire transactions (potential automated fraud)."""

    def __init__(self, max_tx_per_minute: int, max_tx_per_hour: int):
        self.max_per_minute = max_tx_per_minute
        self.max_per_hour = max_tx_per_hour

    def evaluate(self, transaction: dict, history: list[dict]) -> dict:
        tx_time = transaction['timestamp']
        last_minute = [t for t in history if (tx_time - t['timestamp']).total_seconds() <= 60]
        last_hour = [t for t in history if (tx_time - t['timestamp']).total_seconds() <= 3600]

        if len(last_minute) >= self.max_per_minute:
            return {
                'triggered': True,
                'code': 'VELOCITY_BREACH_MINUTE',
                'severity': 'high',
                'description': f'{len(last_minute) + 1} transactions in the last minute (limit: {self.max_per_minute})',
                'evidence': {'count': len(last_minute) + 1, 'window': '1_minute', 'limit': self.max_per_minute},
            }
        elif len(last_hour) >= self.max_per_hour:
            return {
                'triggered': True,
                'code': 'VELOCITY_BREACH_HOUR',
                'severity': 'medium',
                'description': f'{len(last_hour) + 1} transactions in the last hour (limit: {self.max_per_hour})',
                'evidence': {'count': len(last_hour) + 1, 'window': '1_hour', 'limit': self.max_per_hour},
            }
        return {'triggered': False}


class AmountAnomalyRule:
    """Detect transactions significantly larger than user's normal pattern."""

    def __init__(self, multiplier: float):
        self.multiplier = multiplier

    def evaluate(self, transaction: dict, history: list[dict]) -> dict:
        if not history:
            return {'triggered': False}

        avg_amount = np.mean([t['amount'] for t in history])
        std_amount = np.std([t['amount'] for t in history])

        if transaction['amount'] > avg_amount + self.multiplier * max(std_amount, avg_amount * 0.1):
            return {
                'triggered': True,
                'code': 'AMOUNT_ANOMALY',
                'severity': 'high' if transaction['amount'] > avg_amount * 10 else 'medium',
                'description': f"Amount K{transaction['amount']:,.2f} is {transaction['amount']/max(avg_amount,1):.1f}x the user's average of K{avg_amount:,.2f}",
                'evidence': {
                    'amount': transaction['amount'],
                    'user_average': float(avg_amount),
                    'user_std': float(std_amount),
                    'multiplier': transaction['amount'] / max(avg_amount, 1),
                },
            }
        return {'triggered': False}
```

## 4.2 Transaction Network Graph — The Visual Showpiece

This is the single most visually impressive thing in your entire project. Build it with D3.js:

```typescript
// components/visualizations/TransactionGraph.tsx

// This component renders a live, force-directed graph of transactions.
// Key visual features:
//
// 1. NODES represent users
//    - Size proportional to transaction volume
//    - Color indicates user type (individual=teal, merchant=copper, flagged=red)
//    - Glow effect on the currently-selected user
//    - Pulse animation on nodes that just transacted
//
// 2. EDGES represent transactions
//    - Thickness proportional to total amount between two users
//    - Animated particles travel along edges when a new transaction occurs
//    - Color: normal=gray, flagged=red with glow
//    - Direction shown by particle movement, not arrows (cleaner)
//
// 3. FRAUD VISUALIZATION
//    - When fraud is detected, the affected node emits a red shockwave
//    - Connected suspicious nodes get a red boundary
//    - Suspected rings (circular flows) get highlighted with a dashed red boundary
//
// 4. INTERACTIVITY
//    - Hover any node: tooltip with user summary
//    - Click any node: sidebar shows full profile + score
//    - Drag to rearrange
//    - Scroll to zoom
//    - Double-click to isolate a node's neighborhood
//
// IMPLEMENTATION APPROACH:
// - Use d3-force for physics simulation
// - Use canvas (not SVG) for performance with 500+ nodes
// - WebGL via Three.js if you want to go further (optional)
// - SSE connection for real-time transaction updates
//
// The graph should be the HERO element of the dashboard.
// Give it at minimum 500px height, ideally full viewport width.
// Dark background (sand-950) makes the glowing nodes pop dramatically.
```

---

# 5-9: REMAINING MODULE DEEP DIVES

[Due to length, I'll provide the critical upgrades for each remaining module in condensed form. Each follows the same pattern: Current Problem → Target State → Technical Implementation → Visual Design.]

## Module 3: Chatbot — Agentic Architecture

### Critical Upgrade: Claude Tool Use (Function Calling)

Instead of sending user messages directly to Claude and returning the response, define structured tools that Claude can call:

```typescript
// lib/ai/chatbot-tools.ts

const tools = [
  {
    name: "log_transaction",
    description: "Record a financial transaction (sale, purchase, expense) mentioned by the user",
    input_schema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["revenue", "expense", "cogs"] },
        category: { type: "string", description: "Business category like 'charcoal_sales', 'transport', 'rent'" },
        amount: { type: "number", description: "Amount in ZMW" },
        quantity: { type: "number", description: "Number of items if mentioned" },
        unit: { type: "string", description: "Unit if mentioned (bags, crates, kg)" },
        date: { type: "string", description: "ISO date, resolved from relative terms like 'yesterday'" },
        description: { type: "string" },
      },
      required: ["type", "category", "amount", "date"]
    }
  },
  {
    name: "get_financial_summary",
    description: "Retrieve the user's financial summary for a time period",
    input_schema: {
      type: "object",
      properties: {
        period: { type: "string", enum: ["today", "this_week", "this_month", "last_month", "custom"] },
        start_date: { type: "string" },
        end_date: { type: "string" },
      },
      required: ["period"]
    }
  },
  {
    name: "check_credit_score",
    description: "Check the user's current Ndalama credit score and what factors affect it",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "check_loan_eligibility",
    description: "Check what loans the user qualifies for and at what rates",
    input_schema: {
      type: "object",
      properties: {
        desired_amount: { type: "number" },
        purpose: { type: "string" },
      }
    }
  },
  {
    name: "get_savings_circle_status",
    description: "Get status of the user's Chilimba savings circles",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "generate_cash_flow_forecast",
    description: "Generate a 30-day cash flow forecast based on transaction history",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "get_restock_recommendation",
    description: "Based on sales patterns, recommend when and how much to restock",
    input_schema: {
      type: "object",
      properties: {
        product: { type: "string", description: "The product to check" }
      }
    }
  }
];

// System prompt for the chatbot (THIS IS CRITICAL — get it right)
const SYSTEM_PROMPT = `You are Ndalama AI, a financial advisor chatbot for market traders and small business owners in Zambia. You help users track their income and expenses through natural conversation, provide financial insights, and connect them with lending and savings services.

PERSONALITY:
- Warm, encouraging, and practical
- Celebrate wins ("Nice — you're 15% above last week!")
- Give actionable advice, not generic platitudes
- Use Zambian context (kwacha, market terminology)
- Keep responses concise — 2-3 sentences max unless asked for detail

TRANSACTION LOGGING:
- When a user mentions a sale, purchase, or expense, ALWAYS use the log_transaction tool
- Parse amounts: "150 pin" = K150, "2k" = K2,000
- Resolve dates: "yesterday" = actual date, "last Friday" = actual date
- Infer category from context: "sold charcoal" = category "charcoal_sales"
- After logging, always confirm with the running total

LANGUAGE:
- Default to English
- If user writes in Bemba or Nyanja, respond in that language
- Common terms: "pin" = kwacha, "ka" prefix = small amount

PROACTIVE INSIGHTS:
- After logging a transaction, compare to recent trends
- If revenue is up, celebrate it with the percentage
- If expenses are rising, gently flag it
- If they're close to a credit score milestone, mention it
- Suggest relevant actions: "You could qualify for a loan" or "Your savings circle contribution is due Friday"

NEVER:
- Give specific investment advice
- Promise loan approval
- Share other users' data
- Make up financial data — always use the tools to get real numbers`;
```

### Chat UI Upgrades

The chat interface should feel like WhatsApp, not a generic chatbot:

- **Message bubbles** with rounded corners, user on right (copper), bot on left (zambezi)
- **Inline charts**: When showing financial summaries, render small Recharts sparklines directly inside the message bubble
- **Quick reply chips** below the bot's message: "Show my balance", "Log a sale", "Check my score"
- **Voice input button** using Web Speech API (SpeechRecognition) — this is critical for market traders who may not be comfortable typing
- **Typing indicator** with three animated dots when waiting for Claude's response
- **Transaction confirmation cards**: When a transaction is logged, show a styled card with the details, an edit button, and a green checkmark animation

## Module 4: Lending Marketplace — Dynamic Pricing

### Critical Upgrade: Real-Time Rate Simulation

Build a rate calculator that updates instantly as any input changes:

```typescript
// lib/services/lending.service.ts

interface RateCalculationInput {
  creditScore: number;
  creditTier: string;
  monthlyRevenue: number;
  revenueGrowthRate: number;
  accountAgeDays: number;
  chilimbaReliabilityScore: number;
  chilimbaCirclesCompleted: number;
  hasBusinessPermit: boolean;
  sector: 'market_trading' | 'agriculture' | 'services' | 'transport' | 'other';
  season: 'harvest' | 'planting' | 'dry' | 'rainy';
  isRepeatBorrower: boolean;
  requestedAmount: number;
  requestedTermMonths: number;
}

interface RateBreakdown {
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
  comparisonToMarket: number;      // How much below/above market average
}

function calculateDynamicRate(input: RateCalculationInput): RateBreakdown {
  const BASE_RATE = 15.0;  // Zambian microfinance average annual rate

  // Credit score: -6% for Tier A, to +8% for Tier E
  const creditMap: Record<string, number> = {
    'A': -6.0, 'B': -3.5, 'C': 0, 'D': +3.0, 'E': +8.0
  };
  const creditAdj = creditMap[input.creditTier] || 0;

  // Revenue trend: growing business = lower risk
  let revenueAdj = 0;
  if (input.monthlyRevenue > 10000) revenueAdj -= 1.5;
  else if (input.monthlyRevenue > 5000) revenueAdj -= 0.8;
  if (input.revenueGrowthRate > 0.1) revenueAdj -= 1.0;
  else if (input.revenueGrowthRate < -0.1) revenueAdj += 1.5;

  // Account age: longer history = more trust
  let ageAdj = 0;
  if (input.accountAgeDays > 365) ageAdj = -2.0;
  else if (input.accountAgeDays > 180) ageAdj = -1.0;
  else if (input.accountAgeDays < 60) ageAdj = +2.0;

  // Chilimba backing: THIS IS YOUR UNIQUE VALUE PROPOSITION
  let chilimbaAdj = 0;
  if (input.chilimbaReliabilityScore > 0.9 && input.chilimbaCirclesCompleted >= 1) {
    chilimbaAdj = -2.5;  // Significant discount for proven savers
  } else if (input.chilimbaReliabilityScore > 0.7) {
    chilimbaAdj = -1.2;
  }

  // Sector risk
  const sectorMap: Record<string, number> = {
    'market_trading': 0, 'agriculture': +1.5, 'services': -0.5,
    'transport': +1.0, 'other': +0.5
  };
  const sectorAdj = sectorMap[input.sector] || 0;

  // Seasonal: farming loans riskier during planting season
  const seasonMap: Record<string, number> = {
    'harvest': -1.0, 'dry': 0, 'planting': +1.5, 'rainy': +0.5
  };
  const seasonAdj = seasonMap[input.season] || 0;

  // Repeat borrower: loyalty discount
  const repeatAdj = input.isRepeatBorrower ? -2.0 : 0;

  // Amount risk: larger loans = slightly higher rate
  let amountAdj = 0;
  if (input.requestedAmount > 20000) amountAdj = +1.5;
  else if (input.requestedAmount > 10000) amountAdj = +0.5;

  // Term: longer terms = slightly higher rate
  let termAdj = 0;
  if (input.requestedTermMonths > 12) termAdj = +1.0;
  else if (input.requestedTermMonths > 6) termAdj = +0.5;

  // Calculate final rate
  const rawRate = BASE_RATE + creditAdj + revenueAdj + ageAdj +
    chilimbaAdj + sectorAdj + seasonAdj + repeatAdj + amountAdj + termAdj;
  const finalRate = Math.max(6.0, Math.min(35.0, rawRate));

  // Monthly payment (simple interest for demonstration)
  const monthlyRate = finalRate / 100 / 12;
  const monthlyPayment = input.requestedAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, input.requestedTermMonths)) /
    (Math.pow(1 + monthlyRate, input.requestedTermMonths) - 1);
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
    comparisonToMarket: Math.round((BASE_RATE - finalRate) * 10) / 10,
  };
}
```

## Module 5: Heatmap — Geospatial Intelligence

### Critical Upgrades

1. **Real Zambia GeoJSON**: Use actual district boundaries for all 116 districts. Source: GADM database (gadm.org) has free Zambia administrative boundary shapefiles convertible to GeoJSON.

2. **Animated district fill**: On page load, districts color in one by one, province by province, with a staggered animation. This takes 2-3 seconds and looks cinematic.

3. **Layered data**: Toggle buttons to switch between: inclusion score, transaction density, mobile coverage, lending activity, savings participation. Each layer has its own color scale.

4. **AI recommendations**: For each district, generate an expansion recommendation using Claude API. Store these in the database. Display as floating cards when hovering.

5. **Time-lapse**: An animation slider that shows inclusion scores changing over time (use synthetic historical data). Judges love temporal visualizations.

6. **Dark map tiles**: Use CartoDB Dark Matter or Stadia Dark tiles. The colored districts pop dramatically against a dark base map.

## Module 6: Chilimba — Smart Savings Circles

### Critical Upgrades

1. **Payout optimization algorithm**: Instead of fixed round-robin, use an optimization that considers member urgency (from Module 2 spending patterns), reliability scores, and member preferences. Show both the default order and the AI-optimized order side by side.

2. **Default prediction model**: Logistic regression on features like recent spending increase, missed contribution history, income volatility. Show the risk gauge per member with a hover explanation.

3. **Group health visualization**: A radial/spider chart showing the circle's health across 6 dimensions: contribution rate, on-time %, member engagement, diversity, balance, and longevity.

4. **Completion certificates**: When a circle completes, generate a digital certificate (PDF or styled card) that the user can share. This feeds into their credit score as documented proof.

## Module 7: Document Intelligence — OCR Pipeline

### Critical Upgrades

1. **Visual processing pipeline**: Show bounding boxes appearing on the uploaded image in real-time. Use canvas overlays. Each field extracts with a typing animation.

2. **Dual-engine comparison**: Run both Tesseract.js and Claude Vision on the same document. Display confidence side by side. Use the higher-confidence result. This shows you understand model comparison.

3. **NRC-specific parser**: Build a template for Zambian NRC cards with known field positions. This dramatically improves accuracy over generic OCR.

4. **Confidence-based routing**: Fields above 0.90 confidence auto-accept (green). 0.70-0.90 flag for review (amber). Below 0.70 require manual entry (red). Show the color-coded confidence per field.

---

# 10. FRONTEND & DESIGN SYSTEM REVOLUTION

## 10.1 Design Identity — "Zambian Copper"

### Color System

```css
:root {
  /* ─── PRIMARY: ZAMBIAN COPPER ───────────────────── */
  --copper-50:  #fdf4ef;
  --copper-100: #fbe6d5;
  --copper-200: #f5c9a8;
  --copper-300: #eda671;
  --copper-400: #e47d3c;
  --copper-500: #d4611e;    /* Primary buttons, links, accents */
  --copper-600: #b84a15;
  --copper-700: #923714;
  --copper-800: #6e2c13;
  --copper-900: #4a1f0e;

  /* ─── NEUTRAL: WARM SAND ────────────────────────── */
  --sand-50:  #faf9f7;
  --sand-100: #f2f0ec;
  --sand-200: #e4e0d8;
  --sand-300: #cdc7bb;
  --sand-400: #ada396;
  --sand-500: #8e8274;
  --sand-600: #6b6258;
  --sand-700: #504940;
  --sand-800: #3d3730;
  --sand-900: #2a2520;
  --sand-950: #1a1714;     /* Primary dark background */

  /* ─── ACCENT: ZAMBEZI TEAL ──────────────────────── */
  --zambezi-50:  #eefbf9;
  --zambezi-100: #d5f5f0;
  --zambezi-200: #aee9e1;
  --zambezi-300: #78d6ca;
  --zambezi-400: #38b2a3;   /* Charts positive, success states */
  --zambezi-500: #2d9e90;
  --zambezi-600: #248278;

  /* ─── SEMANTIC ──────────────────────────────────── */
  --success: #3aba72;
  --warning: #e4a832;
  --danger:  #d94545;
  --info:    #4a90d9;

  /* ─── SURFACES (DARK MODE) ──────────────────────── */
  --bg-primary:    var(--sand-950);     /* Page background */
  --bg-secondary:  #221e1a;             /* Card backgrounds */
  --bg-tertiary:   #2d2824;             /* Hover states, elevated cards */
  --bg-input:      #332e29;             /* Input fields */
  --border-subtle: #3d3730;             /* Subtle borders */
  --border-default: #504940;            /* Default borders */

  /* ─── TEXT ──────────────────────────────────────── */
  --text-primary:   #f2f0ec;
  --text-secondary: #ada396;
  --text-tertiary:  #8e8274;
  --text-accent:    var(--copper-400);

  /* ─── TYPOGRAPHY ────────────────────────────────── */
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

  /* ─── EFFECTS ───────────────────────────────────── */
  --glow-copper: 0 0 20px rgba(212, 97, 30, 0.3);
  --glow-teal:   0 0 20px rgba(56, 178, 163, 0.3);
  --glow-danger:  0 0 20px rgba(217, 69, 69, 0.4);
  --grain: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}
```

### Typography Scale

```css
/* Headlines — DM Serif Display */
.text-display-xl { font-family: var(--font-display); font-size: 4.5rem; line-height: 1.0; letter-spacing: -0.02em; }  /* Credit score, hero numbers */
.text-display-lg { font-family: var(--font-display); font-size: 3rem; line-height: 1.1; letter-spacing: -0.01em; }    /* Page titles */
.text-display-md { font-family: var(--font-display); font-size: 2rem; line-height: 1.2; }                              /* Section headers */

/* Body — DM Sans */
.text-body-lg { font-family: var(--font-body); font-size: 1.125rem; line-height: 1.6; }
.text-body-md { font-family: var(--font-body); font-size: 1rem; line-height: 1.6; }
.text-body-sm { font-family: var(--font-body); font-size: 0.875rem; line-height: 1.5; }
.text-body-xs { font-family: var(--font-body); font-size: 0.75rem; line-height: 1.5; }

/* Numbers — JetBrains Mono (ALWAYS use for financial figures) */
.text-number-xl { font-family: var(--font-mono); font-size: 3rem; font-weight: 500; font-variant-numeric: tabular-nums; }
.text-number-lg { font-family: var(--font-mono); font-size: 1.5rem; font-weight: 500; font-variant-numeric: tabular-nums; }
.text-number-md { font-family: var(--font-mono); font-size: 1rem; font-weight: 400; font-variant-numeric: tabular-nums; }
```

## 10.2 Animation System

### Page Load Orchestration

Every page should have a choreographed entrance:

```typescript
// lib/animations/page-entrance.ts

// Use Framer Motion's staggerChildren for card grids
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,        // 80ms between each card
      delayChildren: 0.1,           // 100ms initial delay
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],  // Custom easing
    }
  }
};

// Number count-up animation for financial figures
// EVERY number on the dashboard should count up from 0, never just appear
const useCountUp = (target: number, duration: number = 1500) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);  // Ease-out cubic
      setCurrent(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return current;
};
```

### Credit Score Gauge Animation

```
The credit score should be displayed as an animated arc gauge:
- Semicircular arc from 0 to 1000
- Fills clockwise from left to right on page load
- Color gradient: red (0-349) → orange (350-499) → yellow (500-649) → teal (650-799) → green (800-1000)
- Large number in the center counts up as the arc fills
- Tier badge (A/B/C/D/E) fades in when the arc stops
- Subtle glow effect on the filled portion
- Particle effects at the endpoint (optional but impressive)

Build with SVG path + Framer Motion's pathLength animation
```

---

# 11. DATA ENGINEERING & SYNTHETIC DATA

## 11.1 Synthetic Data Strategy

Your synthetic data must be indistinguishable from real Zambian data during a demo. This means:

### User Generation Rules
- **Names**: Use actual Zambian names from the major ethnic groups (Bemba, Tonga, Lozi, Chewa, Kaonde). Mix first/last names realistically. Examples: Mwila Tembo, Grace Banda, Chishimba Mulenga, Natasha Phiri, Joseph Chanda.
- **NRC format**: XXX/XXX/XXX/X (6 digits, district code, sequential, check digit)
- **Phone numbers**: +260 97X XXX XXX (MTN) or +260 96X XXX XXX (Airtel)
- **Districts**: Use all 116 real districts, weighted by population. Lusaka and Copperbelt districts should have more users.
- **Gender**: 50/50 split with realistic name associations

### Transaction Generation Rules
- **Amounts**: Rounded to ZMW norms: K5, K10, K20, K50, K100, K200, K500, K1000
- **Types**: Realistic distribution: 40% P2P, 25% merchant payment, 15% bill pay, 10% airtime, 10% cash in/out
- **Timing**: Business hours for merchants, evening for P2P, monthly for bills
- **Patterns**: Market traders have daily small transactions. Salaried workers have monthly spikes. Agricultural workers have seasonal patterns.
- **Fraud injection**: 2-3% of transactions should be genuinely fraudulent (velocity attacks, round-tripping, amount anomalies). This gives your fraud detection something to find during the demo.

### Savings Circle Generation Rules
- **Names**: Contextual: "Lusaka Market Women's Circle", "St. Paul's Church Group", "Chipata Teachers' Union"
- **Sizes**: 8-15 members (typical for Zambian chilimba)
- **Contributions**: K100-K500 per week (realistic amounts)
- **Health variation**: Some circles at 0.95 health (perfect). Some at 0.60 (struggling). One at 0.40 (about to dissolve) — this creates drama for the demo.
- **Default injection**: 1-2 members per circle should have elevated default risk

---

# 12. SECURITY, PRIVACY & COMPLIANCE

Judges WILL ask about this. Have answers ready:

## 12.1 Data Protection
- All PII encrypted at rest (AES-256 via PostgreSQL pgcrypto)
- NRC numbers stored as salted hashes, not plaintext
- Document images encrypted in object storage
- API endpoints require JWT authentication
- Rate limiting on all endpoints (per user, per IP)

## 12.2 Bank of Zambia Alignment
- Reference the BOZ National Financial Inclusion Strategy 2017-2022 (and its successor)
- Reference the National Payment Systems Act
- Mention compliance with AML/KYC requirements
- Note that the platform supports BOZ's interoperability mandate

## 12.3 Fairness & Ethics
- Bias audit runs automatically on every model update
- No use of prohibited features (ethnicity, religion, marital status)
- SHAP explainability ensures no "black box" decisions
- Users can see exactly why they received their score
- Appeals process for disputed scores

---

# 13. PERFORMANCE & OPTIMIZATION

## 13.1 Critical Performance Targets

```
METRIC                      TARGET        WHY
──────────────────────────────────────────────────────
Dashboard initial load       < 2s         First impression with judges
Credit score calculation     < 500ms      Must feel instant in demo
Fraud detection latency      < 200ms      "Real-time" must feel real-time
Chatbot response time        < 3s         Natural conversation pace
Heatmap render               < 1.5s       Map should feel snappy
OCR processing               < 5s         Dramatically faster than manual
Transaction graph render     < 1s         Hero visual must load fast
Activity feed update         < 100ms      Real-time must be real-time
```

## 13.2 Optimization Techniques

1. **Redis caching**: Cache credit scores (5 min TTL), district metrics (15 min TTL), user profiles (2 min TTL)
2. **Database indexes**: Ensure compound indexes on (userId, timestamp) for all time-series queries
3. **Lazy loading**: Only load the transaction graph when user scrolls to it (IntersectionObserver)
4. **Pre-computed aggregates**: Run daily aggregation jobs that pre-compute monthly summaries, district metrics, etc.
5. **Image optimization**: Compress uploaded documents client-side before upload (canvas resize)
6. **SSR for initial load**: Use Next.js server components for the dashboard shell, client components for interactive elements

---

# 14. TESTING STRATEGY

## 14.1 What to Test (Hackathon Priority)

You don't need 100% coverage. Test the things that will break during the demo:

```
CRITICAL (must test):
  - Credit score calculation returns valid scores for all user types
  - Fraud detection correctly flags injected fraud in synthetic data
  - Chatbot correctly extracts transactions from natural language
  - Event bus correctly triggers cross-module reactions
  - Loan rate calculator produces sensible rates across all input ranges
  - OCR extracts fields from the demo NRC image

IMPORTANT (should test):
  - API endpoints handle missing/malformed data gracefully
  - Dashboard renders without errors for all demo personas
  - Activity feed correctly shows events from all modules
  - Heatmap renders with correct district data

NICE TO HAVE:
  - Edge cases in feature engineering (empty transaction history, etc.)
  - Load testing (not needed for hackathon)
  - Cross-browser testing (just use Chrome for demo)
```

## 14.2 Demo Rehearsal Checklist

Run through this checklist every day in Week 2:

```
□ Database is seeded with all demo personas
□ Mwila's NRC image uploads and processes correctly
□ Credit score gauge animates smoothly
□ SHAP waterfall chart shows correct factors
□ Fairness dashboard loads with meaningful data
□ Chatbot correctly logs "sold 3 bags charcoal 150 pin"
□ Chatbot correctly responds to "can I get a loan?"
□ Rate simulator sliders update rate in real time
□ Transaction graph renders with at least 200 nodes
□ Fraud detection catches at least one alert during demo
□ Activity feed shows cross-module events flowing
□ Heatmap renders all districts with colors
□ Heatmap hover shows AI recommendations
□ Savings circle page shows health gauge and member risks
□ All page transitions animate smoothly
□ No console errors in browser
□ All API calls return in < 3 seconds
□ Dark mode looks correct on projector (test with actual projector if possible)
```

---

# 15. DEMO CHOREOGRAPHY & PRESENTATION MASTERY

## 15.1 The Five-Minute Script (Revised, Minute by Minute)

### MINUTE 0:00 — THE HOOK (30 seconds)

**Visual**: Dark screen. Ndalama AI logo fades in. Subtle copper glow animation.

**Speaker**: "In Zambia, 7 million adults have never been inside a bank. They trade in markets. They save in circles. They send money through phones. But the financial system has a word for them: invisible."

*Pause. Let it land.*

"We built Ndalama AI to change that."

*Logo animation completes. Dashboard fades in.*

### MINUTE 0:30 — MWILA'S IDENTITY (60 seconds)

**Visual**: Document upload page. Pre-loaded NRC image ready.

**Speaker**: "Meet Mwila Tembo. She sells charcoal at Soweto Market. Let's give her a financial identity."

*Upload NRC photo. Bounding boxes animate around detected fields. Name, NRC number, date of birth extract one by one with green confidence badges. KYC: VERIFIED appears with a satisfying animation.*

"Four seconds. A bank takes four days and three visits."

*Click: Link mobile money. Show MTN + Airtel accounts connecting. Transaction count ticks up: 1,247 transactions synced.*

"1,247 transactions across two platforms, now unified in one place."

*Flash the transaction network graph: nodes and edges populating. Mwila's node highlighted in copper glow.*

### MINUTE 1:30 — HER FINANCIAL INTELLIGENCE (60 seconds)

**Visual**: Credit score page. Score gauge at zero.

**Speaker**: "Now the AI goes to work."

*Credit score gauge fills: 0... 200... 450... 650... 720. Color shifts from red to teal. Tier B badge appears.*

"720. Tier B. But the number isn't the point. The point is WHY."

*Click: SHAP waterfall chart expands. Animated bars appear one by one.*

"Regular transactions — she sells charcoal every day, rain or shine. That's worth 120 points. Her Chilimba savings circle? Perfect record, 12 out of 12 contributions on time. 85 more points. Three mobile money platforms? That shows financial sophistication. 45 points."

"But we also see risks: her account is only 8 months old, minus 30 points. And her balance swings a lot — that's another minus 20."

*Click: Switch to fairness dashboard*

"And here's what makes us different. We audit every score for bias. Male and female approval rates within 4 percentage points. Urban and rural scores within 28 points. We don't just score — we score fairly."

*Point to the threshold adjustment toggle*

"If we detect unfairness, this toggle adjusts thresholds in real-time to equalize outcomes."

### MINUTE 2:30 — THE LOAN (60 seconds)

**Visual**: Chatbot interface.

**Speaker**: "Mwila wants K5,000 for a chest freezer to store fish. She opens the advisor."

*Type: "I need 5000 for a freezer to sell fish"*

*Bot responds: checks eligibility, shows her credit tier, auto-generates financial summary from 3 months of chatbot-logged transactions, presents 3 loan offers.*

"Three lenders competing for her business. Let me show you how the rate is calculated."

*Switch to rate simulator. Show the breakdown: base rate 15%, credit score brings it down 3.5%, Chilimba backing drops it another 2.5%, but seasonal adjustment adds 0.5%.*

"Final rate: 9.5%. Half of what she'd pay on the street."

*Drag the credit score slider up to 800. Rate drops to 7.2%. Drag Chilimba toggle off. Rate jumps to 12%.*

"Every factor is transparent. Every adjustment is explainable."

### MINUTE 3:30 — THE LIVING PLATFORM (45 seconds)

**Visual**: Main dashboard with activity feed.

**Speaker**: "But Ndalama isn't seven features. It's one living system."

*Point to the activity feed, which has been running throughout the demo. New events have been appearing: transactions, score updates, circle contributions.*

"Watch what happens when we simulate a suspicious transaction."

*Click a button that triggers a simulated fraud transaction. The activity feed shows: Transaction created → Fraud alert (red pulse) → Credit score frozen → Loan application paused. All in 2 seconds.*

"One fraudulent transaction, and four modules react instantly. That's not a feature list — that's a nervous system."

### MINUTE 4:15 — THE BIG PICTURE (30 seconds)

**Visual**: Heatmap.

*Map of Zambia renders with districts coloring in one by one, province by province. Staggered animation.*

"Zoom out. This is Zambia."

*Toggle to inclusion score view. Hot spots and cold spots visible.*

"Lusaka is well-served. But look at Mpika."

*Click Mpika. Card appears: "Inclusion Score: 34/100. High mobile penetration, low fintech adoption. Recommendation: Deploy 4 agents. Predicted 2,400 new users in 6 months."*

"Every transaction on our platform makes this map smarter."

### MINUTE 4:45 — THE CLOSE (15 seconds)

**Visual**: Simple slide or dashboard view.

**Speaker**: "Mwila got her loan. She bought her freezer. Her revenue grew 40% in three months. Her score is now 810. Tier A."

*Pause.*

"She's not invisible anymore."

*Pause. 3 seconds of silence.*

"Ndalama AI. Because every kwacha tells a story."

*Silence. Don't speak. Let the judges come to you.*

## 15.2 Q&A Preparation

### Questions Judges Will Ask (with prepared answers)

**"How does this handle offline users / areas with no internet?"**
"Great question. We've designed for a USSD fallback. A user can text *384*1# and interact with the chatbot via structured menus. Transactions sync when connectivity returns. The architecture supports asynchronous event processing for exactly this reason."

**"What about data privacy? You're handling NRCs and financial data."**
"All PII is encrypted at rest with AES-256. NRC numbers are stored as salted hashes — we can verify but never expose them. We align with the Bank of Zambia's National Payment Systems Act and the Data Protection Act of 2021. Users can see and delete their data at any time."

**"How would you monetize this?"**
"Three revenue streams. First, a 0.3% transaction fee on cross-platform reconciliation — users save more than that in avoided discrepancies. Second, a subscription for lenders who want access to our credit scores and the marketplace — K500/month for basic, K2,000 for premium analytics. Third, API access for banks and fintechs who want to integrate our scoring engine."

**"What's your model's AUC?"**
"On our synthetic test set, the ensemble achieves an AUC-ROC of 0.87 with a Brier score of 0.14, which indicates good calibration. The XGBoost component alone gets 0.84, so the ensemble adds about 3 points. We'd expect real-world performance to be slightly lower pending validation on actual Zambian mobile money data."

**"How is this different from existing solutions like Tala or Branch?"**
"Three key differentiators. First, Chilimba integration — no one else is using savings circle behavior as a credit signal. Second, cross-platform reconciliation — we unify MTN, Airtel, and Zoona into one view, which matters because 40% of Zambian mobile money users use multiple platforms. Third, the fairness audit — we're the only solution that actively monitors and mitigates demographic bias in credit scoring."

**"How do you handle model drift / retraining?"**
"The system is designed for continuous learning. Every loan outcome — repayment or default — feeds back into the training data. We retrain the ensemble monthly, with automated checks that compare new model performance against the current production model. If the new model's AUC drops by more than 2%, it's flagged for manual review before deployment."

---

# 16. RISK MITIGATION & CONTINGENCY PLANS

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Live demo crashes | Medium | Critical | Record a backup video. Have screenshots in a slide deck. Practice the exact click sequence 10+ times. |
| Internet fails during demo | Medium | Critical | Run everything locally (Docker). Pre-cache map tiles. Have the ML service running locally. |
| Judge asks a question you can't answer | High | Medium | Be honest: "That's a great question. We haven't implemented that yet, but our architecture supports it because [X]. It's on our roadmap." Never bluff. |
| ML model gives weird results for a demo user | Low | High | Pre-validate all demo persona outputs. Hard-code fallback scores for the 5 demo users if needed. |
| Database gets corrupted between practice and demo | Low | High | Have a one-command seed script: `npm run seed:demo`. Run it 30 minutes before presenting. |
| Team member gets sick | Low | Medium | Every team member should be able to demo at least 2 modules. Cross-train. |
| Time runs out during demo | Medium | High | Prioritize: Hook → Score → Loan → Heatmap. Drop the fraud simulation and Chilimba detail if needed. The core story is "unbanked person gets a loan." |

---

# 17. DAY-BY-DAY EXECUTION TIMELINE

## WEEK 1: BUILD THE ENGINE

### Day 1: Feature Engineering Foundation
- Morning: Implement all 9 feature categories in Python (volume, regularity, network, balance, cross-platform, chilimba, identity, business, loan history)
- Afternoon: Build the feature aggregator that combines all categories
- Evening: Write the synthetic data generator that creates realistic Zambian data
- **Deliverable**: Feature engineering pipeline that takes a user ID and returns 107+ features

### Day 2: Model Training
- Morning: Generate synthetic training data (10,000 users with labels)
- Afternoon: Train XGBoost, LightGBM, and Logistic Regression
- Evening: Implement the ensemble with Platt calibration
- **Deliverable**: Trained ensemble model saved to disk, evaluation metrics documented

### Day 3: Explainability & Fairness
- Morning: Integrate SHAP with the XGBoost component
- Afternoon: Build the FairnessAuditor class with all three metric families
- Evening: Generate fairness reports on synthetic data, validate threshold adjustment works
- **Deliverable**: SHAP waterfall data per user, fairness report JSON

### Day 4: Fraud Detection System
- Morning: Build the rule engine with all 7 rules
- Afternoon: Train Isolation Forest on normal transactions, inject anomalies, validate detection
- Evening: Build the graph fraud analyzer (ring detection, suspicious clusters)
- **Deliverable**: Multi-layer fraud detector that correctly flags injected fraud

### Day 5: Chatbot Agentic Upgrade
- Morning: Define all Claude tools (log_transaction, check_score, etc.)
- Afternoon: Build the tool execution handlers that create database records
- Evening: Write and test the system prompt, validate structured extraction accuracy
- **Deliverable**: Chatbot that correctly extracts and logs transactions from natural language

### Day 6: Event Bus & Cross-Module Wiring
- Morning: Implement the EventBus class with Redis pub/sub
- Afternoon: Wire all cross-module handlers (transaction→fraud→credit→lending chain)
- Evening: Build the SSE endpoint and activity log persistence
- **Deliverable**: End-to-end event flow: create a transaction → see fraud check → see credit update → see loan rate change

### Day 7: Integration Testing & Bug Fixing
- Morning: Run through all 5 demo personas end-to-end
- Afternoon: Fix any cross-module communication issues
- Evening: Performance profiling — ensure all targets are met
- **Deliverable**: All 7 modules communicating correctly, all demo personas producing valid data

## WEEK 2: BUILD THE EXPERIENCE

### Day 8: Design System Implementation
- Morning: Set up CSS variables, fonts (DM Serif Display, DM Sans, JetBrains Mono), dark mode
- Afternoon: Build core UI components with new design: cards, buttons, inputs, badges
- Evening: Replace shadcn defaults across all pages with new design system
- **Deliverable**: Consistent Zambian Copper design across all pages

### Day 9: Hero Visualizations — Credit Score & Transaction Graph
- Morning: Build the SVG credit score gauge with Framer Motion animation
- Afternoon: Build the SHAP waterfall chart component
- Evening: Start the D3.js transaction network graph (node rendering + force layout)
- **Deliverable**: Animated credit score page, basic transaction graph

### Day 10: Transaction Graph & Heatmap
- Morning: Complete the transaction graph (edges, particles, fraud animations)
- Afternoon: Build the Zambia heatmap with Leaflet + real GeoJSON + dark tiles
- Evening: Add district hover cards, staggered fill animation, layer toggles
- **Deliverable**: Live transaction graph with fraud pulses, animated Zambia heatmap

### Day 11: Activity Feed & Micro-Interactions
- Morning: Build the real-time activity feed component with SSE subscription
- Afternoon: Add page transition animations (Framer Motion AnimatePresence)
- Evening: Add count-up animations to all numbers, card entrance stagger animations
- **Deliverable**: Live activity feed on dashboard, polished page transitions

### Day 12: Chatbot UI & Rate Simulator Polish
- Morning: Redesign chatbot with WhatsApp-style bubbles, voice input button, quick reply chips
- Afternoon: Build the interactive rate simulator with animated breakdown bars
- Evening: Polish Chilimba page (health radar chart, member risk gauges, payout optimizer)
- **Deliverable**: Beautiful chatbot, interactive rate simulator, polished savings circles

### Day 13: Demo Data & Rehearsal
- Morning: Finalize all 5 demo personas with perfect data
- Afternoon: Full demo rehearsal (5 runs). Time each section. Identify rough spots.
- Evening: Fix any visual bugs found during rehearsal. Record backup video.
- **Deliverable**: Polished demo, backup video recorded

### Day 14: Final Preparation
- Morning: One final demo rehearsal. Polish any remaining visual issues.
- Afternoon: Prepare Q&A answers. Brief all team members on backup speaking roles.
- Evening: Rest. Sleep. Be sharp tomorrow.
- **Deliverable**: Team is rehearsed, rested, and ready to win.

---

# 18. COMPETITIVE INTELLIGENCE — HOW TO BEAT EVERY OTHER TEAM

## 18.1 What T20 Teams Will Build

Based on competitive analysis of hackathon submissions from top universities:

**The "Basic Fintech" team** will build a simple lending app with a basic credit score. No explainability, no fairness, no real ML. They'll have a clean UI but shallow AI. **Beat them with**: your ensemble model, SHAP explainability, and fairness audit.

**The "AI Showcase" team** will build something technically impressive but impractical. Maybe a GAN that generates synthetic financial data, or a transformer model for something. Cool tech, no user story. **Beat them with**: your narrative about Mwila, the real Zambian context, and the practical impact.

**The "Design-First" team** will have a beautiful UI with Figma-quality visuals but shallow backend logic. **Beat them with**: technical depth in Q&A. When judges probe, you have real models with real metrics.

**The "Seven Features" team** will build disconnected modules like your current state. **Beat them with**: the event bus, the activity feed, and the visible cross-module data flow.

## 18.2 Your Unfair Advantages

1. **Chilimba digitization** — No one else will think of this. It's culturally specific, technically interesting, and deeply relevant.

2. **Fairness audit with live adjustment** — This is an active research topic at top ML labs. Having it in a hackathon project is extraordinary.

3. **Transaction network graph** — The most memorable visual in the room. Judges will literally point at your screen and talk about it.

4. **The data flywheel** — When you explain that every module makes every other module smarter, judges understand platform thinking. This is what separates a project from a product.

5. **Zambian depth** — Real district names. Real NRC format. Real mobile money platforms. Real savings circle traditions. Real currency amounts. This shows you didn't just build generic fintech with "Africa" spray-painted on it.

---

*This document is your war plan. Follow it in order. Don't skip the integration layer. Don't settle for template UI. And when you stand up to present, remember: you're not demoing features. You're telling the story of Mwila Tembo, who went from invisible to Tier A.*

*Now go win.*