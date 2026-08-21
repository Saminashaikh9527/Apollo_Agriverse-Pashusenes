from pathlib import Path
import random
import shutil

# ============================================================
# Dataset1_Cow - Safe 70/15/15 Split
# ============================================================

DATASET_DIR = Path(
    r"G:\Intership\agrolens-plf\04_active_workspaces\member2026CS019_ai\ml\datasets\CURATED\Detection\Dataset1_Cow"
)

SOURCE_IMAGES = DATASET_DIR / "train" / "images"
SOURCE_LABELS = DATASET_DIR / "train" / "labels"

TEMP_DIR = DATASET_DIR / "_split_temp"

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

RANDOM_SEED = 42

# ============================================================
# Check source
# ============================================================

if not SOURCE_IMAGES.exists():
    raise FileNotFoundError(f"Images folder not found: {SOURCE_IMAGES}")

if not SOURCE_LABELS.exists():
    raise FileNotFoundError(f"Labels folder not found: {SOURCE_LABELS}")

# ============================================================
# Collect original image-label pairs
# ============================================================

images = sorted(
    p for p in SOURCE_IMAGES.iterdir()
    if p.is_file() and p.suffix.lower() in [".jpg", ".jpeg", ".png"]
)

pairs = []

for image in images:
    label = SOURCE_LABELS / f"{image.stem}.txt"

    if label.exists():
        pairs.append((image, label))
    else:
        print(f"WARNING: Missing label: {image.name}")

if not pairs:
    raise RuntimeError("No valid image-label pairs found.")

print(f"Total valid image-label pairs: {len(pairs)}")

# ============================================================
# Create temporary backup
# ============================================================

TEMP_IMAGES = TEMP_DIR / "images"
TEMP_LABELS = TEMP_DIR / "labels"

TEMP_IMAGES.mkdir(parents=True, exist_ok=True)
TEMP_LABELS.mkdir(parents=True, exist_ok=True)

print("Creating temporary backup...")

for image, label in pairs:
    shutil.copy2(image, TEMP_IMAGES / image.name)
    shutil.copy2(label, TEMP_LABELS / label.name)

print("Temporary backup created.")

# ============================================================
# Shuffle pairs
# ============================================================

random.seed(RANDOM_SEED)
random.shuffle(pairs)

# ============================================================
# Calculate split sizes
# ============================================================

total = len(pairs)

train_count = int(total * TRAIN_RATIO)
val_count = int(total * VAL_RATIO)
test_count = total - train_count - val_count

train_pairs = pairs[:train_count]
val_pairs = pairs[train_count:train_count + val_count]
test_pairs = pairs[train_count + val_count:]

splits = {
    "train": train_pairs,
    "val": val_pairs,
    "test": test_pairs
}

# ============================================================
# Clear old CURATED train files
# ============================================================

print("Preparing split directories...")

for file in SOURCE_IMAGES.iterdir():
    if file.is_file():
        file.unlink()

for file in SOURCE_LABELS.iterdir():
    if file.is_file():
        file.unlink()

# ============================================================
# Create val/test directories
# ============================================================

for split in ["train", "val", "test"]:

    (DATASET_DIR / split / "images").mkdir(
        parents=True,
        exist_ok=True
    )

    (DATASET_DIR / split / "labels").mkdir(
        parents=True,
        exist_ok=True
    )

# ============================================================
# Copy split files from temporary backup
# ============================================================

for split, split_pairs in splits.items():

    image_dir = DATASET_DIR / split / "images"
    label_dir = DATASET_DIR / split / "labels"

    for image, label in split_pairs:

        temp_image = TEMP_IMAGES / image.name
        temp_label = TEMP_LABELS / label.name

        shutil.copy2(
            temp_image,
            image_dir / image.name
        )

        shutil.copy2(
            temp_label,
            label_dir / label.name
        )

# ============================================================
# Update data.yaml
# ============================================================

yaml_content = """path: .
train: train/images
val: val/images
test: test/images

nc: 1

names:
  0: Cow
"""

(DATASET_DIR / "data.yaml").write_text(
    yaml_content,
    encoding="utf-8"
)

# ============================================================
# Remove temporary backup
# ============================================================

shutil.rmtree(TEMP_DIR)

# ============================================================
# Final report
# ============================================================

print()
print("===================================")
print("Dataset split completed successfully")
print("===================================")
print(f"Total : {total}")
print(f"Train : {train_count}")
print(f"Val   : {val_count}")
print(f"Test  : {test_count}")
print(f"Total check : {train_count + val_count + test_count}")
print("===================================")
print("RAW dataset was NOT modified.")
print("===================================")