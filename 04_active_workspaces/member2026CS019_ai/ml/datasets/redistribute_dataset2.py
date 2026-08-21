import random
import shutil
from pathlib import Path

# ============================================================
# DATASET SETTINGS
# ============================================================

DATASET = Path("Dataset2_4classes")

SPLITS = ["train", "val", "test"]

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp"
}

RANDOM_SEED = 42


# ============================================================
# CHECK DATASET
# ============================================================

if not DATASET.exists():
    raise RuntimeError(
        f"Dataset folder not found: {DATASET.resolve()}"
    )

print("=" * 60)
print("Dataset2_4classes - 70/15/15 Redistribution")
print("=" * 60)

print(f"\nDataset location:")
print(DATASET.resolve())


# ============================================================
# COLLECT ALL IMAGE-LABEL PAIRS
# ============================================================

pairs = []

print("\nCollecting image-label pairs...")

for split in SPLITS:

    image_dir = DATASET / "images" / split
    label_dir = DATASET / "labels" / split

    if not image_dir.exists():
        raise RuntimeError(
            f"Missing image folder: {image_dir}"
        )

    if not label_dir.exists():
        raise RuntimeError(
            f"Missing label folder: {label_dir}"
        )

    for image in image_dir.iterdir():

        if not image.is_file():
            continue

        if image.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        label = label_dir / f"{image.stem}.txt"

        if not label.exists():

            print(
                f"WARNING: Label missing for image: "
                f"{image.name}"
            )

            continue

        pairs.append(
            {
                "image": image,
                "label": label,
                "original_split": split
            }
        )


# ============================================================
# BASIC VALIDATION
# ============================================================

print(f"\nTotal valid image-label pairs: {len(pairs)}")

if len(pairs) == 0:
    raise RuntimeError(
        "No valid image-label pairs found."
    )


# ============================================================
# CHECK FOR DUPLICATE IMAGE NAMES
# ============================================================

image_names = [
    item["image"].name
    for item in pairs
]

duplicate_names = {
    name
    for name in image_names
    if image_names.count(name) > 1
}

if duplicate_names:

    print("\nERROR: Duplicate image names found:")

    for name in sorted(duplicate_names):
        print(f"  {name}")

    raise RuntimeError(
        "Duplicate image names detected. "
        "Stopping to prevent files from being overwritten."
    )


# ============================================================
# CHECK FOR DUPLICATE LABEL NAMES
# ============================================================

label_names = [
    item["label"].name
    for item in pairs
]

duplicate_labels = {
    name
    for name in label_names
    if label_names.count(name) > 1
}

if duplicate_labels:

    print("\nERROR: Duplicate label names found:")

    for name in sorted(duplicate_labels):
        print(f"  {name}")

    raise RuntimeError(
        "Duplicate label names detected."
    )


# ============================================================
# SHOW CURRENT DATASET SIZE
# ============================================================

total = len(pairs)

print("\nCurrent dataset:")
print(f"Total images : {total}")


# ============================================================
# CALCULATE 70 / 15 / 15
# ============================================================

train_count = int(total * 0.70)

val_count = int(total * 0.15)

test_count = total - train_count - val_count


print("\nTarget split:")
print(f"Train : {train_count}")
print(f"Val   : {val_count}")
print(f"Test  : {test_count}")
print(f"Total : {train_count + val_count + test_count}")


# ============================================================
# SHUFFLE DATASET
# ============================================================

print("\nShuffling dataset...")

random.seed(RANDOM_SEED)

random.shuffle(pairs)


# ============================================================
# CREATE SPLIT LISTS
# ============================================================

train_pairs = pairs[
    :train_count
]

val_pairs = pairs[
    train_count:
    train_count + val_count
]

test_pairs = pairs[
    train_count + val_count:
]


split_data = {
    "train": train_pairs,
    "val": val_pairs,
    "test": test_pairs
}


# ============================================================
# TEMPORARY DIRECTORY
# ============================================================

TEMP = DATASET / "_split_temp"

if TEMP.exists():

    raise RuntimeError(
        f"Temporary folder already exists:\n"
        f"{TEMP}\n\n"
        "This may indicate that a previous operation "
        "did not finish. Please check it before running again."
    )


TEMP_IMAGES = TEMP / "images"

TEMP_LABELS = TEMP / "labels"


TEMP_IMAGES.mkdir(
    parents=True,
    exist_ok=True
)

TEMP_LABELS.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# MOVE ALL FILES TO TEMPORARY STORAGE
# ============================================================

print("\nMoving files to temporary storage...")

moved_to_temp = []

try:

    for item in pairs:

        image = item["image"]
        label = item["label"]

        temp_image = TEMP_IMAGES / image.name
        temp_label = TEMP_LABELS / label.name

        shutil.move(
            str(image),
            str(temp_image)
        )

        shutil.move(
            str(label),
            str(temp_label)
        )

        moved_to_temp.append(
            (temp_image, temp_label, image, label)
        )

except Exception as error:

    print("\nERROR while moving files.")
    print(error)

    print(
        "\nPlease do not run the script again immediately."
    )

    raise


# ============================================================
# MOVE FILES INTO FINAL TRAIN / VAL / TEST
# ============================================================

print("\nCreating final splits...")


for split, split_pairs in split_data.items():

    image_dest = DATASET / "images" / split
    label_dest = DATASET / "labels" / split

    image_dest.mkdir(
        parents=True,
        exist_ok=True
    )

    label_dest.mkdir(
        parents=True,
        exist_ok=True
    )

    print(
        f"\nMoving {len(split_pairs)} pairs "
        f"to {split}..."
    )

    for item in split_pairs:

        image = item["image"]
        label = item["label"]

        temp_image = TEMP_IMAGES / image.name
        temp_label = TEMP_LABELS / label.name

        final_image = image_dest / image.name
        final_label = label_dest / label.name

        shutil.move(
            str(temp_image),
            str(final_image)
        )

        shutil.move(
            str(temp_label),
            str(final_label)
        )


# ============================================================
# REMOVE TEMPORARY DIRECTORY
# ============================================================

if TEMP.exists():

    shutil.rmtree(TEMP)


# ============================================================
# FINAL VERIFICATION
# ============================================================

print("\n")
print("=" * 60)
print("FINAL VERIFICATION")
print("=" * 60)


final_counts = {}


for split in SPLITS:

    image_dir = DATASET / "images" / split
    label_dir = DATASET / "labels" / split

    image_count = sum(
        1
        for file in image_dir.iterdir()
        if file.is_file()
        and file.suffix.lower() in IMAGE_EXTENSIONS
    )

    label_count = sum(
        1
        for file in label_dir.iterdir()
        if file.is_file()
        and file.suffix.lower() == ".txt"
    )

    final_counts[split] = (
        image_count,
        label_count
    )

    print(
        f"{split.upper():5} -> "
        f"Images: {image_count:4} | "
        f"Labels: {label_count:4}"
    )

    if image_count != label_count:

        raise RuntimeError(
            f"Mismatch detected in {split}: "
            f"{image_count} images but "
            f"{label_count} labels."
        )


# ============================================================
# TOTAL VERIFICATION
# ============================================================

final_total_images = sum(
    value[0]
    for value in final_counts.values()
)

final_total_labels = sum(
    value[1]
    for value in final_counts.values()
)


print("\n" + "-" * 60)

print(
    f"Total Images : {final_total_images}"
)

print(
    f"Total Labels : {final_total_labels}"
)


if final_total_images != total:
    raise RuntimeError(
        "FINAL IMAGE COUNT DOES NOT MATCH ORIGINAL COUNT!"
    )


if final_total_labels != total:
    raise RuntimeError(
        "FINAL LABEL COUNT DOES NOT MATCH ORIGINAL COUNT!"
    )


# ============================================================
# SUCCESS
# ============================================================

print("\n" + "=" * 60)
print("DATASET REDISTRIBUTION COMPLETED SUCCESSFULLY")
print("=" * 60)

print("\nFinal structure:")

print(
    "Dataset2_4classes/"
)

print(
    "├── images/"
)

print(
    f"│   ├── train/  ({final_counts['train'][0]} images)"
)

print(
    f"│   ├── val/    ({final_counts['val'][0]} images)"
)

print(
    f"│   └── test/   ({final_counts['test'][0]} images)"
)

print(
    "│"
)

print(
    "└── labels/"
)

print(
    f"    ├── train/  ({final_counts['train'][1]} labels)"
)

print(
    f"    ├── val/    ({final_counts['val'][1]} labels)"
)

print(
    f"    └── test/   ({final_counts['test'][1]} labels)"
)

print("\nRandom seed:", RANDOM_SEED)

print("\nNo duplicate dataset copy was created.")

print("Image-label pairs were kept together.")

print("\nDONE!")