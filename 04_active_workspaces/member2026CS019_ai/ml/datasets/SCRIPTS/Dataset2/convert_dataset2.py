from pathlib import Path
import shutil

SOURCE = Path("../Dataset2")
DEST = Path(".")

# Original class -> New class
CLASS_MAP = {
    2: 0,   # Cattle
    3: 1,   # Goat
    6: 2,   # Sheep
    10: 2,  # Sheep -> combine with class 6
    8: 3    # Buffalo
}

for split in ["train", "val", "test"]:

    source_images = SOURCE / "images" / split
    source_labels = SOURCE / "labels" / split

    dest_images = DEST / "images" / split
    dest_labels = DEST / "labels" / split

    if not source_images.exists():
        print(f"Skipping {split}: images folder not found")
        continue

    if not source_labels.exists():
        print(f"Skipping {split}: labels folder not found")
        continue

    copied = 0

    for label_file in source_labels.glob("*.txt"):

        lines = []

        with open(label_file, "r") as f:
            for line in f:
                parts = line.strip().split()

                if len(parts) != 5:
                    continue

                old_class = int(parts[0])

                # Keep only required animals
                if old_class not in CLASS_MAP:
                    continue

                new_class = CLASS_MAP[old_class]

                parts[0] = str(new_class)

                lines.append(" ".join(parts))

        # If image has no required animal, skip it
        if not lines:
            continue

        image_found = False

        for extension in [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]:
            image_file = source_images / (label_file.stem + extension)

            if image_file.exists():
                shutil.copy2(
                    image_file,
                    dest_images / image_file.name
                )
                image_found = True
                break

        if not image_found:
            print("Image not found:", label_file.name)
            continue

        # Save converted label
        new_label = dest_labels / label_file.name

        with open(new_label, "w") as f:
            f.write("\n".join(lines) + "\n")

        copied += 1

    print(f"{split}: copied {copied} images")


# Create data.yaml
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

with open("data.yaml", "w") as f:
    f.write(yaml_content)

print()
print("===================================")
print("Dataset2_4classes conversion DONE!")
print("===================================")
print()
print("Classes:")
print("0 = Cattle")
print("1 = Goat")
print("2 = Sheep")
print("3 = Buffalo")
print()
print("data.yaml created successfully.")