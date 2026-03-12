import sys
import os
sys.path.append('/home/kashifullah/KBIT/backend')

from backend.ocr_service import extract_text_from_image_tesseract
from PIL import Image
import io

# Create a dummy image
img = Image.new('RGB', (100, 30), color = (73, 109, 137))
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='PNG')
img_bytes = img_byte_arr.getvalue()

print("Extracting...")
try:
    result = extract_text_from_image_tesseract(img_bytes)
    print("Result:", repr(result))
except Exception as e:
    print("Exception:", str(e))
