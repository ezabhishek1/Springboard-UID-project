FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzbar0 \
    tesseract-ocr \
    tesseract-ocr-hin \
    libtesseract-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 10000

# Run with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "--workers", "2", "--timeout", "120", "app:app"]