import pytesseract
from PIL import Image
import pypdf
import io

def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Extracts text from an image byte stream using Tesseract OCR.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return f"Error extracting text from image: {str(e)}"

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF byte stream.
    Tries native extraction first, falls back to OCR if needed (simplified here to just native for speed, 
    can be expanded to convert to images if native fails).
    """
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # If very little text was extracted, it might be a scanned PDF.
        # Ideally we would detect this and use OCR, but for MVP we return what we found
        # or a message suggesting it might be scanned.
        if len(text.strip()) < 10:
             return "[Make sure your PDF contains selectable text. Scanned PDFs support coming soon.]"
             
        return text
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"
