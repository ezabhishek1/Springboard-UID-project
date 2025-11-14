from ultralytics import YOLO

model = YOLO('yolov8n.pt')

if __name__ == '__main__':
    results = model.train(
        data='data.yaml',  
        epochs=100,       
        imgsz=640,         
        project='Aadhaar_Detection', 
        name='run1'     
    )