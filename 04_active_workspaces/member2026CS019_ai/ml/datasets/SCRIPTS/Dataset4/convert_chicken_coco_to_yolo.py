import json
from pathlib import Path

src = Path(r".\RAW\Detection\Dataset4_Chicken\extracted\dataset\train")
out = Path(r".\RAW\Detection\Dataset4_Chicken\yolo\train")

images_out = out / "images"
labels_out = out / "labels"

images_out.mkdir(parents=True, exist_ok=True)
labels_out.mkdir(parents=True, exist_ok=True)

with open(src / "_annotations.coco.json", "r", encoding="utf-8") as f:
    coco = json.load(f)

images = {img["id"]: img for img in coco["images"]}

annotations_by_image = {}

for ann in coco["annotations"]:
    annotations_by_image.setdefault(ann["image_id"], []).append(ann)

converted = 0

for image_id, image in images.items():
    file_name = image["file_name"]
    width = image["width"]
    height = image["height"]

    source_image = src / file_name
    target_image = images_out / file_name

    if source_image.exists():
        target_image.write_bytes(source_image.read_bytes())

    label_file = labels_out / (Path(file_name).stem + ".txt")

    lines = []

    for ann in annotations_by_image.get(image_id, []):

        if ann["category_id"] != 1:
            continue

        x, y, w, h = ann["bbox"]

        x_center = (x + w / 2) / width
        y_center = (y + h / 2) / height

        norm_w = w / width
        norm_h = h / height

        lines.append(
            f"0 {x_center:.6f} {y_center:.6f} {norm_w:.6f} {norm_h:.6f}"
        )

    label_file.write_text(
        "\n".join(lines),
        encoding="utf-8"
    )

    converted += 1

print(f"Images converted: {converted}")
print(f"Images copied to: {images_out}")
print(f"Labels created: {labels_out}")
print("YOLO class: 0 = Chicken")