import random
import shutil
from pathlib import Path

DATASET = Path("Dataset1_Cattle")

TRAIN_IMG = DATASET / "images" / "train"
VAL_IMG   = DATASET / "images" / "val"
TEST_IMG  = DATASET / "images" / "test"

TRAIN_LBL = DATASET / "labels" / "train"
VAL_LBL   = DATASET / "labels" / "val"
TEST_LBL  = DATASET / "labels" / "test"

random.seed(42)

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# Collect all image-label pairs from current train + val
pairs = []

for image_dir, label_dir in [
    (TRAIN_IMG, TRAIN_LBL),
    (VAL_IMG, VAL_LBL)
]:
    for img in image_dir.iterdir():
        if img.is_file() and img.suffix.lower() in IMAGE_EXTENSIONS:
            label = label_dir / (img.stem + ".txt")

            if label.exists():
                pairs.append((img, label))
            else:
                print(f"WARNING: Missing label: {img.name}")

print(f"Total valid image-label pairs: {len(pairs)}")

# Shuffle
random.shuffle(pairs)

total = len(pairs)

train_count = int(total * 0.70)
val_count = int(total * 0.15)
test_count = total - train_count - val_count

train_pairs = pairs[:train_count]
val_pairs = pairs[train_count:train_count + val_count]
test_pairs = pairs[train_count + val_count:]

# Create test directories
TEST_IMG.mkdir(parents=True, exist_ok=True)
TEST_LBL.mkdir(parents=True, exist_ok=True)

# Move everything first into test
# This clears old train/val locations without deleting files
for img, lbl in pairs:
    shutil.move(str(img), str(TEST_IMG / img.name))
    shutil.move(str(lbl), str(TEST_LBL / lbl.name))

# Now distribute into final splits
def move_pairs(pair_list, img_dest, lbl_dest):

    img_dest.mkdir(parents=True, exist_ok=True)
    lbl_dest.mkdir(parents=True, exist_ok=True)

    for img, lbl in pair_list:

        shutil.move(
            str(TEST_IMG / img.name),
            str(img_dest / img.name)
        )

        shutil.move(
            str(TEST_LBL / lbl.name),
            str(lbl_dest / lbl.name)
        )

move_pairs(train_pairs, TRAIN_IMG, TRAIN_LBL)
move_pairs(val_pairs, VAL_IMG, VAL_LBL)

print()
print("===================================")
print("Dataset1_Cattle SPLIT COMPLETE")
print("===================================")
print(f"Total : {total}")
print(f"Train : {train_count}")
print(f"Val   : {val_count}")
print(f"Test  : {test_count}")
print()
print("Split: 70% / 15% / 15%")