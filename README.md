# AI-Powered Fraud Detection for UID Aadhaar

[](https://opensource.org/licenses/MIT)

![AI_Powered_Fraud_Detection_For_UID_Aadhar](https://socialify.git.ci/CoiferousYogi/AI_Powered_Fraud_Detection_For_UID_Aadhar/image?font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit+Board&pulls=1&stargazers=1&theme=Dark)


(https://opensource.org/licenses/MIT)


A full-stack web application built with Python and Flask that leverages a multi-layered AI/ML pipeline to detect fraudulent Aadhaar cards. This tool analyzes uploaded front and back images to determine authenticity based on a variety of security features, textual content, and metadata.

## Key Features

This project implements a robust analysis engine that combines multiple techniques to assess the authenticity of an Aadhaar card:

  * **Custom Object Detection (YOLOv8):** A custom YOLOv8 model trained to detect the presence, absence, and consistency of key visual anchors like the Emblem of India, Government of India banner, and other security features. It can also detect regions that show signs of tampering.

  * **Regions of Interest Annotations:** Utilizes a YOLO v8 model trained on a synthetic dataset of Aadhar card images to annotate Regions of Interest (ROIs) in the Aadhar Card images. The user can see the annotated regions alongwith their labels. 

  * **Text & Content Extraction (Tesseract OCR):** Utilizes a pre-trained YOLO model to locate text fields (Name, DOB, Gender, Address) and Tesseract OCR to extract the printed information in both English and Hindi.

  * **QR Code Cross-Validation:** Decodes the QR code on the back of the card to extract the digitally signed XML data and cross-references it with the text extracted via OCR. Any mismatch is a major indicator of fraud.

  * **Verhoeff Checksum Verification:** Algorithmically validates the 12-digit Aadhaar number using the Verhoeff checksum formula to check for correctness.

  * **EXIF Data Analysis:** Scans the image's metadata for traces of digital editing software, which could indicate manipulation.

-----

## Tech Stack

  * **Backend:** Python, Flask
  * **AI / ML:** PyTorch, Ultralytics (YOLOv8), OpenCV, Tesseract, Scikit-image
  * **Frontend:** HTML, Jinja2 Template Engine, TailwindCSS
  * **Data Handling:** Pillow, Pandas, NumPy

-----

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

You need to have Python 3.8+ and Tesseract OCR installed on your system.

  * **Python:** Can be downloaded from [python.org](https://www.python.org/downloads/).

  * **Tesseract OCR:** This is a crucial dependency for text extraction. Download the installer for your OS from the official repository:

      * [Tesseract at UB Mannheim](https://www.google.com/search?q=https://github.com/UB-Mannheim/tesseract/wiki)

    **Important:** During installation on Windows, make sure to add Tesseract to your system's PATH.
* **Note:** TesseractOCR supports multiple Indian languages. This project only extracts text in English and Hindi. For a wider language support, download the corresponding language packs from Tesseract's official webpage. 

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/CoiferousYogi/AI_Powered_Fraud_Detection_For_UID_Aadhar.git
    cd AI_Powered_Fraud_Detection_For_UID_Aadhar
    ```

2.  **Create and Activate a Virtual Environment**

    ```bash
    # For Windows
    python -m venv .venv
    .\.venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install Dependencies**
    All required Python libraries are listed in the `requirements.txt` file.

    ```bash
    pip install -r requirements.txt
    ```

-----

## Usage

Once the setup is complete, you can start the Flask web server with a single command.

1.  **Run the Application**

    ```bash
    python app.py
    ```

2.  **Access the Web Interface**
    Open your web browser and navigate to `http://127.0.0.1:5000`.

The server runs on port 5000 by default but can be configured within the `app.py` script.

-----

## Project Structure

```
├── models/             # Contains trained model files (e.g., best.pt)
├── static/             # For serving static files like annotated images
├── templates/          # Contains all HTML templates (index.html, results.html)
├── app.py              # Main Flask application file
├── requirements.txt    # List of all Python dependencies
└── ...
```

-----

## License

This project is open source and is made available under the **MIT License**. See the `LICENSE` file for more details.
