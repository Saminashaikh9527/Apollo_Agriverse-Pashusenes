from pathlib import Path
from collections import Counter

import cv2
import numpy as np
import tensorflow as tf
from ultralytics import YOLO


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

YOLO_MODEL_PATH = BASE_DIR / "models" / "yolo" / "combined_livestock" / "best.pt"
CNN_MODEL_PATH = BASE_DIR / "models" / "cnn" / "livestock_cnn_13class.keras"
IMAGE_PATH = BASE_DIR / "test_images" / "test.jpg"


# ============================================================
# CNN CLASS NAMES
# IMPORTANT: Must match the order used during CNN training
# ============================================================

CLASS_NAMES = [
    "Buffalo_Lumpy_Skin_Disease",
    "Buffalo_Normal_Skin",
    "Chicken_Coccidiosis",
    "Chicken_Healthy",
    "Chicken_Newcastle_Disease",
    "Chicken_Salmonella",
    "Cow_Foot_and_Mouth_Disease",
    "Cow_Healthy",
    "Cow_Lumpy_Skin_Disease",
    "Goat_Healthy",
    "Goat_Unhealthy",
    "Sheep_No_Pain",
    "Sheep_Pain"
]


# ============================================================
# SETTINGS
# ============================================================

YOLO_CONFIDENCE = 0.25
CNN_CONFIDENCE_THRESHOLD = 0.50
IMAGE_SIZE = 224


# ============================================================
# LOAD MODELS
# ============================================================

print("Loading YOLO model...")
yolo_model = YOLO(str(YOLO_MODEL_PATH))
print("YOLO loaded successfully.")

print("Loading CNN model...")
cnn_model = tf.keras.models.load_model(str(CNN_MODEL_PATH))
print("CNN loaded successfully.")


# ============================================================
# CHECK IMAGE
# ============================================================

if not IMAGE_PATH.exists():
    print()
    print("ERROR: Test image not found.")
    print("Expected:")
    print(IMAGE_PATH)
    raise SystemExit(1)


# ============================================================
# READ IMAGE
# ============================================================

image = cv2.imread(str(IMAGE_PATH))

if image is None:
    print()
    print("ERROR: Could not read image.")
    print(IMAGE_PATH)
    raise SystemExit(1)


# ============================================================
# YOLO DETECTION
# ============================================================

results = yolo_model(
    image,
    conf=YOLO_CONFIDENCE,
    verbose=False
)

result = results[0]


# ============================================================
# NO DETECTION
# ============================================================

if result.boxes is None or len(result.boxes) == 0:
    print()
    print("========================================")
    print("YOLO + CNN PREDICTION")
    print("========================================")
    print()
    print("Total Animals Detected: 0")
    print()
    print("No animals detected.")
    print()
    print("========================================")
    print("Prediction completed.")
    print("========================================")
    raise SystemExit(0)


# ============================================================
# GET DETECTIONS
# ============================================================

boxes = result.boxes

animal_names = []
detections = []

for i in range(len(boxes)):

    class_id = int(boxes.cls[i].item())
    yolo_conf = float(boxes.conf[i].item())

    animal_name = result.names[class_id]

    # Bounding box
    x1, y1, x2, y2 = boxes.xyxy[i].cpu().numpy().astype(int)

    # Keep coordinates inside image
    h, w = image.shape[:2]

    x1 = max(0, min(x1, w - 1))
    y1 = max(0, min(y1, h - 1))
    x2 = max(0, min(x2, w))
    y2 = max(0, min(y2, h))

    # Crop animal
    crop = image[y1:y2, x1:x2]

    if crop.size == 0:
        continue

    animal_names.append(animal_name)

    detections.append({
        "animal": animal_name,
        "yolo_conf": yolo_conf,
        "crop": crop
    })


# ============================================================
# ANIMAL COUNT
# ============================================================

total_animals = len(detections)

animal_counts = Counter(animal_names)


# ============================================================
# PRINT HEADER
# ============================================================

print()
print("========================================")
print("YOLO + CNN PREDICTION")
print("========================================")
print()

print(f"Total Animals Detected: {total_animals}")

print()
print("Animal Count:")

for animal, count in sorted(animal_counts.items()):
    print(f"{animal}: {count}")


# ============================================================
# CNN CLASSIFICATION FOR EACH ANIMAL
# ============================================================

print()

for index, detection in enumerate(detections, start=1):

    animal = detection["animal"]
    yolo_conf = detection["yolo_conf"]
    crop = detection["crop"]

    # --------------------------------------------------------
    # Prepare crop for CNN
    # --------------------------------------------------------

    crop_rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)

    crop_resized = cv2.resize(
        crop_rgb,
        (IMAGE_SIZE, IMAGE_SIZE)
    )

    crop_array = crop_resized.astype(np.float32) / 255.0

    crop_array = np.expand_dims(
        crop_array,
        axis=0
    )

    # --------------------------------------------------------
    # CNN prediction
    # --------------------------------------------------------

    predictions = cnn_model.predict(
        crop_array,
        verbose=0
    )[0]

    cnn_class_index = int(np.argmax(predictions))
    cnn_confidence = float(predictions[cnn_class_index])

    predicted_class = CLASS_NAMES[cnn_class_index]

    # --------------------------------------------------------
    # Make sure CNN result belongs to detected animal
    # --------------------------------------------------------

    if not predicted_class.startswith(animal + "_"):

        matching_indices = [
            i for i, name in enumerate(CLASS_NAMES)
            if name.startswith(animal + "_")
        ]

        if matching_indices:

            best_matching_index = max(
                matching_indices,
                key=lambda i: predictions[i]
            )

            matching_confidence = float(
                predictions[best_matching_index]
            )

            predicted_class = CLASS_NAMES[best_matching_index]
            cnn_confidence = matching_confidence

        else:
            predicted_class = "Uncertain"

    # --------------------------------------------------------
    # Confidence threshold
    # --------------------------------------------------------

    if cnn_confidence < CNN_CONFIDENCE_THRESHOLD:
        health_result = "Uncertain"
    else:
        health_result = predicted_class

    # --------------------------------------------------------
    # Print result
    # --------------------------------------------------------

    print("----------------------------------------")
    print(f"Animal {index}")
    print(f"Animal: {animal}")
    print(f"YOLO Confidence: {yolo_conf * 100:.2f}%")
    print(f"Health/Disease: {health_result}")
    print(f"CNN Confidence: {cnn_confidence * 100:.2f}%")


# ============================================================
# FINAL SUMMARY
# ============================================================

print()
print("========================================")
print("FINAL SUMMARY")
print("========================================")

print(f"Total Animals Detected: {total_animals}")

print()
print("Animal Count:")

for animal, count in sorted(animal_counts.items()):
    print(f"{animal}: {count}")

print()
print("========================================")
print("Prediction completed.")
print("========================================")