from ultralytics import YOLO
from huggingface_hub import hf_hub_download
from supervision import Detections
import cv2
import numpy as np
from PIL import Image
import pytesseract
import requests
import os

# repo details
repo_config = dict(
    repo_id = "arnabdhar/YOLOv8-nano-aadhar-card",
    filename = "model.pt",
    local_dir = "./models"
)

# load model
model = YOLO(hf_hub_download(**repo_config))

# get id to label mapping
id2label = model.names
print(id2label)

# Perform Inference
image_path = "C:/Users/ritwi/Downloads/Aadhar1.jpg"

detections = Detections.from_ultralytics(model.predict(image_path)[0])


print(detections)
print(type(detections))


# Load the image
if os.path.exists(image_path):
    image = np.array(Image.open(image_path))
else:
    image = np.array(Image.open(requests.get(image_path, stream=True).raw))

# Dictionary to store extracted text
aadhaar_data = {}

for bbox, cls_name in zip(detections.xyxy, detections.data['class_name']):
    x1, y1, x2, y2 = map(int, bbox)  # bounding box coords
    roi = image[y1:y2, x1:x2]        # crop region
    
    # OCR on ROI
    text = pytesseract.image_to_string(roi, lang="eng+hin")  # for Hindi+English
    
    # Clean text
    text = text.strip()
    
    aadhaar_data[cls_name] = text

print(aadhaar_data)
