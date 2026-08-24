from pathlib import Path
import random
from PIL import Image, ImageDraw, ImageFont

# ============================================================
# SETTINGS
# ============================================================

DATASET = Path("Dataset2_4classes")

SPLIT = "train"

OUTPUT = DATASET / "visual_check"

NUM_IMAGES = 20

RANDOM_SEED = 42

CLASS_NAMES = {
    0: "Cattle",
    1: "Goat",
    2: "Sheep",
    3: "Buffalo"
}

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp"
}


# ============================================================
# PATHS
# ============================================================

IMAGE_DIR = DATASET / "images" / SPLIT
LABEL_DIR = DATASET / "labels" / SPLIT

OUTPUT.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# GET IMAGES
# ============================================================

images = [
    img
    for img in IMAGE_DIR.iterdir()
    if img.is_file()
    and img.suffix.lower() in IMAGE_EXTENSIONS
]


print(f"Total {SPLIT} images: {len(images)}")


# ============================================================
# RANDOM SELECTION
# ============================================================

random.seed(RANDOM_SEED)

selected_images = random.sample(
    images,
    min(NUM_IMAGES, len(images))
)


print(
    f"Selected {len(selected_images)} images "
    f"for visual verification."
)


# ============================================================
# PROCESS IMAGES
# ============================================================

for index, image_path in enumerate(
    selected_images,
    start=1
):

    label_path = LABEL_DIR / (
        image_path.stem + ".txt"
    )

    if not label_path.exists():

        print(
            f"WARNING: Label missing: "
            f"{image_path.name}"
        )

        continue


    # --------------------------------------------------------
    # Open image
    # --------------------------------------------------------

    image = Image.open(image_path).convert("RGB")

    draw = ImageDraw.Draw(image)

    width, height = image.size


    # --------------------------------------------------------
    # Read YOLO labels
    # --------------------------------------------------------

    with open(
        label_path,
        "r",
        encoding="utf-8"
    ) as file:

        lines = file.readlines()


    # --------------------------------------------------------
    # Draw bounding boxes
    # --------------------------------------------------------

    for line in lines:

        values = line.strip().split()

        if len(values) != 5:
            continue

        class_id = int(values[0])

        x_center = float(values[1])

        y_center = float(values[2])

        box_width = float(values[3])

        box_height = float(values[4])


        # YOLO normalized coordinates
        x_center *= width
        y_center *= height

        box_width *= width
        box_height *= height


        # Convert to corners
        x1 = int(
            x_center - box_width / 2
        )

        y1 = int(
            y_center - box_height / 2
        )

        x2 = int(
            x_center + box_width / 2
        )

        y2 = int(
            y_center + box_height / 2
        )


        # Class name
        class_name = CLASS_NAMES.get(
            class_id,
            f"Unknown_{class_id}"
        )


        # Draw box
        draw.rectangle(
            [x1, y1, x2, y2],
            outline="red",
            width=3
        )


        # Draw label
        text = (
            f"{class_id}: {class_name}"
        )

        draw.rectangle(
            [
                x1,
                max(0, y1 - 20),
                x1 + len(text) * 8 + 10,
                y1
            ],
            fill="red"
        )

        draw.text(
            (x1 + 5, max(0, y1 - 18)),
            text,
            fill="white"
        )


    # --------------------------------------------------------
    # Save output
    # --------------------------------------------------------

    output_path = OUTPUT / (
        f"{index:02d}_{image_path.name}"
    )

    image.save(output_path)

    print(
        f"[{index:02d}/{len(selected_images)}] "
        f"{image_path.name}"
    )


# ============================================================
# COMPLETE
# ============================================================

print()
print("=" * 60)
print("VISUAL VERIFICATION COMPLETE")
print("=" * 60)

print()
print(
    f"Output folder:"
)

print(
    OUTPUT.resolve()
)

print()
print(
    "Open the visual_check folder and inspect "
    "the bounding boxes and class names."
)