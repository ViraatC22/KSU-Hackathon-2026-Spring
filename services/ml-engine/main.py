"""Local document OCR service for the Ndalama AI demo."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from io import BytesIO
import os
import re
import shutil
import warnings

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
import pytesseract
from pytesseract import Output, TesseractError, TesseractNotFoundError
import uvicorn

DEFAULT_MAX_FILE_BYTES = 10 * 1024 * 1024
MAX_IMAGE_PIXELS = 25_000_000
SUPPORTED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/tiff", "image/webp"}


def _positive_int_env(name: str, default: int) -> int:
    try:
        value = int(os.getenv(name, str(default)))
    except ValueError:
        return default
    return value if value > 0 else default


MAX_FILE_BYTES = _positive_int_env("MAX_DOCUMENT_BYTES", DEFAULT_MAX_FILE_BYTES)
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app = FastAPI(
    title="Ndalama AI ML Engine",
    version="1.1.0",
    description="Validated local OCR boundary for the Ndalama AI hackathon demo.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class DocumentType(str, Enum):
    NRC = "NRC"
    BUSINESS_PERMIT = "BUSINESS_PERMIT"
    RECEIPT = "RECEIPT"
    UTILITY_BILL = "UTILITY_BILL"
    BANK_STATEMENT = "BANK_STATEMENT"


@dataclass(frozen=True)
class OcrResult:
    text: str
    confidence: float


def perform_ocr(image: Image.Image) -> OcrResult:
    """Extract text and a mean word confidence using the local Tesseract binary."""
    data = pytesseract.image_to_data(
        image,
        output_type=Output.DICT,
        config="--psm 6",
        timeout=20,
    )
    words: list[str] = []
    confidences: list[float] = []

    for word, raw_confidence in zip(data["text"], data["conf"], strict=True):
        word = word.strip()
        if not word:
            continue
        words.append(word)
        try:
            confidence = float(raw_confidence)
        except (TypeError, ValueError):
            continue
        if confidence >= 0:
            confidences.append(confidence)

    mean_confidence = sum(confidences) / len(confidences) / 100 if confidences else 0.0
    return OcrResult(text=" ".join(words), confidence=round(mean_confidence, 3))


def _first_match(pattern: str, text: str) -> str | None:
    match = re.search(pattern, text, flags=re.IGNORECASE | re.MULTILINE)
    return match.group(1).strip() if match else None


def extract_fields(text: str, doc_type: DocumentType, confidence: float) -> list[dict[str, object]]:
    """Extract conservative, recognizable fields without inventing missing values."""
    patterns: list[tuple[str, str]] = []

    if doc_type == DocumentType.NRC:
        patterns.extend(
            [
                ("NRC Number", r"\b(\d{6}/\d{2}/\d)\b"),
                ("Date", r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{4})\b"),
            ]
        )
    elif doc_type == DocumentType.BUSINESS_PERMIT:
        patterns.extend(
            [
                ("Registration Number", r"\b((?:BIZ|REG)[-\s]?\d{4}[-\s]?\d+)\b"),
                ("Expiry Date", r"(?:expiry|expires?)\s*(?:date)?\s*[:\-]?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{4})"),
            ]
        )
    elif doc_type in {DocumentType.RECEIPT, DocumentType.UTILITY_BILL, DocumentType.BANK_STATEMENT}:
        patterns.extend(
            [
                ("Amount", r"\b((?:ZMW|K)\s?[\d,]+(?:\.\d{1,2})?)\b"),
                ("Date", r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b"),
            ]
        )

    fields: list[dict[str, object]] = []
    for label, pattern in patterns:
        value = _first_match(pattern, text)
        if value:
            fields.append({"field": label, "value": value, "confidence": confidence})
    return fields


@app.get("/health")
def health_check():
    ocr_available = shutil.which("tesseract") is not None
    return {
        "status": "healthy" if ocr_available else "degraded",
        "service": "ndalama-ml-engine",
        "ocr_available": ocr_available,
    }


@app.post("/ml/document-ocr")
async def document_ocr(
    file: UploadFile = File(...),
    doc_type: DocumentType = DocumentType.NRC,
):
    """Validate an uploaded image, run Tesseract, and return conservative fields."""
    if file.content_type not in SUPPORTED_IMAGE_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Supported formats: JPEG, PNG, TIFF, and WebP",
        )

    content = await file.read(MAX_FILE_BYTES + 1)
    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Document exceeds the {MAX_FILE_BYTES // 1_048_576} MiB limit",
        )
    if not content:
        raise HTTPException(status_code=422, detail="Uploaded image is empty")

    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(content)) as source:
                if source.width * source.height > MAX_IMAGE_PIXELS:
                    raise HTTPException(status_code=413, detail="Image dimensions are too large")
                source.load()
                image = source.convert("L")
                width, height = source.size
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise HTTPException(status_code=422, detail="Uploaded file is not a valid supported image") from None

    try:
        result = await run_in_threadpool(perform_ocr, image)
    except TesseractNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Tesseract OCR is not installed or is not available on PATH",
        ) from None
    except TesseractError:
        raise HTTPException(status_code=502, detail="Tesseract could not process this image") from None
    except RuntimeError:
        raise HTTPException(status_code=504, detail="OCR exceeded the processing time limit") from None

    return {
        "status": "completed",
        "doc_type": doc_type.value,
        "confidence": result.confidence,
        "image": {"width": width, "height": height},
        "extracted_fields": extract_fields(result.text, doc_type, result.confidence),
        "text_preview": result.text[:500],
        "text_truncated": len(result.text) > 500,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
