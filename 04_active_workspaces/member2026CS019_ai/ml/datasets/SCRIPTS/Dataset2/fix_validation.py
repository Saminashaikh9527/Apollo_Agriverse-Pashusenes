from pathlib import Path
import shutil

SOURCE = Path("../Dataset2")
DEST = Path(".")

CLASS_MAP = {
    2: 0,    # Cattle
    3: 1,    # Goat
    6: 2,    # Sheep
    10: 2,   # Sheep -> combine
    8: 3     # Buffalo
}

source_images = SOURCE / "images" / "validation"
source_labels = SOURCE / "labels" / "validation"

dest_images = DEST / "images" / "val"
dest_labels = DEST / "labels" / "val"

count = 0

for label_file in source_labels.glob("*.txt"):

    new_lines = []

    with open(label_file, "r") as f:
        for line in f:
            parts = line.strip().split()

            if len(parts) != 5:
                continue

            old_class = int(parts[0])

            if old_class not in CLASS_MAP:
                continue

            parts[0] = str(CLASS_MAP[old_class])
            new_lines.append(" ".join(parts))

    if not new_lines:
        continue

    image_file = None

    for ext in [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]:
        candidate = source_images / (label_file.stem + ext)

        if candidate.exists():
            image_file = candidate
            break

    if image_file is None:
        print("Image not found:", label_file.name)
        continue

    shutil.copy2(
        image_file,
        dest_images / image_file.name
    )

    with open(dest_labels / label_file.name, "w") as f:
        f.write("\n".join(new_lines) + "\n")

    count += 1

print(f"Validation: copied {count} images")
print("Validation conversion complete!")