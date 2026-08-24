from pathlib import Path
import shutil
import random

dataset = Path("Dataset1_Cattle")

train_images = dataset / "images" / "train"
train_labels = dataset / "labels" / "train"

val_images = dataset / "images" / "val"
val_labels = dataset / "labels" / "val"

val_images.mkdir(parents=True, exist_ok=True)
val_labels.mkdir(parents=True, exist_ok=True)

images = [
    x for x in train_images.iterdir()
    if x.is_file() and x.suffix.lower() in
    [".jpg", ".jpeg", ".png", ".bmp", ".webp"]
]

random.seed(42)
random.shuffle(images)

# 20% validation
val_count = int(len(images) * 0.20)

val_files = images[:val_count]

for image in val_files:
    label = train_labels / f"{image.stem}.txt"

    if not label.exists():
        print("Skipping - label missing:", image.name)
        continue

    shutil.move(str(image), str(val_images / image.name))
    shutil.move(str(label), str(val_labels / label.name))

print("Validation split complete!")
print("Validation images:", len(list(val_images.iterdir())))
print("Remaining train images:", len(list(train_images.iterdir())))