
from pathlib import Path
from ultralytics import YOLO

MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "yolo"
    / "combined_livestock"
    / "best.pt"
)

model = YOLO(str(MODEL_PATH))


def detect_animals(image_path, confidence=0.25):
    results = model.predict(
        source=image_path,
        conf=confidence,
        verbose=False
    )

    detections = []
    counts = {}

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence_score = float(box.conf[0])
            class_name = model.names[class_id]

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            detections.append({
                "class": class_name,
                "confidence": round(confidence_score, 3),
                "bbox": [
                    round(x1, 2),
                    round(y1, 2),
                    round(x2, 2),
                    round(y2, 2)
                ]
            })

            counts[class_name] = counts.get(class_name, 0) + 1

    return {
        "detections": detections,
        "counts": counts
    }


if __name__ == "__main__":
    print("YOLO11n model loaded successfully!")
    print("Model:", MODEL_PATH)
    print("Classes:", model.names)