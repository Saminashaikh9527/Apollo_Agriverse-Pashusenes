from pathlib import Path
import shutil

# Original dataset
SOURCE = Path(".")

# New clean dataset
OUTPUT = Path("Dataset1_Cattle")

image_src = SOURCE / "train" / "images"
label_src = SOURCE / "train" / "labels"

image_dst = OUTPUT / "images" / "train"
label_dst = OUTPUT / "labels" / "train"

image_dst.mkdir(parents=True, exist_ok=True)
label_dst.mkdir(parents=True, exist_ok=True)

copied = 0
skipped = 0

# Find all images
for img in image_src.iterdir():

    if not img.is_file():
        continue

    if img.suffix.lower() not in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]:
        continue

    # Matching YOLO label
    label = label_src / f"{img.stem}.txt"

    if not label.exists():
        print(f"Skipping - label not found: {img.name}")
        skipped += 1
        continue

    # Read original labels
    new_lines = []

    for line in label.read_text().splitlines():

        parts = line.strip().split()

        # YOLO detection format:
        # class x_center y_center width height
        if len(parts) != 5:
            continue

        # IMPORTANT:
        # Dataset1 is confirmed as cattle.
        # Therefore every original class becomes:
        # 0 = Cattle
        parts[0] = "0"

        new_lines.append(" ".join(parts))

    # Copy image
    shutil.copy2(
        img,
        image_dst / img.name
    )

    # Save converted label
    output_label = label_dst / label.name

    output_label.write_text(
        "\n".join(new_lines) + "\n"
    )

    copied += 1

print()
print("===================================")
print("Dataset1_Cattle conversion DONE!")
print("===================================")
print(f"Images copied : {copied}")
print(f"Images skipped: {skipped}")

print()
print("Final class mapping:")
print("0 = Cattle")