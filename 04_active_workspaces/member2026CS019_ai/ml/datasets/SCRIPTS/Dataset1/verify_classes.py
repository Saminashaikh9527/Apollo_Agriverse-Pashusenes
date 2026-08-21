from pathlib import Path
import cv2
import random

# Dataset paths
BASE = Path(__file__).parent
IMAGE_DIR = BASE / "train" / "images"
LABEL_DIR = BASE / "train" / "labels"
OUTPUT_DIR = BASE / "class_samples"

OUTPUT_DIR.mkdir(exist_ok=True)

# Create folders for classes 0-11
for class_id in range(12):
    (OUTPUT_DIR / f"class_{class_id}").mkdir(exist_ok=True)

# Image extensions
extensions = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# Find images
images = [
    p for p in IMAGE_DIR.iterdir()
    if p.suffix.lower() in extensions
]

# Store images by class
class_images = {i: [] for i in range(12)}

for image_path in images:

    label_path = LABEL_DIR / f"{image_path.stem}.txt"

    if not label_path.exists():
        continue

    try:
        image = cv2.imread(str(image_path))

        if image is None:
            continue

        height, width = image.shape[:2]

        lines = label_path.read_text().splitlines()

        found_classes = set()

        for line in lines:

            parts = line.split()

            if len(parts) < 5:
                continue

            class_id = int(parts[0])

            if class_id < 0 or class_id >= 12:
                continue

            x_center = float(parts[1])
            y_center = float(parts[2])
            box_width = float(parts[3])
            box_height = float(parts[4])

            # Convert normalized YOLO coordinates to pixels
            x1 = int((x_center - box_width / 2) * width)
            y1 = int((y_center - box_height / 2) * height)
            x2 = int((x_center + box_width / 2) * width)
            y2 = int((y_center + box_height / 2) * height)

            # Keep coordinates inside image
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(width - 1, x2)
            y2 = min(height - 1, y2)

            # Draw bounding box
            cv2.rectangle(
                image,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            # Write ORIGINAL class ID
            text = f"CLASS {class_id}"

            cv2.putText(
                image,
                text,
                (x1, max(25, y1 - 5)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 0),
                2
            )

            found_classes.add(class_id)

        # Save image for each class present
        for class_id in found_classes:

            folder = OUTPUT_DIR / f"class_{class_id}"

            # Maximum 10 samples per class
            existing = list(folder.glob("*"))

            if len(existing) < 10:

                output_file = folder / image_path.name

                cv2.imwrite(
                    str(output_file),
                    image
                )

                class_images[class_id].append(image_path.name)

    except Exception as e:
        print(f"Error processing {image_path.name}: {e}")


print()
print("====================================")
print("CLASS VERIFICATION COMPLETE")
print("====================================")
print()

for class_id in range(12):

    count = len(class_images[class_id])

    print(f"Class {class_id}: {count} sample images")

print()
print(f"Samples saved in:")
print(OUTPUT_DIR)