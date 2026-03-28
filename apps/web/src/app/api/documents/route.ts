import { NextResponse } from "next/server";

const DOCUMENTS = [
  {
    id: "DOC-001", userId: "USR-001", userName: "Mwila Tembo", type: "NRC",
    status: "VERIFIED", confidence: 0.95, uploadedAt: "2025-12-15",
    extractedFields: [
      { field: "Full Name", value: "Mwila Tembo", confidence: 0.98 },
      { field: "NRC Number", value: "123456/10/1", confidence: 0.96 },
      { field: "Date of Birth", value: "15/05/1990", confidence: 0.94 },
    ],
  },
  {
    id: "DOC-002", userId: "USR-002", userName: "Grace Banda", type: "BUSINESS_PERMIT",
    status: "VERIFIED", confidence: 0.88, uploadedAt: "2025-12-20",
    extractedFields: [
      { field: "Business Name", value: "Grace's Market Stall", confidence: 0.91 },
      { field: "Registration No", value: "BIZ-2024-08821", confidence: 0.85 },
    ],
  },
  {
    id: "DOC-003", userId: "USR-003", userName: "Joseph Mulenga", type: "NRC",
    status: "PROCESSING", confidence: null, uploadedAt: "2026-03-10",
    extractedFields: [],
  },
];

export async function GET() {
  return NextResponse.json({
    documents: DOCUMENTS,
    total: DOCUMENTS.length,
    verified: DOCUMENTS.filter((d) => d.status === "VERIFIED").length,
    processing: DOCUMENTS.filter((d) => d.status === "PROCESSING").length,
  });
}

export async function POST() {
  // Simulate document upload and processing
  return NextResponse.json({
    id: `DOC-${String(Date.now()).slice(-6)}`,
    status: "PROCESSING",
    message: "Document uploaded and queued for AI processing. Results typically available within 30 seconds.",
  });
}
