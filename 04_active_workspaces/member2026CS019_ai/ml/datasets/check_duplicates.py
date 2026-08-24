from pathlib import Path
from PIL import Image
import hashlib

# All datasets to check
DATASETS = [
    Path("Dataset1/Dataset1_Cattle"),
    Path("Dataset2_4classes"),
    Path("Dataset3/Dataset3_4classes")
]

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".bmp", ".webp"
}


def file_hash(path):
    """Create SHA256 hash of the image file."""
    sha = hashlib.sha256()

    with open(path, "rb") as f:
        while True:
            chunk = f.read(1024 * 1024)

            if not chunk:
                break

            sha.update(chunk)

    return sha.hexdigest()


hashes = {}
total_images = 0

print("===================================")
print("DUPLICATE IMAGE CHECK")
print("===================================")
print()

for dataset in DATASETS:

    if not dataset.exists():
        print("Dataset not found:", dataset)
        continue

    print("Checking:", dataset)

    for image in dataset.rglob("*"):

        if not image.is_file():
            continue

        if image.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        total_images += 1

        try:
            # Verify image can actually be opened
            with Image.open(image) as img:
                img.verify()

            h = file_hash(image)

            if h in hashes:
                hashes[h].append(str(image))
            else:
                hashes[h] = [str(image)]

        except Exception as e:
            print("ERROR:", image)
            print(e)

print()
print("===================================")
print("RESULT")
print("===================================")

duplicate_groups = [
    paths for paths in hashes.values()
    if len(paths) > 1
]

duplicate_images = sum(
    len(paths) - 1
    for paths in duplicate_groups
)

print("Total images checked :", total_images)
print("Unique images        :", len(hashes))
print("Duplicate groups     :", len(duplicate_groups))
print("Duplicate copies     :", duplicate_images)

print()

if duplicate_groups:

    print("DUPLICATES FOUND")
    print("================")

    for i, group in enumerate(duplicate_groups, 1):

        print()
        print(f"Duplicate Group {i}:")

        for path in group:
            print("  ", path)

else:

    print("NO EXACT DUPLICATES FOUND.")

print()
print("Check complete.")