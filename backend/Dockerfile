# Use an official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.11-slim

# Install system dependencies
# - tesseract-ocr: Needed for OCR
# - libgl1: Needed for opencv-python-headless (if used by any OCR lib)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port that Uvicorn will run on
EXPOSE 8000

# Run the application
# Use 0.0.0.0 to bind to all interfaces for external access
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
