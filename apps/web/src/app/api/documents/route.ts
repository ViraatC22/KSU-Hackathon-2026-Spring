import { NextResponse } from "next/server";

const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/tiff", "image/webp"]);
const DEFAULT_MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

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

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const docType = form?.get("doc_type");
  const configuredLimit = Number(process.env.MAX_DOCUMENT_BYTES);
  const maxDocumentBytes =
    Number.isSafeInteger(configuredLimit) && configuredLimit > 0
      ? configuredLimit
      : DEFAULT_MAX_DOCUMENT_BYTES;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "An image file is required" }, { status: 400 });
  }
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Supported formats: JPEG, PNG, TIFF, and WebP" },
      { status: 415 }
    );
  }
  if (file.size > maxDocumentBytes) {
    return NextResponse.json(
      { error: `Document exceeds the ${Math.floor(maxDocumentBytes / 1_048_576)} MiB limit` },
      { status: 413 }
    );
  }

  const mlService = process.env.ML_SERVICE_URL ?? "http://localhost:8000";
  let endpoint: URL;
  try {
    endpoint = new URL("/ml/document-ocr", mlService);
    if (!["http:", "https:"].includes(endpoint.protocol)) throw new Error("Unsupported protocol");
  } catch {
    return NextResponse.json({ error: "ML service URL is invalid" }, { status: 500 });
  }
  endpoint.searchParams.set(
    "doc_type",
    typeof docType === "string" ? docType : "NRC"
  );

  const upstreamForm = new FormData();
  upstreamForm.set("file", file, file.name);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: upstreamForm,
      signal: AbortSignal.timeout(30_000),
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({
      error: "ML service returned an unreadable response",
    }));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        error:
          "OCR service is unavailable. Start services/ml-engine and confirm Tesseract is installed.",
      },
      { status: 503 }
    );
  }
}
