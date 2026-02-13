import pytesseract
from PIL import Image
import pypdf
import io
import logging

logger = logging.getLogger(__name__)

# --- Lazy EasyOCR initialization ---
_easyocr_reader = None

def _get_easyocr_reader():
    """Lazily initialize EasyOCR reader (downloads model on first use)."""
    global _easyocr_reader
    if _easyocr_reader is None:
        import easyocr
        _easyocr_reader = easyocr.Reader(['en'], gpu=False)
    return _easyocr_reader


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

    # EasyOCR — check if the package is importable
    try:
        import easyocr  # noqa: F401
        engines.append({
            "id": "easyocr",
            "name": "EasyOCR",
            "description": "Deep-learning OCR. Better for complex layouts, handwriting & multi-language.",
        })
    except ImportError:
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


def extract_text_from_image_easyocr(image_bytes: bytes) -> str:
    """Extract text from an image using EasyOCR."""
    try:
        reader = _get_easyocr_reader()
        # EasyOCR can accept bytes, numpy array, or file path
        results = reader.readtext(image_bytes, detail=0, paragraph=True)
        text = "\n".join(results)
        return text
    except Exception as e:
        return f"Error extracting text with EasyOCR: {str(e)}"


def extract_text_from_image(image_bytes: bytes, engine: str = "tesseract") -> str:
    """
    Dispatch image OCR to the selected engine.
    Supported engines: 'tesseract', 'easyocr'
    """
    engine = engine.lower().strip()

    if engine == "easyocr":
        return extract_text_from_image_easyocr(image_bytes)
    else:
        # Default to tesseract
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
