# ============================================================
# PASHUSENSE - YOLO LIVESTOCK DETECTION SERVICE
# ============================================================
#
# File:
# backend/app/ai/yolo_service.py
#
# Purpose:
# - Load the trained YOLO livestock model
# - Detect animals from uploaded images
# - Apply explicit confidence threshold
# - Apply explicit IoU / NMS configuration
# - Return only final post-NMS detections
# - Calculate reliable animal counts
# - Return class-wise counts
#
# ============================================================

from pathlib import Path
from collections import Counter

from ultralytics import YOLO


# ============================================================
# PATH CONFIGURATION
# ============================================================

# Current file:
# backend/app/ai/yolo_service.py
#
# Parent structure:
#
# backend/
# └── app/
#     └── ai/
#         ├── yolo_service.py
#         └── models/
#             └── yolo/
#                 └── best.pt

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "yolo"
    / "best.pt"
)


# ============================================================
# YOLO CONFIGURATION
# ============================================================

# Minimum confidence required for a detection.
#
# 0.25 is a reasonable starting point for livestock detection.
# This prevents extremely weak detections from being counted.
CONFIDENCE_THRESHOLD = 0.25


# IoU threshold used by YOLO NMS.
#
# Lower value:
# - more aggressive duplicate removal
#
# Higher value:
# - allows more overlapping detections
#
# 0.45 is a standard starting value.
NMS_IOU_THRESHOLD = 0.45


# Maximum number of detections returned from one image.
#
# This prevents an image from producing an excessive number
# of boxes due to false positives.
MAX_DETECTIONS = 100


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
# HELPER - NORMALIZE CLASS NAME
# ============================================================

def _get_class_name(names, class_id: int) -> str:
    """
    Safely retrieve the class name from the YOLO model.
    """

    try:
        if isinstance(names, dict):
            return str(
                names.get(
                    class_id,
                    f"class_{class_id}"
                )
            )

        if isinstance(names, list):
            if 0 <= class_id < len(names):
                return str(names[class_id])

    except Exception:
        pass

    return f"class_{class_id}"


# ============================================================
# HELPER - ROUND BOUNDING BOX
# ============================================================

def _round_bbox(coordinates) -> list:
    """
    Convert YOLO xyxy coordinates into clean JSON-safe values.
    """

    return [
        round(float(value), 2)
        for value in coordinates
    ]


# ============================================================
# HELPER - CLASS COUNTS
# ============================================================

def _build_class_counts(detections: list) -> dict:
    """
    Build class-wise detection counts.

    Example:
    {
        "Chicken": 5,
        "Cow": 2
    }
    """

    counter = Counter(
        detection["class_name"]
        for detection in detections
    )

    return dict(
        sorted(
            counter.items(),
            key=lambda item: item[0].lower()
        )
    )


# ============================================================
# YOLO PREDICTION
# ============================================================

def predict_yolo(image_path: str) -> dict:
    """
    Run YOLO livestock detection on an image.

    YOLO performs:
        1. Object detection
        2. Confidence filtering
        3. Non-Maximum Suppression (NMS)

    Returns:
        {
            "status": "success",
            "model": "YOLO",
            "confidence_threshold": 0.25,
            "nms_iou_threshold": 0.45,
            "detections": [...],
            "count": int,
            "class_counts": {...}
        }
    """

    # --------------------------------------------------------
    # VALIDATE IMAGE PATH
    # --------------------------------------------------------

    image = Path(image_path)

    if not image.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    if not image.is_file():
        raise ValueError(
            f"Image path is not a file: {image_path}"
        )

    # --------------------------------------------------------
    # RUN YOLO INFERENCE
    # --------------------------------------------------------
    #
    # IMPORTANT:
    #
    # We explicitly specify:
    #
    # conf = minimum confidence
    # iou  = NMS IoU threshold
    # max_det = maximum final detections
    #
    # Ultralytics performs NMS internally before returning
    # result.boxes.
    # --------------------------------------------------------

    results = model.predict(
        source=str(image),
        conf=CONFIDENCE_THRESHOLD,
        iou=NMS_IOU_THRESHOLD,
        max_det=MAX_DETECTIONS,
        verbose=False,
    )

    if not results:
        return {
            "status": "success",
            "model": "YOLO",
            "confidence_threshold": CONFIDENCE_THRESHOLD,
            "nms_iou_threshold": NMS_IOU_THRESHOLD,
            "max_detections": MAX_DETECTIONS,
            "detections": [],
            "count": 0,
            "class_counts": {},
            "detected_species": None,
            "message": "No animals detected."
        }

    result = results[0]

    detections = []

    # --------------------------------------------------------
    # EXTRACT FINAL POST-NMS DETECTIONS
    # --------------------------------------------------------

    if result.boxes is not None:

        for box in result.boxes:

            # ------------------------------------------------
            # CLASS ID
            # ------------------------------------------------

            class_id = int(
                box.cls.item()
            )

            # ------------------------------------------------
            # CONFIDENCE
            # ------------------------------------------------

            confidence = float(
                box.conf.item()
            )

            # ------------------------------------------------
            # BOUNDING BOX
            # ------------------------------------------------

            coordinates = (
                box.xyxy[0]
                .tolist()
            )

            # ------------------------------------------------
            # CLASS NAME
            # ------------------------------------------------

            class_name = _get_class_name(
                result.names,
                class_id
            )

            # ------------------------------------------------
            # SAFETY FILTER
            # ------------------------------------------------
            #
            # Normally Ultralytics already applied the
            # confidence threshold.
            #
            # We keep this additional check so that only
            # detections that satisfy our configured threshold
            # can enter the final result.
            # ------------------------------------------------

            if confidence < CONFIDENCE_THRESHOLD:
                continue

            detections.append(
                {
                    "class_id": class_id,

                    "class_name": class_name,

                    "confidence": round(
                        confidence,
                        4
                    ),

                    "bbox": _round_bbox(
                        coordinates
                    ),
                }
            )

    # --------------------------------------------------------
    # SORT DETECTIONS
    # --------------------------------------------------------
    #
    # Highest confidence first.
    #
    # This makes the response deterministic and makes the
    # Digital Twin easier to consume.
    # --------------------------------------------------------

    detections.sort(
        key=lambda detection: detection["confidence"],
        reverse=True
    )

    # --------------------------------------------------------
    # FINAL COUNT
    # --------------------------------------------------------

    total_count = len(detections)

    # --------------------------------------------------------
    # CLASS-WISE COUNTS
    # --------------------------------------------------------

    class_counts = _build_class_counts(
        detections
    )

    # --------------------------------------------------------
    # DETECTED SPECIES
    # --------------------------------------------------------
    #
    # If one species dominates, return it.
    #
    # If multiple species are detected, return "Mixed".
    #
    # Example:
    #
    # Cow x 3
    # Chicken x 1
    #
    # detected_species = "Mixed"
    # --------------------------------------------------------

    if not class_counts:
        detected_species = None

    elif len(class_counts) == 1:
        detected_species = next(
            iter(class_counts)
        )

    else:
        detected_species = "Mixed"

    # --------------------------------------------------------
    # RETURN FINAL RESULT
    # --------------------------------------------------------

    return {
        "status": "success",

        "model": "YOLO",

        "confidence_threshold": CONFIDENCE_THRESHOLD,

        "nms_iou_threshold": NMS_IOU_THRESHOLD,

        "max_detections": MAX_DETECTIONS,

        "detections": detections,

        "count": total_count,

        "class_counts": class_counts,

        "detected_species": detected_species,
    }