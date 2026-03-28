from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Ndalama AI ML Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ndalama-ml-engine"}


@app.post("/ml/document-ocr")
async def document_ocr(file: UploadFile = File(...), doc_type: str = "NRC"):
    """OCR endpoint for document processing (Module 7)."""
    # TODO: Implement Tesseract OCR pipeline
    return {
        "status": "stub",
        "message": "OCR endpoint - implementation pending",
        "doc_type": doc_type,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
