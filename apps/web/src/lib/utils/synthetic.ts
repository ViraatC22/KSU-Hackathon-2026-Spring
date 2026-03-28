import {
  PROVINCES,
  DISTRICTS_BY_PROVINCE,
  ZAMBIAN_FIRST_NAMES_MALE,
  ZAMBIAN_FIRST_NAMES_FEMALE,
  ZAMBIAN_LAST_NAMES,
  generateNRC,
  generatePhone,
} from "./zambia-data";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const PLATFORMS = ["MTN_MONEY", "AIRTEL_MONEY", "ZOONA"] as const;
type Platform = (typeof PLATFORMS)[number];

const TX_TYPES = [
  "P2P_TRANSFER", "MERCHANT_PAYMENT", "BILL_PAYMENT", "AIRTIME_PURCHASE",
  "CASH_IN", "CASH_OUT", "SALARY",
] as const;

const TX_TYPE_WEIGHTS = [0.60, 0.15, 0.10, 0.05, 0.04, 0.04, 0.02];

function weightedPick<T>(items: readonly T[], weights: number[]): T {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return items[i];
  }
  return items[items.length - 1];
}

export interface SyntheticUser {
  name: string;
  phone: string;
  email: string | null;
  nrcNumber: string;
  district: string;
  province: string;
  gender: string;
  dateOfBirth: Date;
  role: "BORROWER" | "LENDER";
  kycStatus: "PENDING" | "VERIFIED" | "FAILED" | "MANUAL_REVIEW";
  kycConfidence: number | null;
  platforms: Platform[];
}

export function generateUsers(count: number): SyntheticUser[] {
  const users: SyntheticUser[] = [];

  // Demo personas first
  const demoPersonas: SyntheticUser[] = [
    {
      name: "Mwila Tembo",
      phone: "+260971000001",
      email: "mwila@demo.ndalama.ai",
      nrcNumber: "123456/10/1",
      district: "Lusaka",
      province: "Lusaka",
      gender: "female",
      dateOfBirth: new Date("1990-05-15"),
      role: "BORROWER",
      kycStatus: "VERIFIED",
      kycConfidence: 0.95,
      platforms: ["MTN_MONEY", "AIRTEL_MONEY"],
    },
    {
      name: "Grace Banda",
      phone: "+260971000002",
      email: "grace@demo.ndalama.ai",
      nrcNumber: "234567/20/1",
      district: "Lusaka",
      province: "Lusaka",
      gender: "female",
      dateOfBirth: new Date("1985-08-22"),
      role: "BORROWER",
      kycStatus: "VERIFIED",
      kycConfidence: 0.92,
      platforms: ["MTN_MONEY"],
    },
    {
      name: "Joseph Mulenga",
      phone: "+260961000003",
      email: "joseph@demo.ndalama.ai",
      nrcNumber: "345678/30/1",
      district: "Kitwe",
      province: "Copperbelt",
      gender: "male",
      dateOfBirth: new Date("1998-01-10"),
      role: "BORROWER",
      kycStatus: "PENDING",
      kycConfidence: null,
      platforms: ["AIRTEL_MONEY"],
    },
    {
      name: "Natasha Phiri",
      phone: "+260971000004",
      email: "natasha@demo.ndalama.ai",
      nrcNumber: "456789/40/1",
      district: "Ndola",
      province: "Copperbelt",
      gender: "female",
      dateOfBirth: new Date("1992-11-30"),
      role: "BORROWER",
      kycStatus: "VERIFIED",
      kycConfidence: 0.88,
      platforms: ["MTN_MONEY", "AIRTEL_MONEY"],
    },
    {
      name: "Lupiya Capital",
      phone: "+260951000005",
      email: "lupiya@demo.ndalama.ai",
      nrcNumber: "567890/50/1",
      district: "Lusaka",
      province: "Lusaka",
      gender: "male",
      dateOfBirth: new Date("1980-03-25"),
      role: "LENDER",
      kycStatus: "VERIFIED",
      kycConfidence: 0.99,
      platforms: ["MTN_MONEY", "AIRTEL_MONEY", "ZOONA"],
    },
  ];
  users.push(...demoPersonas);

  const usedPhones = new Set(demoPersonas.map((u) => u.phone));

  for (let i = 0; i < count - demoPersonas.length; i++) {
    const gender = Math.random() > 0.5 ? "male" : "female";
    const firstName = gender === "male"
      ? pick(ZAMBIAN_FIRST_NAMES_MALE)
      : pick(ZAMBIAN_FIRST_NAMES_FEMALE);
    const lastName = pick(ZAMBIAN_LAST_NAMES);
    const province = pick(PROVINCES);
    const district = pick(DISTRICTS_BY_PROVINCE[province]);

    const numPlatforms = randomInt(1, 3);
    const shuffled = [...PLATFORMS].sort(() => Math.random() - 0.5);
    const platforms = shuffled.slice(0, numPlatforms);
    const primaryPlatform = platforms[0];

    let phone: string;
    do {
      phone = generatePhone(primaryPlatform);
    } while (usedPhones.has(phone));
    usedPhones.add(phone);

    const kycRoll = Math.random();
    const kycStatus = kycRoll < 0.6 ? "VERIFIED" : kycRoll < 0.8 ? "PENDING" : kycRoll < 0.95 ? "MANUAL_REVIEW" : "FAILED";

    users.push({
      name: `${firstName} ${lastName}`,
      phone,
      email: Math.random() > 0.7 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.zm` : null,
      nrcNumber: generateNRC(),
      district,
      province,
      gender,
      dateOfBirth: randomDate(new Date("1965-01-01"), new Date("2003-12-31")),
      role: Math.random() > 0.95 ? "LENDER" : "BORROWER",
      kycStatus,
      kycConfidence: kycStatus === "VERIFIED" ? randomBetween(0.75, 0.99) : kycStatus === "PENDING" ? null : randomBetween(0.2, 0.6),
      platforms,
    });
  }

  return users;
}

export interface SyntheticTransaction {
  ndalamaId: string;
  originalPlatform: Platform;
  originalTxId: string;
  senderIndex: number;
  receiverIndex: number;
  amount: number;
  type: string;
  category: string | null;
  timestamp: Date;
  fraudScore: number;
  fraudFlags: string[];
  reconciliationStatus: string;
}

export function generateTransactions(userCount: number, count: number): SyntheticTransaction[] {
  const txns: SyntheticTransaction[] = [];
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const categories: Record<string, string[]> = {
    P2P_TRANSFER: ["Family Support", "Business Payment", "Rent", "Gift", "Loan Repayment"],
    MERCHANT_PAYMENT: ["Grocery", "Transport", "Restaurant", "Market Purchase", "Fuel"],
    BILL_PAYMENT: ["ZESCO Electric", "Water Bill", "Internet", "School Fees", "Medical"],
    AIRTIME_PURCHASE: ["MTN Airtime", "Airtel Airtime", "Data Bundle"],
    CASH_IN: ["Agent Deposit", "Bank Transfer In"],
    CASH_OUT: ["Agent Withdrawal", "ATM"],
    SALARY: ["Monthly Salary", "Contract Payment"],
  };

  for (let i = 0; i < count; i++) {
    const type = weightedPick(TX_TYPES, TX_TYPE_WEIGHTS);
    const platform = pick(PLATFORMS);

    let amount: number;
    switch (type) {
      case "SALARY": amount = randomBetween(2000, 15000); break;
      case "MERCHANT_PAYMENT": amount = randomBetween(20, 2000); break;
      case "BILL_PAYMENT": amount = randomBetween(50, 1500); break;
      case "CASH_IN": case "CASH_OUT": amount = randomBetween(100, 5000); break;
      case "AIRTIME_PURCHASE": amount = randomBetween(5, 100); break;
      default: amount = randomBetween(10, 3000); break;
    }
    amount = Math.round(amount * 100) / 100;

    const senderIdx = randomInt(0, userCount - 1);
    let receiverIdx: number;
    do {
      receiverIdx = randomInt(0, userCount - 1);
    } while (receiverIdx === senderIdx);

    const fraudRoll = Math.random();
    const fraudScore = fraudRoll < 0.95 ? randomBetween(0, 0.3) : fraudRoll < 0.99 ? randomBetween(0.3, 0.7) : randomBetween(0.7, 1.0);
    const fraudFlags: string[] = [];
    if (fraudScore > 0.7) fraudFlags.push("HIGH_AMOUNT", "UNUSUAL_PATTERN");
    else if (fraudScore > 0.5) fraudFlags.push("VELOCITY_WARNING");

    const reconcStatus = fraudScore > 0.7 ? "FLAGGED" : fraudScore > 0.5 ? "DISCREPANCY" : Math.random() > 0.05 ? "MATCHED" : "PENDING";

    txns.push({
      ndalamaId: `NDA-2025-${String(i + 1).padStart(6, "0")}`,
      originalPlatform: platform,
      originalTxId: `${platform.split("_")[0]}-TXN-${randomInt(10000, 99999)}`,
      senderIndex: senderIdx,
      receiverIndex: receiverIdx,
      amount,
      type,
      category: pick(categories[type] || ["Other"]),
      timestamp: randomDate(sixMonthsAgo, new Date()),
      fraudScore: Math.round(fraudScore * 100) / 100,
      fraudFlags,
      reconciliationStatus: reconcStatus,
    });
  }

  return txns.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function computeCreditScore(
  txCount: number,
  avgAmount: number,
  uniqueCounterparties: number,
  platformCount: number,
  kycVerified: boolean,
  circleReliability: number
): { score: number; tier: string; transactionScore: number; behavioralScore: number; identityScore: number } {
  const txScore = Math.min(1, txCount / 200) * 0.3;
  const amountScore = Math.min(1, avgAmount / 1000) * 0.15;
  const diversityScore = Math.min(1, uniqueCounterparties / 30) * 0.15;
  const platformScore = (platformCount / 3) * 0.1;
  const kycScore = kycVerified ? 0.15 : 0.05;
  const circleScore = circleReliability * 0.15;

  const rawScore = txScore + amountScore + diversityScore + platformScore + kycScore + circleScore;
  const score = Math.round(rawScore * 1000);

  let tier: string;
  if (score >= 800) tier = "A";
  else if (score >= 650) tier = "B";
  else if (score >= 500) tier = "C";
  else if (score >= 350) tier = "D";
  else tier = "E";

  return {
    score,
    tier,
    transactionScore: Math.round((txScore + amountScore + diversityScore) * 1000) / 1000,
    behavioralScore: Math.round((platformScore + circleScore) * 1000) / 1000,
    identityScore: Math.round(kycScore * 1000) / 1000,
  };
}

export const DISTRICT_DATA: Array<{
  name: string;
  province: string;
  lat: number;
  lng: number;
  population: number;
}> = [
  { name: "Lusaka", province: "Lusaka", lat: -15.4167, lng: 28.2833, population: 2731696 },
  { name: "Kitwe", province: "Copperbelt", lat: -12.8024, lng: 28.2132, population: 522092 },
  { name: "Ndola", province: "Copperbelt", lat: -12.9587, lng: 28.6366, population: 475194 },
  { name: "Kabwe", province: "Central", lat: -14.4378, lng: 28.4513, population: 250478 },
  { name: "Chingola", province: "Copperbelt", lat: -12.5297, lng: 27.8514, population: 216626 },
  { name: "Mufulira", province: "Copperbelt", lat: -12.5440, lng: 28.2404, population: 162889 },
  { name: "Livingstone", province: "Southern", lat: -17.8419, lng: 25.8601, population: 184464 },
  { name: "Kasama", province: "Northern", lat: -10.2129, lng: 31.1808, population: 131045 },
  { name: "Chipata", province: "Eastern", lat: -13.6333, lng: 32.6456, population: 152699 },
  { name: "Solwezi", province: "North-Western", lat: -12.1690, lng: 25.8616, population: 117249 },
  { name: "Mongu", province: "Western", lat: -15.2547, lng: 23.1268, population: 93828 },
  { name: "Mansa", province: "Luapula", lat: -11.1997, lng: 28.8948, population: 121280 },
  { name: "Mpika", province: "Muchinga", lat: -11.8343, lng: 31.4576, population: 103795 },
  { name: "Choma", province: "Southern", lat: -16.5393, lng: 26.9867, population: 117059 },
  { name: "Mazabuka", province: "Southern", lat: -15.8590, lng: 27.7531, population: 135927 },
  { name: "Kapiri Mposhi", province: "Central", lat: -14.9707, lng: 28.6828, population: 129263 },
  { name: "Kafue", province: "Lusaka", lat: -15.7686, lng: 28.1816, population: 244900 },
  { name: "Luanshya", province: "Copperbelt", lat: -13.1366, lng: 28.4162, population: 156059 },
  { name: "Monze", province: "Southern", lat: -16.2833, lng: 27.4833, population: 101244 },
  { name: "Petauke", province: "Eastern", lat: -14.2423, lng: 31.3194, population: 98918 },
];
