from pathlib import Path

from ultralytics import YOLO


# ============================================================
# PATH CONFIGURATION
# ============================================================

# Current file:
# backend/app/ai/yolo_service.py
#
# parents:
# parent        -> backend/app/ai
# parent.parent -> backend/app
# parent.parent.parent -> backend
#
# Therefore the model is:
# backend/app/ai/models/yolo/best.pt

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "yolo"
    / "best.pt"
)


# ============================================================
# MODEL CHECK
# ============================================================

if not MODEL_PATH.exists():

    raise FileNotFoundError(
        f"YOLO model not found: {MODEL_PATH}"
    )


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading backend YOLO model...")
print(f"YOLO model path: {MODEL_PATH}")

model = YOLO(str(MODEL_PATH))

print("Backend YOLO model loaded successfully.")


# ============================================================
# YOLO PREDICTION
# ============================================================

def predict_yolo(image_path: str) -> dict:
    """
    Run YOLO livestock detection on an image.

    Returns:
        {
            "status": "success",
            "model": "YOLO",
            "detections": [...],
            "count": int
        }
    """

    image = Path(image_path)

    # --------------------------------------------------------
    # Validate image
    # --------------------------------------------------------

    if not image.exists():

        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    # --------------------------------------------------------
    # Run inference
    # --------------------------------------------------------

    results = model(str(image))

    result = results[0]

    detections = []

    # --------------------------------------------------------
    # Extract detections
    # --------------------------------------------------------

    if result.boxes is not None:

        for box in result.boxes:

            class_id = int(
                box.cls.item()
            )

            confidence = float(
                box.conf.item()
            )

            coordinates = (
                box.xyxy[0]
                .tolist()
            )

            class_name = result.names.get(
                class_id,
                f"class_{class_id}"
            )

            detections.append(
                {
                    "class_id": class_id,

                    "class_name": class_name,

                    "confidence": round(
                        confidence,
                        4
                    ),

                    "bbox": [
                        round(float(value), 2)
                        for value in coordinates
                    ],
                }
            )

    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {

        "status": "success",

        "model": "YOLO",

        "detections": detections,

        "count": len(detections),

    }