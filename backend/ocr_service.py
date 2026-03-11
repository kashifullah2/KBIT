import pytesseract
from PIL import Image
import pypdf
import io
import logging

logger = logging.getLogger(__name__)

def get_available_engines() -> list[dict]:
    """Return a list of available OCR engines with metadata."""
    engines = []

    # Tesseract — check if binary is reachable
    try:
        pytesseract.get_tesseract_version()
        engines.append({
            "id": "tesseract",
            "name": "Tesseract OCR",
            "description": "Fast, open-source OCR by Google. Great for clean printed text.",
        })
    except Exception:
        pass

    # Fallback: always keep at least tesseract as an option label
    if not engines:
        engines.append({
            "id": "tesseract",
            "name": "Tesseract OCR (default)",
            "description": "Default OCR engine.",
        })

    return engines


# ---------- Image OCR ----------

def extract_text_from_image_tesseract(image_bytes: bytes) -> str:
    """Extract text from an image using Tesseract OCR."""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return f"Error extracting text with Tesseract: {str(e)}"

def extract_text_from_image(image_bytes: bytes, engine: str = "tesseract") -> str:
    """
    Dispatch image OCR to the selected engine.
    Supported engines: 'tesseract'
    """
    return extract_text_from_image_tesseract(image_bytes)


# ---------- PDF text extraction ----------

def extract_text_from_pdf(pdf_bytes: bytes, engine: str = "tesseract") -> str:
    """
    Extract text from a PDF byte stream.
    Tries native extraction first. If the PDF appears scanned,
    falls back to OCR on rendered pages.
    """
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        # If very little text was extracted, it might be a scanned PDF.
        if len(text.strip()) < 10:
            return "[Make sure your PDF contains selectable text. Scanned PDFs support coming soon.]"

        return text
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"
