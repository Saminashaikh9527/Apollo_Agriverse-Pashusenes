
from pathlib import Path
from collections import Counter

from ultralytics import YOLO


# ============================================================
# MODEL PATH
# ============================================================

MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "yolo"
    / "combined_livestock"
    / "best.pt"
)


# ============================================================
# LOAD YOLO MODEL
# ============================================================

print("Loading YOLO model...")
model = YOLO(str(MODEL_PATH))

print("YOLO model loaded successfully.")
print("Model:", MODEL_PATH)
print("Classes:", model.names)


# ============================================================
# SETTINGS
# ============================================================

DEFAULT_CONFIDENCE = 0.50


# ============================================================
# DETECT ANIMALS
# ============================================================

def detect_animals(image_path, confidence=DEFAULT_CONFIDENCE):

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(
            f"Image not found:\n{image_path}"
        )

    # --------------------------------------------------------
    # YOLO prediction
    # --------------------------------------------------------

    results = model.predict(
        source=str(image_path),
        conf=confidence,
        verbose=False
    )

    detections = []

    # --------------------------------------------------------
    # Read detections
    # --------------------------------------------------------

    for result in results:

        if result.boxes is None or len(result.boxes) == 0:
            continue

        for box in result.boxes:

            # Class ID
            class_id = int(box.cls[0].item())

            # Confidence
            confidence_score = float(
                box.conf[0].item()
            )

            # Class name
            class_name = model.names[class_id]

            # Bounding box
            x1, y1, x2, y2 = (
                box.xyxy[0]
                .cpu()
                .numpy()
                .tolist()
            )

            detections.append(
                {
                    "class": class_name,
                    "confidence": round(
                        confidence_score,
                        4
                    ),
                    "bbox": [
                        round(x1, 2),
                        round(y1, 2),
                        round(x2, 2),
                        round(y2, 2)
                    ]
                }
            )

    # --------------------------------------------------------
    # Sort detections by confidence
    # Highest confidence first
    # --------------------------------------------------------

    detections.sort(
        key=lambda x: x["confidence"],
        reverse=True
    )

    # --------------------------------------------------------
    # Count animals
    # --------------------------------------------------------

    counts = Counter(
        detection["class"]
        for detection in detections
    )

    counts = dict(
        sorted(
            counts.items(),
            key=lambda item: item[0]
        )
    )

    # --------------------------------------------------------
    # Confidence statistics
    # --------------------------------------------------------

    confidence_values = [
        detection["confidence"]
        for detection in detections
    ]

    if confidence_values:

        best_confidence = max(
            confidence_values
        )

        lowest_confidence = min(
            confidence_values
        )

        average_confidence = (
            sum(confidence_values)
            / len(confidence_values)
        )

    else:

        best_confidence = 0.0
        lowest_confidence = 0.0
        average_confidence = 0.0

    # --------------------------------------------------------
    # Final result
    # --------------------------------------------------------

    return {
        "image": str(image_path),

        "confidence_threshold": confidence,

        "total_animals": len(detections),

        "counts": counts,

        "confidence": {
            "best": round(
                best_confidence,
                4
            ),
            "average": round(
                average_confidence,
                4
            ),
            "lowest": round(
                lowest_confidence,
                4
            )
        },

        "detections": detections
    }


# ============================================================
# DIRECT TEST
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 60)
    print("YOLO11 LIVESTOCK DETECTION MODEL")
    print("=" * 60)

    print()
    print("Model path:")
    print(MODEL_PATH)

    print()
    print("Classes:")
    print(model.names)

    print()
    print("Default confidence threshold:")
    print(f"{DEFAULT_CONFIDENCE * 100:.0f}%")

    print()
    print("Model loaded successfully.")

