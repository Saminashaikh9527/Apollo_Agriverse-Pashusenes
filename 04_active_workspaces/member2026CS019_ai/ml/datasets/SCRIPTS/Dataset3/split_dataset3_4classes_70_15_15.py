from pathlib import Path
import random
import shutil

# Source: current curated Dataset3
BASE = Path(r".\CURATED\Detection\Dataset3_4classes")

# Existing images and labels
IMAGE_SRC = BASE / "images"
LABEL_SRC = BASE / "labels"

# Temporary collection of all image-label pairs
TEMP = BASE / "_all_pairs"

# Final 70/15/15 structure
FINAL = BASE

random.seed(42)

# --------------------------------------------------
# 1. Collect all image-label pairs
# --------------------------------------------------

pairs = []

for split in ["train", "val"]:
    image_dir = IMAGE_SRC / split
    label_dir = LABEL_SRC / split

    for image in image_dir.iterdir():
        if image.suffix.lower() not in [".jpg", ".jpeg", ".png"]:
            continue

        label = label_dir / (image.stem + ".txt")

        if label.exists():
            pairs.append((image, label))

print(f"Total valid image-label pairs: {len(pairs)}")

# --------------------------------------------------
# 2. Shuffle
# --------------------------------------------------

random.shuffle(pairs)

total = len(pairs)

train_count = round(total * 0.70)
val_count = round(total * 0.15)
test_count = total - train_count - val_count

print(f"Train: {train_count}")
print(f"Val:   {val_count}")
print(f"Test:  {test_count}")

# --------------------------------------------------
# 3. Create temporary folders
# --------------------------------------------------

if TEMP.exists():
    shutil.rmtree(TEMP)

for split in ["train", "val", "test"]:
    (TEMP / "images" / split).mkdir(parents=True, exist_ok=True)
    (TEMP / "labels" / split).mkdir(parents=True, exist_ok=True)

# --------------------------------------------------
# 4. Copy pairs into temporary split
# --------------------------------------------------

splits = {
    "train": pairs[:train_count],
    "val": pairs[train_count:train_count + val_count],
    "test": pairs[train_count + val_count:]
}

for split, split_pairs in splits.items():

    for image, label in split_pairs:

        shutil.copy2(
            image,
            TEMP / "images" / split / image.name
        )

        shutil.copy2(
            label,
            TEMP / "labels" / split / label.name
        )

# --------------------------------------------------
# 5. Remove old images/labels
# --------------------------------------------------

for folder in [IMAGE_SRC, LABEL_SRC]:

    if folder.exists():
        shutil.rmtree(folder)

# --------------------------------------------------
# 6. Move final structure
# --------------------------------------------------

shutil.move(
    str(TEMP / "images"),
    str(IMAGE_SRC)
)

shutil.move(
    str(TEMP / "labels"),
    str(LABEL_SRC)
)

# Remove temporary folder
if TEMP.exists():
    shutil.rmtree(TEMP)

# --------------------------------------------------
# 7. Create/update data.yaml
# --------------------------------------------------

yaml_content = """path: .

train: images/train
val: images/val
test: images/test

nc: 4

names:
  0: Cattle
  1: Goat
  2: Sheep
  3: Buffalo
"""

(BASE / "data.yaml").write_text(
    yaml_content,
    encoding="utf-8"
)

print()
print("Dataset3_4classes 70/15/15 split completed successfully.")
print("RAW dataset was NOT modified.")
print(f"Total: {total}")
print(f"Train: {train_count}")
print(f"Val:   {val_count}")
print(f"Test:  {test_count}")