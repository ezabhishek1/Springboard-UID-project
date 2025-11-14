from flask import Flask, request, render_template, jsonify, flash, redirect, url_for
import cv2
import pytesseract
from PIL import Image
from PIL.ExifTags import TAGS
from ultralytics import YOLO
import os
import re
import numpy as np
from werkzeug.utils import secure_filename
import tempfile
import numpy as np
from huggingface_hub import hf_hub_download
from supervision import Detections
import requests
from skimage.metrics import structural_similarity as ssim
import xml.etree.ElementTree as ET
from pyzbar.pyzbar import decode
import supervision as sv

image_path = "./QR_CODE.png"

def decode_aadhaar_qr(image_path):
    try:
        image = Image.open(image_path)
        decoded_objects = decode(image)
        
        if not decoded_objects:
            return {"error": "QR Code not found or could not be read."}
            
        qr_data_raw = decoded_objects[0].data.decode('utf-8', errors='ignore')
        
        # FIX: Add a specific try/except block for XML parsing
        try:
            root = ET.fromstring(qr_data_raw)
            qr_attributes = root.attrib
            return {
                "name": qr_attributes.get("First Name"),
                "last_name": qr_attributes.get("Last Name"),
                "prefix": qr_attributes.get("Prefix"),
                "organization": qr_attributes.get("Organization"),
                "title": qr_attributes.get("Title"),
                "email": qr_attributes.get("Email"),
                "phone": qr_attributes.get("Phone"),
                "mobile_phone": qr_attributes.get("Mobile Phone"),
                "fax": qr_attributes.get("Fax"),
                "street": qr_attributes.get("Street")
            }
        except ET.ParseError:
            # This handles the case where the QR code contains non-XML data
            return {"error": "QR data is not valid XML.", "raw_data": qr_data_raw}
            
    except Exception as e:
        return {"error": f"QR Code processing failed: {str(e)}"}
    


results = decode_aadhaar_qr(image_path)


print(results)