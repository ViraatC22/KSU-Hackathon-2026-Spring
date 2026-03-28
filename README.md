# Ndalama AI — Unified Financial Inclusion Super-Platform for Zambia

> **Ndalama** (meaning "money" in Chichewa/Nyanja) is an AI-powered financial inclusion platform that unifies mobile money reconciliation, alternative credit scoring, SME lending, savings circles, conversational financial advising, document processing, and geospatial intelligence into a single ecosystem — purpose-built for Zambia's fintech landscape.

---

## Table of Contents

- [Vision & Problem Statement](#vision--problem-statement)
- [Platform Architecture Overview](#platform-architecture-overview)
- [The 7 Modules & How They Connect](#the-7-modules--how-they-connect)
- [User Flows](#user-flows)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [AI/ML Pipeline](#aiml-pipeline)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Demo & Synthetic Data](#demo--synthetic-data)
- [Hackathon Presentation Strategy](#hackathon-presentation-strategy)

---

## Vision & Problem Statement

Zambia has ~70 fintech companies, yet financial services remain fragmented:

- **Mobile money silos**: MTN Money, Airtel Money, and Zoona don't interoperate seamlessly, creating reconciliation nightmares for businesses accepting multiple platforms.
- **Credit invisibility**: Millions of Zambians have no traditional credit history, locking them out of formal lending despite being active mobile money users.
- **SME funding gap**: Small businesses struggle to access capital because lenders can't assess their risk without conventional financial statements.
- **KYC friction**: Paper-based identity verification slows onboarding and excludes those in rural areas.
- **Informal savings at risk**: Chilimba (rotating savings circles) operate on trust with no digital trail, leading to disputes and defaults.
- **Blind expansion**: Fintech companies expand without data-driven insights into where underserved populations actually are.

**Ndalama AI solves all of these simultaneously** by creating a unified data layer that feeds every module, so insights from one service strengthen all the others.

---

## Platform Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                               │
│  Next.js Dashboard │ Mobile PWA │ WhatsApp/USSD Bot Interface       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Express/Fastify)                   │
│         Authentication │ Rate Limiting │ Request Routing             │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  MODULE APIs │  │  AI ENGINE   │  │  EVENT BUS   │
│  (7 modules) │  │  (ML models) │  │  (Real-time) │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └────────────────┬┘─────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    UNIFIED DATA LAYER                                │
│  PostgreSQL (core) │ Redis (cache/queue) │ S3/MinIO (documents)     │
└─────────────────────────────────────────────────────────────────────┘
```

### The Key Architectural Insight

Every module both **produces** and **consumes** data from the unified data layer. This creates a flywheel:

1. **Module 2** (Reconciliation) ingests mobile money transactions across MTN/Airtel/Zoona
2. **Module 1** (Credit Scoring) uses those unified transactions to build credit profiles
3. **Module 4** (Lending Marketplace) uses credit scores to price loans dynamically
4. **Module 7** (Document Processor) handles KYC for loan applications
5. **Module 3** (Chatbot Advisor) helps users track finances and auto-generates loan-ready reports
6. **Module 6** (Chilimba) tracks savings behavior that feeds back into credit scores
7. **Module 5** (Heatmap) aggregates all platform activity to identify underserved areas

---

## The 7 Modules & How They Connect

### Module 1: AI Credit Scoring Engine

**Purpose**: Score creditworthiness for the unbanked using alternative data.

**Inputs consumed**:
- Unified transaction history from Module 2 (Reconciliation)
- Savings circle participation data from Module 6 (Chilimba)
- Business financial summaries from Module 3 (Chatbot Advisor)
- KYC verification status from Module 7 (Document Processor)

**Outputs produced**:
- Credit score (0-1000 scale) with risk tier (A/B/C/D/E)
- Feature importance breakdown (explainability)
- Fairness audit report (bias metrics by gender, region, age)

**AI Components**:
- Gradient Boosted Trees (XGBoost/LightGBM) for scoring
- SHAP values for explainability
- Fairness metrics: demographic parity, equalized odds

**Key Features**:
- Transaction velocity analysis (frequency, regularity, growth trends)
- Utility payment consistency scoring
- Social graph signals (Chilimba group reliability)
- Airtime top-up pattern analysis
- Explainable AI dashboard showing why each score was assigned
- Bias detection that flags if model treats demographic groups unfairly

**Data Points for Scoring** (from alternative sources):
```
Transaction Features:
  - avg_monthly_volume         (from Module 2)
  - transaction_regularity     (from Module 2)
  - unique_counterparties      (from Module 2)
  - avg_balance_trend          (from Module 2)
  - cross_platform_activity    (from Module 2)

Behavioral Features:
  - airtime_topup_frequency    (simulated mobile data)
  - utility_payment_streak     (from Module 2)
  - savings_circle_reliability (from Module 6)
  - savings_contribution_rate  (from Module 6)

Business Features (if SME):
  - monthly_revenue_growth     (from Module 3)
  - expense_ratio              (from Module 3)
  - supplier_payment_timeliness (from Module 2)

Identity Features:
  - kyc_verified               (from Module 7)
  - document_confidence_score  (from Module 7)
  - account_age_days           (registration data)
```

---

### Module 2: Cross-Platform Mobile Money Reconciliation & Fraud Detection

**Purpose**: Unify transactions across MTN Money, Airtel Money, and Zoona into a single ledger with real-time fraud detection.

**Inputs consumed**:
- Simulated transaction feeds from each mobile money platform
- User identity mappings from Module 7 (Document Processor)

**Outputs produced**:
- Unified transaction ledger (consumed by ALL other modules)
- Fraud alerts and risk flags
- Cross-platform balance reconciliation
- Transaction flow analytics

**AI Components**:
- Isolation Forest for anomaly detection
- Autoencoder for transaction pattern learning
- Rule engine for velocity checks (configurable thresholds)

**Key Features**:
- Real-time transaction normalization across platforms
- Duplicate detection (same transaction reported by sender and receiver)
- Velocity attack detection (rapid-fire small transactions)
- Account takeover detection (unusual device/location patterns)
- Live transaction flow visualization (network graph)
- Reconciliation discrepancy alerts

**Transaction Schema** (unified format):
```json
{
  "tx_id": "NDA-2025-000001",
  "original_platform": "mtn_money",
  "original_tx_id": "MTN-TXN-84729",
  "sender": { "unified_id": "USR-001", "platform_id": "MTN-26097..." },
  "receiver": { "unified_id": "USR-042", "platform_id": "AIR-26097..." },
  "amount": 500.00,
  "currency": "ZMW",
  "type": "p2p_transfer",
  "timestamp": "2025-03-10T14:32:00Z",
  "fraud_score": 0.12,
  "flags": [],
  "reconciliation_status": "matched"
}
```

---

### Module 3: Conversational AI Financial Advisor (Chatbot)

**Purpose**: WhatsApp-style chatbot that acts as a personal CFO for market traders and SMEs.

**Inputs consumed**:
- User's unified transaction history from Module 2
- Credit score and recommendations from Module 1
- Savings circle status from Module 6
- Lending opportunities from Module 4

**Outputs produced**:
- Structured financial records (income/expense categorization)
- Cash flow forecasts
- Auto-generated financial statements (for loan applications in Module 4)
- Restock recommendations

**AI Components**:
- LLM (Claude API via Anthropic) for natural language understanding
- Intent classification for routing commands
- Time series forecasting for cash flow prediction (Prophet or simple ARIMA)

**Key Features**:
- Natural language transaction logging ("I sold 50kg maize for K200")
- Automatic categorization (revenue, COGS, operating expenses)
- Daily/weekly/monthly financial summaries
- Cash flow forecasting with visual charts
- Smart restock alerts ("Based on your sales trend, order maize by Friday")
- Auto-generates simplified financial statements for Module 4 loan applications
- Multi-language support (English, Bemba, Nyanja — at minimum prompt-level)

**Conversation Example**:
```
User: "Sold 3 bags of charcoal for 150 pin"
Bot:  "✓ Recorded: K150 revenue — Charcoal Sales
       Today's total: K450 | This week: K2,100
       📊 You're 12% above last week. Nice work!
       💡 At this rate, you'll need to restock by Thursday."

User: "How much can I borrow?"
Bot:  "Based on your trading history, your Ndalama Score is 720 (Tier B).
       You qualify for up to K5,000 at rates from 8-12% monthly.
       Want me to show you current offers on the marketplace?"
```

---

### Module 4: AI-Driven SME Lending Marketplace with Dynamic Risk Pricing

**Purpose**: Two-sided marketplace connecting SME borrowers with competing lenders, with AI-driven interest rate pricing.

**Inputs consumed**:
- Credit scores from Module 1
- Financial statements from Module 3 (Chatbot)
- KYC verification from Module 7
- Transaction history from Module 2
- Savings behavior from Module 6

**Outputs produced**:
- Loan listings with dynamic pricing
- Lender portfolio analytics
- Loan performance data (feeds back into Module 1 for model retraining)
- Geographic lending patterns (feeds Module 5 heatmap)

**AI Components**:
- Dynamic pricing model (adjusts rates based on real-time risk signals)
- Loan default prediction
- Portfolio risk optimization for lenders

**Key Features**:
- Borrower dashboard: apply for loans, see competing offers, track repayment
- Lender dashboard: browse vetted borrowers, set risk appetite, auto-fund
- Dynamic rate engine: rates adjust in real-time based on:
  - Credit score changes
  - Recent transaction volume trends
  - Seasonal business patterns (e.g., farming cycles)
  - Sector risk (market trading vs. services vs. agriculture)
- Loan simulation mode (for demo): judges can tweak parameters and watch rates shift
- Smart matching: pairs borrowers with lenders whose risk appetite aligns

**Pricing Model Variables**:
```
base_rate = 10%  (market baseline)

adjustments:
  + credit_score_adjustment    (-4% to +8% based on tier)
  + revenue_trend_adjustment   (-2% to +3%)
  + seasonal_adjustment        (-1% to +2% based on month)
  + sector_risk_adjustment     (-1% to +3%)
  + collateral_adjustment      (-3% to 0% if savings circle backed)
  + history_adjustment         (-2% to 0% for repeat borrowers)

final_rate = base_rate + sum(adjustments)
clamped to [6%, 25%] range
```

---

### Module 5: Predictive Financial Inclusion Heatmap

**Purpose**: Geospatial intelligence tool that identifies underserved areas and predicts where fintech expansion would have the highest impact.

**Inputs consumed**:
- User registration locations from all modules
- Transaction density from Module 2
- Lending activity from Module 4
- Agent/service point locations
- Population and connectivity data (static datasets)

**Outputs produced**:
- Interactive heatmap with inclusion scores by district
- Expansion recommendations with predicted user acquisition
- Underserved area alerts

**AI Components**:
- Geospatial clustering (DBSCAN/K-means on location data)
- Demand prediction model (regression on demographic + connectivity features)
- Opportunity scoring algorithm

**Key Features**:
- Interactive map of Zambia with district-level granularity (all 116 districts)
- Color-coded inclusion index (0-100) per district
- Layer toggles: population density, mobile coverage, existing agents, transaction volume
- AI-generated expansion recommendations:
  - "Deploy 3 agents in Mpika — predicted 2,400 new users in 6 months"
  - "Lundazi shows high mobile penetration but low fintech adoption — high opportunity"
- Time-series animation showing inclusion spreading over time
- Click any district for detailed breakdown

**Inclusion Score Calculation**:
```
inclusion_score = weighted_sum(
  mobile_money_penetration × 0.25,
  agent_density × 0.20,
  transaction_volume_per_capita × 0.20,
  credit_access_rate × 0.15,
  savings_group_participation × 0.10,
  internet_connectivity × 0.10
)
```

---

### Module 6: Chilimba Digital Savings Circle Platform

**Purpose**: Digitize Zambia's traditional rotating savings system (Chilimba) with AI-enhanced group management.

**Inputs consumed**:
- Member identity verification from Module 7 (KYC)
- Member credit scores from Module 1
- Transaction capabilities from Module 2 (cross-platform payments)

**Outputs produced**:
- Member reliability scores (feed into Module 1 credit scoring)
- Group savings data (feeds Module 5 heatmap)
- Savings history for loan qualification in Module 4
- Contribution pattern data

**AI Components**:
- Default risk prediction per member (logistic regression)
- Optimal payout order algorithm (considers financial urgency + reliability)
- NLP-powered dispute resolution suggestions
- Group health scoring

**Key Features**:
- Create/join digital savings circles with transparent rules
- Automated contribution tracking and reminders
- Smart payout ordering: AI optimizes who receives the pot based on:
  - Financial urgency signals (from Module 2 transaction data)
  - Reliability score (contribution history)
  - Member preferences
- Default risk early warning ("Member X has 78% chance of missing next contribution")
- Group health dashboard (contribution rate, on-time %, engagement)
- Dispute resolution: NLP analyzes member complaints and suggests fair resolutions
- Circle completion certificates (boost credit score in Module 1)

**Savings Circle Schema**:
```json
{
  "circle_id": "CHI-2025-001",
  "name": "Lusaka Market Women's Circle",
  "members": 12,
  "contribution_amount": 200,
  "currency": "ZMW",
  "frequency": "weekly",
  "current_round": 5,
  "total_rounds": 12,
  "health_score": 0.87,
  "next_payout_to": "USR-007",
  "ai_suggested_order": ["USR-003", "USR-011", "USR-007", "..."]
}
```

---

### Module 7: AI Document Processor for KYC & Loan Applications

**Purpose**: Computer vision system that extracts data from identity documents and business records to automate KYC and loan paperwork.

**Inputs consumed**:
- Uploaded document images (NRCs, business permits, receipts)
- Loan application forms from Module 4

**Outputs produced**:
- Extracted identity data (consumed by all modules for user verification)
- KYC verification status and confidence scores
- Auto-filled loan application data for Module 4
- Document authenticity flags

**AI Components**:
- OCR (Tesseract + preprocessing pipeline)
- Document classification model (ID card vs. receipt vs. business permit)
- Named Entity Recognition for field extraction
- Confidence scoring per extracted field

**Key Features**:
- Upload NRC (National Registration Card) → auto-extract name, NRC number, DOB, address
- Upload business permit → extract business name, registration number, type
- Upload handwritten receipts → extract amounts, dates, item descriptions
- Auto-fill loan applications with extracted data
- Confidence score per field (green/yellow/red)
- Human review queue for low-confidence extractions
- Batch processing for multiple documents
- Fraud detection: flag altered/inconsistent documents

**Extraction Pipeline**:
```
Image Upload
    → Preprocessing (deskew, denoise, contrast enhancement)
    → Document Classification (what type of document?)
    → Region Detection (where are the fields?)
    → OCR (extract text from each region)
    → NER (identify entities: name, date, number, amount)
    → Validation (cross-check extracted fields)
    → Confidence Scoring (per field)
    → Output structured data + flags
```

---

## User Flows

### Flow 1: New User Onboarding
```
1. User downloads app / opens web portal
2. Uploads NRC photo → Module 7 extracts & verifies identity
3. Links mobile money accounts (MTN/Airtel/Zoona) → Module 2 begins syncing
4. Module 1 generates initial credit score from transaction history
5. Dashboard shows score, savings circle invites, and lending eligibility
6. Module 3 chatbot welcomes user and offers guided tour
```

### Flow 2: Market Trader Gets a Loan
```
1. Trader uses Module 3 chatbot daily: "Sold 20 tomato crates for K400"
2. Over weeks, Module 3 builds financial statements automatically
3. Module 2 reconciles her MTN + Airtel transactions
4. Module 1 credit score rises to 680 (Tier B)
5. Trader asks chatbot: "Can I get a loan for K3,000?"
6. Chatbot triggers Module 7 to process her business permit
7. Application auto-filled, sent to Module 4 lending marketplace
8. Three lenders compete → she picks the best rate (9.2%)
9. Loan disbursed via Module 2 to her preferred mobile money
10. Repayment tracked, feeds back into Module 1 score
```

### Flow 3: Savings Circle Lifecycle
```
1. Group leader creates circle in Module 6 with 10 members
2. Each member verified through Module 7 (KYC)
3. Weekly contributions tracked, reminders sent
4. Module 6 AI detects Member X spending more than usual (via Module 2)
5. Early warning: "Member X has elevated default risk"
6. Group leader intervenes early
7. AI optimizes payout order for remaining rounds
8. Circle completes → all members get reliability boost in Module 1
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Main dashboard, SSR, API routes |
| **TypeScript** | Type safety across the full stack |
| **Tailwind CSS** | Styling (utility-first, fast prototyping) |
| **shadcn/ui** | Pre-built accessible UI components |
| **Recharts** | Charts for financial data, credit scores |
| **Leaflet.js + React-Leaflet** | Interactive maps for Module 5 heatmap |
| **Framer Motion** | Animations for data transitions |

### Backend
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | REST API endpoints (co-located with frontend) |
| **Prisma** | ORM for PostgreSQL, type-safe queries |
| **PostgreSQL** | Primary database (users, transactions, loans, scores) |
| **Redis** | Caching, real-time pub/sub for fraud alerts |
| **Bull/BullMQ** | Background job queue (credit scoring, OCR processing) |

### AI/ML Layer
| Technology | Purpose |
|---|---|
| **Python (FastAPI)** | ML model serving microservice |
| **scikit-learn** | Credit scoring model (XGBoost/LightGBM) |
| **SHAP** | Model explainability |
| **Tesseract.js** (or Python Tesseract) | OCR for document processing |
| **Anthropic Claude API** | Chatbot NLP, document understanding, dispute resolution |
| **Prophet / statsmodels** | Cash flow time series forecasting |

### Infrastructure & Tooling
| Technology | Purpose |
|---|---|
| **Docker + Docker Compose** | Local dev environment, all services |
| **Vercel** | Frontend deployment |
| **Railway / Render** | Backend + ML service deployment |
| **MinIO** (or S3) | Document/image storage |
| **Zod** | Runtime validation for API inputs |
| **NextAuth.js** | Authentication |

### Why This Stack?
- **Next.js** lets you build the API and frontend together — fewer repos, faster hackathon velocity
- **Prisma + PostgreSQL** gives you a typed, relational data layer that handles complex joins (transactions × users × circles × loans)
- **Python FastAPI sidecar** keeps ML models in their native ecosystem while the main app stays in TypeScript
- **Claude API** handles the hardest NLP tasks (chatbot, dispute resolution, document understanding) without training custom models

---

## Project Structure

```
ndalama-ai/
├── README.md
├── docker-compose.yml
├── .env.example
│
├── apps/
│   └── web/                          # Next.js application
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Landing / login
│       │   ├── dashboard/
│       │   │   ├── page.tsx          # Main dashboard (overview of all modules)
│       │   │   ├── credit-score/     # Module 1: Credit scoring views
│       │   │   │   ├── page.tsx      # Score overview + explainability
│       │   │   │   └── bias-audit/
│       │   │   │       └── page.tsx  # Fairness metrics
│       │   │   ├── transactions/     # Module 2: Reconciliation
│       │   │   │   ├── page.tsx      # Unified ledger view
│       │   │   │   └── fraud/
│       │   │   │       └── page.tsx  # Fraud detection dashboard
│       │   │   ├── advisor/          # Module 3: Chatbot
│       │   │   │   └── page.tsx      # Chat interface
│       │   │   ├── lending/          # Module 4: Marketplace
│       │   │   │   ├── page.tsx      # Borrower view
│       │   │   │   ├── lender/
│       │   │   │   │   └── page.tsx  # Lender view
│       │   │   │   └── simulator/
│       │   │   │       └── page.tsx  # Rate simulation
│       │   │   ├── heatmap/          # Module 5: Geospatial
│       │   │   │   └── page.tsx      # Interactive map
│       │   │   ├── chilimba/         # Module 6: Savings circles
│       │   │   │   ├── page.tsx      # My circles
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx  # Circle detail
│       │   │   └── documents/        # Module 7: KYC
│       │   │       └── page.tsx      # Upload & verification
│       │   └── api/
│       │       ├── auth/             # NextAuth routes
│       │       ├── credit/           # Module 1 API
│       │       ├── transactions/     # Module 2 API
│       │       ├── chat/             # Module 3 API
│       │       ├── lending/          # Module 4 API
│       │       ├── heatmap/          # Module 5 API
│       │       ├── chilimba/         # Module 6 API
│       │       └── documents/        # Module 7 API
│       ├── components/
│       │   ├── ui/                   # shadcn components
│       │   ├── dashboard/            # Shared dashboard components
│       │   ├── charts/               # Recharts wrappers
│       │   ├── map/                  # Leaflet map components
│       │   └── chat/                 # Chatbot UI components
│       ├── lib/
│       │   ├── prisma.ts             # Prisma client
│       │   ├── ai/
│       │   │   ├── claude.ts         # Claude API client
│       │   │   ├── credit-model.ts   # Credit scoring logic
│       │   │   └── fraud-detect.ts   # Fraud detection logic
│       │   ├── utils/
│       │   │   ├── zambia-data.ts    # Districts, currencies, names
│       │   │   └── synthetic.ts      # Synthetic data generators
│       │   └── constants.ts
│       ├── prisma/
│       │   ├── schema.prisma         # Database schema
│       │   └── seed.ts               # Seed with synthetic Zambian data
│       ├── public/
│       │   └── zambia-districts.geojson  # Map data
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── services/
│   └── ml-engine/                    # Python ML microservice
│       ├── main.py                   # FastAPI app
│       ├── models/
│       │   ├── credit_scorer.py      # XGBoost model
│       │   ├── fraud_detector.py     # Isolation forest
│       │   ├── cashflow_forecast.py  # Prophet/ARIMA
│       │   └── document_ocr.py       # Tesseract pipeline
│       ├── explainability/
│       │   └── shap_explainer.py     # SHAP value computation
│       ├── fairness/
│       │   └── bias_audit.py         # Demographic parity checks
│       ├── data/
│       │   └── synthetic_generator.py # Generate Zambian training data
│       ├── requirements.txt
│       └── Dockerfile
│
├── data/
│   ├── zambia-districts.geojson      # GeoJSON for all 116 districts
│   ├── sample-nrc.png                # Sample NRC for OCR demo
│   ├── sample-receipt.png            # Sample handwritten receipt
│   └── seed/
│       ├── users.json                # 500 synthetic Zambian users
│       ├── transactions.json         # 50,000 synthetic transactions
│       ├── circles.json              # 30 synthetic savings circles
│       └── loans.json                # 200 synthetic loan applications
│
└── docs/
    ├── architecture.md
    ├── api-reference.md
    └── demo-script.md                # Hackathon demo walkthrough
```

---

## Database Schema

### Core Tables (Prisma schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS & IDENTITY ───────────────────────────────

model User {
  id              String    @id @default(cuid())
  name            String
  phone           String    @unique
  email           String?   @unique
  nrcNumber       String?   @unique       // National Registration Card
  district        String                  // Zambian district
  province        String                  // Zambian province
  gender          String?
  dateOfBirth     DateTime?
  kycStatus       KycStatus @default(PENDING)
  kycConfidence   Float?                  // 0.0 - 1.0
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  mobileAccounts  MobileAccount[]
  creditScore     CreditScore?
  transactions    Transaction[]          // as sender
  received        Transaction[]          @relation("receiver")
  loanApplications LoanApplication[]
  circleMemberships CircleMembership[]
  documents       Document[]
  chatMessages    ChatMessage[]
  financialRecords FinancialRecord[]
}

enum KycStatus {
  PENDING
  VERIFIED
  FAILED
  MANUAL_REVIEW
}

model MobileAccount {
  id          String   @id @default(cuid())
  userId      String
  platform    MobilePlatform
  platformId  String   @unique           // MTN/Airtel/Zoona account ID
  isActive    Boolean  @default(true)
  linkedAt    DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}

enum MobilePlatform {
  MTN_MONEY
  AIRTEL_MONEY
  ZOONA
}

// ─── MODULE 2: TRANSACTIONS & RECONCILIATION ────────

model Transaction {
  id                  String    @id @default(cuid())
  ndalamaId           String    @unique     // NDA-2025-XXXXXX
  originalPlatform    MobilePlatform
  originalTxId        String
  senderId            String
  receiverId          String
  amount              Decimal   @db.Decimal(12, 2)
  currency            String    @default("ZMW")
  type                TxType
  category            String?               // auto-categorized
  timestamp           DateTime
  fraudScore          Float     @default(0)
  fraudFlags          String[]              // array of flag codes
  reconciliationStatus ReconciliationStatus @default(PENDING)
  createdAt           DateTime  @default(now())

  sender              User      @relation(fields: [senderId], references: [id])
  receiver            User      @relation("receiver", fields: [receiverId], references: [id])
}

enum TxType {
  P2P_TRANSFER
  MERCHANT_PAYMENT
  BILL_PAYMENT
  AIRTIME_PURCHASE
  CASH_IN
  CASH_OUT
  SALARY
  LOAN_DISBURSEMENT
  LOAN_REPAYMENT
  SAVINGS_CONTRIBUTION
  SAVINGS_PAYOUT
}

enum ReconciliationStatus {
  PENDING
  MATCHED
  DISCREPANCY
  FLAGGED
}

// ─── MODULE 1: CREDIT SCORING ───────────────────────

model CreditScore {
  id                  String   @id @default(cuid())
  userId              String   @unique
  score               Int                   // 0-1000
  tier                CreditTier
  transactionScore    Float                 // component scores
  behavioralScore     Float
  businessScore       Float?
  identityScore       Float
  factors             Json                  // SHAP-style feature importance
  fairnessFlags       String[]
  calculatedAt        DateTime @default(now())
  expiresAt           DateTime              // scores refresh periodically

  user                User     @relation(fields: [userId], references: [id])
}

enum CreditTier {
  A   // 800-1000: Excellent
  B   // 650-799: Good
  C   // 500-649: Fair
  D   // 350-499: Below Average
  E   // 0-349: Limited History
}

// ─── MODULE 4: LENDING MARKETPLACE ──────────────────

model LoanApplication {
  id              String    @id @default(cuid())
  borrowerId      String
  amount          Decimal   @db.Decimal(12, 2)
  purpose         String
  term            Int                       // months
  status          LoanStatus @default(OPEN)
  creditScoreAt   Int                       // snapshot at application time
  createdAt       DateTime  @default(now())

  borrower        User      @relation(fields: [borrowerId], references: [id])
  offers          LoanOffer[]
  acceptedOffer   LoanOffer? @relation("accepted")
}

model LoanOffer {
  id              String    @id @default(cuid())
  applicationId   String
  lenderId        String
  interestRate    Float                     // annual %
  rateBreakdown   Json                      // shows how rate was calculated
  maxAmount       Decimal   @db.Decimal(12, 2)
  status          OfferStatus @default(PENDING)
  createdAt       DateTime  @default(now())

  application     LoanApplication @relation(fields: [applicationId], references: [id])
  acceptedFor     LoanApplication? @relation("accepted")
}

enum LoanStatus {
  OPEN
  FUNDED
  REPAYING
  COMPLETED
  DEFAULTED
}

enum OfferStatus {
  PENDING
  ACCEPTED
  REJECTED
  EXPIRED
}

// ─── MODULE 6: CHILIMBA SAVINGS CIRCLES ─────────────

model SavingsCircle {
  id                  String    @id @default(cuid())
  name                String
  contributionAmount  Decimal   @db.Decimal(12, 2)
  currency            String    @default("ZMW")
  frequency           Frequency
  totalRounds         Int
  currentRound        Int       @default(1)
  healthScore         Float     @default(1.0)
  status              CircleStatus @default(ACTIVE)
  createdAt           DateTime  @default(now())

  members             CircleMembership[]
  payouts             CirclePayout[]
}

model CircleMembership {
  id              String    @id @default(cuid())
  circleId        String
  userId          String
  role            CircleRole @default(MEMBER)
  reliabilityScore Float    @default(0.5)
  defaultRisk     Float     @default(0.2)
  joinedAt        DateTime  @default(now())

  circle          SavingsCircle @relation(fields: [circleId], references: [id])
  user            User          @relation(fields: [userId], references: [id])

  @@unique([circleId, userId])
}

model CirclePayout {
  id          String   @id @default(cuid())
  circleId    String
  round       Int
  recipientId String
  amount      Decimal  @db.Decimal(12, 2)
  paidAt      DateTime?
  status      PayoutStatus @default(SCHEDULED)

  circle      SavingsCircle @relation(fields: [circleId], references: [id])
}

enum Frequency {
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
}

enum CircleStatus {
  ACTIVE
  COMPLETED
  PAUSED
  DISSOLVED
}

enum CircleRole {
  LEADER
  MEMBER
}

enum PayoutStatus {
  SCHEDULED
  PAID
  MISSED
}

// ─── MODULE 7: DOCUMENT PROCESSING ──────────────────

model Document {
  id              String   @id @default(cuid())
  userId          String
  type            DocType
  fileUrl         String
  extractedData   Json?                     // structured extraction result
  confidence      Float?                    // overall confidence 0-1
  fieldConfidences Json?                    // per-field confidence
  verificationStatus DocVerification @default(PROCESSING)
  processingErrors String[]
  uploadedAt      DateTime @default(now())
  processedAt     DateTime?

  user            User     @relation(fields: [userId], references: [id])
}

enum DocType {
  NRC                 // National Registration Card
  BUSINESS_PERMIT
  RECEIPT
  BANK_STATEMENT
  UTILITY_BILL
  OTHER
}

enum DocVerification {
  PROCESSING
  VERIFIED
  REJECTED
  MANUAL_REVIEW
}

// ─── MODULE 3: CHATBOT RECORDS ──────────────────────

model ChatMessage {
  id          String   @id @default(cuid())
  userId      String
  role        String                        // user | assistant
  content     String
  intent      String?                       // classified intent
  entities    Json?                         // extracted entities
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}

model FinancialRecord {
  id          String   @id @default(cuid())
  userId      String
  type        String                        // revenue | expense | cogs
  category    String                        // e.g., "charcoal_sales", "transport"
  amount      Decimal  @db.Decimal(12, 2)
  currency    String   @default("ZMW")
  description String?
  date        DateTime
  source      String   @default("chatbot")  // chatbot | manual | auto
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}

// ─── MODULE 5: GEOSPATIAL DATA ──────────────────────

model DistrictMetrics {
  id                      String   @id @default(cuid())
  districtName            String   @unique
  province                String
  latitude                Float
  longitude               Float
  population              Int
  mobileMoneyPenetration  Float    // 0-1
  agentDensity            Float    // agents per 1000 people
  txVolumePerCapita       Float
  creditAccessRate        Float    // 0-1
  savingsParticipation    Float    // 0-1
  internetConnectivity    Float    // 0-1
  inclusionScore          Float    // calculated 0-100
  aiRecommendation        String?  // AI-generated expansion advice
  updatedAt               DateTime @updatedAt
}
```

---

## API Design

### REST API Endpoints

```
AUTH
  POST   /api/auth/register          Register new user
  POST   /api/auth/login             Login (phone + OTP)
  GET    /api/auth/me                Current user profile

MODULE 1 — CREDIT SCORING
  GET    /api/credit/score           Get current user's credit score
  GET    /api/credit/score/:userId   Get any user's score (lender access)
  GET    /api/credit/explain/:userId SHAP explanation for score
  GET    /api/credit/bias-audit      Fairness metrics across demographics
  POST   /api/credit/recalculate     Trigger score recalculation

MODULE 2 — TRANSACTIONS
  GET    /api/transactions           List unified transactions (filterable)
  GET    /api/transactions/:id       Single transaction detail
  GET    /api/transactions/summary   Aggregate stats (volume, count, trends)
  GET    /api/transactions/fraud     Fraud alerts and flagged transactions
  POST   /api/transactions/simulate  Add simulated transactions (demo mode)

MODULE 3 — CHATBOT
  POST   /api/chat/message           Send message to AI advisor
  GET    /api/chat/history           Chat history
  GET    /api/chat/financial-summary Financial statement auto-generated
  GET    /api/chat/forecast          Cash flow forecast (next 30 days)

MODULE 4 — LENDING
  GET    /api/lending/applications    List loan applications
  POST   /api/lending/apply          Submit loan application
  GET    /api/lending/offers/:appId  Get offers for an application
  POST   /api/lending/offer          Submit a lending offer (lender)
  POST   /api/lending/accept/:offerId Accept an offer
  GET    /api/lending/simulate       Rate simulation (adjust parameters)

MODULE 5 — HEATMAP
  GET    /api/heatmap/districts      All district metrics + inclusion scores
  GET    /api/heatmap/recommendations AI expansion recommendations
  GET    /api/heatmap/district/:name  Detailed district breakdown

MODULE 6 — CHILIMBA
  GET    /api/chilimba/circles       User's savings circles
  POST   /api/chilimba/create        Create new circle
  POST   /api/chilimba/join/:id      Join a circle
  GET    /api/chilimba/:id           Circle detail + health score
  GET    /api/chilimba/:id/risks     Member default risk predictions
  POST   /api/chilimba/:id/contribute Record contribution
  GET    /api/chilimba/:id/payout-order AI-optimized payout order

MODULE 7 — DOCUMENTS
  POST   /api/documents/upload       Upload document for processing
  GET    /api/documents/:id          Get extraction results
  GET    /api/documents/:id/fields   Per-field confidence breakdown
  POST   /api/documents/verify       Manual verification override
```

---

## AI/ML Pipeline

### How the Python ML Service Connects

The Python FastAPI service runs as a sidecar and exposes these internal endpoints:

```
POST /ml/credit-score          Input: user features → Output: score + SHAP values
POST /ml/fraud-detect          Input: transaction → Output: fraud probability + flags
POST /ml/cashflow-forecast     Input: financial records → Output: 30-day forecast
POST /ml/document-ocr          Input: image base64 → Output: extracted fields + confidence
POST /ml/default-risk          Input: member features → Output: default probability
POST /ml/bias-audit            Input: score dataset → Output: fairness metrics
POST /ml/inclusion-predict     Input: district features → Output: predicted inclusion score
```

The Next.js API routes call these endpoints internally. The user never hits the ML service directly.

### Model Training (Pre-baked for Hackathon)

For the hackathon, models are **pre-trained on synthetic data** and loaded at startup:

```python
# services/ml-engine/models/credit_scorer.py

import xgboost as xgb
import shap
import numpy as np

class CreditScorer:
    def __init__(self):
        # Pre-trained on synthetic Zambian transaction data
        self.model = xgb.XGBClassifier()
        self.model.load_model("models/credit_model.json")
        self.explainer = shap.TreeExplainer(self.model)

    def score(self, features: dict) -> dict:
        X = self.preprocess(features)
        raw_prob = self.model.predict_proba(X)[0][1]
        score = int(raw_prob * 1000)
        tier = self.get_tier(score)
        shap_values = self.explainer.shap_values(X)

        return {
            "score": score,
            "tier": tier,
            "factors": self.format_shap(shap_values, features),
            "raw_probability": float(raw_prob)
        }

    def get_tier(self, score):
        if score >= 800: return "A"
        if score >= 650: return "B"
        if score >= 500: return "C"
        if score >= 350: return "D"
        return "E"
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (recommended)

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/your-team/ndalama-ai.git
cd ndalama-ai

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# Start all services
docker-compose up -d

# Run database migrations
cd apps/web
npx prisma migrate dev

# Seed with synthetic Zambian data
npx prisma db seed

# Open the app
open http://localhost:3000
```

### Quick Start (Manual)

```bash
# 1. Install frontend dependencies
cd apps/web
npm install

# 2. Set up database
npx prisma migrate dev
npx prisma db seed

# 3. Start the ML service
cd ../../services/ml-engine
pip install -r requirements.txt
uvicorn main:app --port 8000

# 4. Start the frontend
cd ../../apps/web
npm run dev
```

---

## Environment Variables

```env
# .env.example

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/ndalama"

# Redis
REDIS_URL="redis://localhost:6379"

# Anthropic Claude API (Module 3 chatbot + Module 7 document understanding)
ANTHROPIC_API_KEY="sk-ant-..."

# ML Service
ML_SERVICE_URL="http://localhost:8000"

# Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# File Storage (MinIO / S3)
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_BUCKET="ndalama-documents"
```

---

## Demo & Synthetic Data

### Synthetic Data Generator

The seed script creates realistic Zambian data:

- **500 users** across all 10 provinces with real Zambian names and NRC formats
- **50,000 transactions** across MTN Money, Airtel Money, and Zoona with realistic amounts in ZMW
- **30 savings circles** with varying health scores and member counts
- **200 loan applications** at different stages with corresponding offers
- **116 district records** with real population and connectivity data

### Demo Personas (Pre-seeded)

| Persona | Name | Role | Highlights |
|---|---|---|---|
| Market Trader | Mwila Tembo | Borrower | Active MTN Money user, 6 months of chatbot financial records, credit score 720 |
| Savings Leader | Grace Banda | Circle Leader | Runs a 12-person Chilimba, perfect contribution record |
| New User | Joseph Mulenga | Onboarding | Just uploaded NRC, no transaction history yet — shows Module 7 + initial scoring |
| SME Owner | Natasha Phiri | Borrower | Cross-platform user (MTN + Airtel), applying for K10,000 business loan |
| Lender | Lupiya Capital | Lender | Reviews applications, competes on rates |

### Demo Walkthrough Script

See `docs/demo-script.md` for a minute-by-minute hackathon demo script that showcases all 7 modules in a compelling narrative.

---

## Deployment

### Recommended for Hackathon

| Service | Platform | Reason |
|---|---|---|
| Next.js Frontend | **Vercel** | Zero-config, instant deploys |
| PostgreSQL | **Neon** or **Supabase** | Free tier, serverless Postgres |
| Redis | **Upstash** | Free tier, serverless Redis |
| ML Service | **Railway** or **Render** | Easy Python deployment |
| File Storage | **Cloudflare R2** or **Supabase Storage** | Free tier object storage |

---

## Hackathon Presentation Strategy

### Narrative Arc (5-minute pitch)

1. **The Problem** (30s): "Meet Mwila. She sells tomatoes at Lusaka's Soweto Market. She uses MTN Money and Airtel Money. She's been saving in a Chilimba for 2 years. But when she needs a K5,000 loan to expand, every bank says the same thing: 'No credit history.'"

2. **The Solution** (30s): "Ndalama AI sees what banks can't. We unify her mobile money data, digitize her savings circle, and use AI to build a credit profile from her real financial life."

3. **Live Demo** (3min): Walk through Mwila's journey across all 7 modules.

4. **Impact** (30s): "With Ndalama, Zambia's 7 million unbanked adults aren't invisible anymore. Every kwacha they send, save, or spend builds their financial identity."

5. **Technical Depth** (30s): "Under the hood: XGBoost credit scoring with SHAP explainability, real-time fraud detection via isolation forests, Claude-powered financial advising, and geospatial ML for strategic expansion."

### Judge-Impressing Details

- Show the **bias audit** — judges love fairness-aware AI
- Show the **rate simulator** — interactive demos beat slides
- Show the **heatmap** — maps are visually stunning
- Mention the **data flywheel** — every module makes every other module smarter
- Use real Zambian context: ZMW currency, district names, NRC format, Chilimba tradition

---

## Contributing

This project was built for the **KSU FinTech Hackathon Spring 2026**.

## License

MIT

---

*Ndalama AI — Because every kwacha tells a story.*