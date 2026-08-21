from pathlib import Path
import random
import shutil

# Source YOLO dataset
src_images = Path(
    r".\RAW\Detection\Dataset4_Chicken\yolo\train\images"
)

src_labels = Path(
    r".\RAW\Detection\Dataset4_Chicken\yolo\train\labels"
)

# Destination CURATED dataset
dst = Path(
    r".\CURATED\Detection\Dataset4_Chicken"
)

# Fixed seed for reproducible split
random.seed(42)

# Find all images
images = sorted(src_images.glob("*.jpg"))

# Create valid image-label pairs
pairs = []

for image in images:
    label = src_labels / f"{image.stem}.txt"

    if label.exists():
        pairs.append((image, label))

# Shuffle pairs
random.shuffle(pairs)

# Total number of valid pairs
total = len(pairs)

# 70% Train
# 15% Validation
# 15% Test
train_count = int(total * 0.70)
val_count = int(total * 0.15)

train_pairs = pairs[:train_count]

val_pairs = pairs[
    train_count:train_count + val_count
]

test_pairs = pairs[
    train_count + val_count:
]

# Define splits
splits = {
    "train": train_pairs,
    "val": val_pairs,
    "test": test_pairs
}

# Copy files into CURATED
for split, split_pairs in splits.items():

    image_dir = dst / "images" / split
    label_dir = dst / "labels" / split

    image_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    label_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    for image, label in split_pairs:

        shutil.copy2(
            image,
            image_dir / image.name
        )

        shutil.copy2(
            label,
            label_dir / label.name
        )

# Final output
print(f"Total valid image-label pairs: {total}")
print(f"Train: {len(train_pairs)}")
print(f"Val:   {len(val_pairs)}")
print(f"Test:  {len(test_pairs)}")
print("RAW dataset was NOT modified.")
print("Dataset4_Chicken split completed successfully.")