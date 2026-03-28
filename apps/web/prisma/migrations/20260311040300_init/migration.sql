-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BORROWER', 'LENDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "MobilePlatform" AS ENUM ('MTN_MONEY', 'AIRTEL_MONEY', 'ZOONA');

-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('P2P_TRANSFER', 'MERCHANT_PAYMENT', 'BILL_PAYMENT', 'AIRTIME_PURCHASE', 'CASH_IN', 'CASH_OUT', 'SALARY', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'SAVINGS_CONTRIBUTION', 'SAVINGS_PAYOUT');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDING', 'MATCHED', 'DISCREPANCY', 'FLAGGED');

-- CreateEnum
CREATE TYPE "CreditTier" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('OPEN', 'FUNDED', 'REPAYING', 'COMPLETED', 'DEFAULTED');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "CircleStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'DISSOLVED');

-- CreateEnum
CREATE TYPE "CircleRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('SCHEDULED', 'PAID', 'MISSED');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('NRC', 'BUSINESS_PERMIT', 'RECEIPT', 'BANK_STATEMENT', 'UTILITY_BILL', 'OTHER');

-- CreateEnum
CREATE TYPE "DocVerification" AS ENUM ('PROCESSING', 'VERIFIED', 'REJECTED', 'MANUAL_REVIEW');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "nrcNumber" TEXT,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'BORROWER',
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "kycConfidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "MobilePlatform" NOT NULL,
    "platformId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "linkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobileAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "ndalamaId" TEXT NOT NULL,
    "originalPlatform" "MobilePlatform" NOT NULL,
    "originalTxId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZMW',
    "type" "TxType" NOT NULL,
    "category" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "fraudScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fraudFlags" TEXT[],
    "reconciliationStatus" "ReconciliationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "tier" "CreditTier" NOT NULL,
    "transactionScore" DOUBLE PRECISION NOT NULL,
    "behavioralScore" DOUBLE PRECISION NOT NULL,
    "businessScore" DOUBLE PRECISION,
    "identityScore" DOUBLE PRECISION NOT NULL,
    "factors" JSONB NOT NULL,
    "fairnessFlags" TEXT[],
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanApplication" (
    "id" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "purpose" TEXT NOT NULL,
    "term" INTEGER NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'OPEN',
    "creditScoreAt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanOffer" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "rateBreakdown" JSONB NOT NULL,
    "maxAmount" DECIMAL(12,2) NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingsCircle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contributionAmount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZMW',
    "frequency" "Frequency" NOT NULL,
    "totalRounds" INTEGER NOT NULL,
    "currentRound" INTEGER NOT NULL DEFAULT 1,
    "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "status" "CircleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavingsCircle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CircleMembership" (
    "id" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CircleRole" NOT NULL DEFAULT 'MEMBER',
    "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "defaultRisk" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CircleMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CirclePayout" (
    "id" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "recipientId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "status" "PayoutStatus" NOT NULL DEFAULT 'SCHEDULED',

    CONSTRAINT "CirclePayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "DocType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "extractedData" JSONB,
    "confidence" DOUBLE PRECISION,
    "fieldConfidences" JSONB,
    "verificationStatus" "DocVerification" NOT NULL DEFAULT 'PROCESSING',
    "processingErrors" TEXT[],
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "intent" TEXT,
    "entities" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZMW',
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'chatbot',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinancialRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistrictMetrics" (
    "id" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "population" INTEGER NOT NULL,
    "mobileMoneyPenetration" DOUBLE PRECISION NOT NULL,
    "agentDensity" DOUBLE PRECISION NOT NULL,
    "txVolumePerCapita" DOUBLE PRECISION NOT NULL,
    "creditAccessRate" DOUBLE PRECISION NOT NULL,
    "savingsParticipation" DOUBLE PRECISION NOT NULL,
    "internetConnectivity" DOUBLE PRECISION NOT NULL,
    "inclusionScore" DOUBLE PRECISION NOT NULL,
    "aiRecommendation" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistrictMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nrcNumber_key" ON "User"("nrcNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MobileAccount_platformId_key" ON "MobileAccount"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_ndalamaId_key" ON "Transaction"("ndalamaId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditScore_userId_key" ON "CreditScore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CircleMembership_circleId_userId_key" ON "CircleMembership"("circleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "DistrictMetrics_districtName_key" ON "DistrictMetrics"("districtName");

-- AddForeignKey
ALTER TABLE "MobileAccount" ADD CONSTRAINT "MobileAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditScore" ADD CONSTRAINT "CreditScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanOffer" ADD CONSTRAINT "LoanOffer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "LoanApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMembership" ADD CONSTRAINT "CircleMembership_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "SavingsCircle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMembership" ADD CONSTRAINT "CircleMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CirclePayout" ADD CONSTRAINT "CirclePayout_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "SavingsCircle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
