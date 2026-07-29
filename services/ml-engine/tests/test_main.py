from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image
import pytest
from pytesseract import TesseractNotFoundError

import main

client = TestClient(main.app)


def png_bytes() -> bytes:
    output = BytesIO()
    Image.new("RGB", (120, 60), color="white").save(output, format="PNG")
    return output.getvalue()


def test_health_reports_ocr_capability():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["service"] == "ndalama-ml-engine"
    assert isinstance(response.json()["ocr_available"], bool)


def test_rejects_unsupported_or_invalid_uploads():
    unsupported = client.post(
        "/ml/document-ocr",
        files={"file": ("document.pdf", b"%PDF", "application/pdf")},
    )
    invalid = client.post(
        "/ml/document-ocr",
        files={"file": ("fake.png", b"not an image", "image/png")},
    )

    assert unsupported.status_code == 415
    assert invalid.status_code == 422


def test_rejects_upload_over_configured_limit(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(main, "MAX_FILE_BYTES", 4)
    response = client.post(
        "/ml/document-ocr",
        files={"file": ("large.png", b"12345", "image/png")},
    )

    assert response.status_code == 413


def test_returns_ocr_result_and_conservative_fields(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(
        main,
        "perform_ocr",
        lambda _image: main.OcrResult(
            text="Republic of Zambia NRC 123456/10/1 Date 15/05/1990",
            confidence=0.91,
        ),
    )

    response = client.post(
        "/ml/document-ocr?doc_type=NRC",
        files={"file": ("nrc.png", png_bytes(), "image/png")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "completed"
    assert payload["confidence"] == 0.91
    assert payload["image"] == {"width": 120, "height": 60}
    assert payload["extracted_fields"] == [
        {"field": "NRC Number", "value": "123456/10/1", "confidence": 0.91},
        {"field": "Date", "value": "15/05/1990", "confidence": 0.91},
    ]


def test_reports_missing_tesseract_as_external_dependency(monkeypatch: pytest.MonkeyPatch):
    def unavailable(_image):
        raise TesseractNotFoundError()

    monkeypatch.setattr(main, "perform_ocr", unavailable)
    response = client.post(
        "/ml/document-ocr",
        files={"file": ("nrc.png", png_bytes(), "image/png")},
    )

    assert response.status_code == 503
    assert "Tesseract" in response.json()["detail"]


def test_reports_ocr_timeout(monkeypatch: pytest.MonkeyPatch):
    def timeout(_image):
        raise RuntimeError("Tesseract process timeout")

    monkeypatch.setattr(main, "perform_ocr", timeout)
    response = client.post(
        "/ml/document-ocr",
        files={"file": ("nrc.png", png_bytes(), "image/png")},
    )

    assert response.status_code == 504


def test_rejects_unknown_document_type_before_processing():
    response = client.post(
        "/ml/document-ocr?doc_type=PASSPORT",
        files={"file": ("image.png", png_bytes(), "image/png")},
    )

    assert response.status_code == 422
