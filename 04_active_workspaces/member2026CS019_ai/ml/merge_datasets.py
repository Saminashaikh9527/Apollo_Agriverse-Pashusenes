
import os
import shutil

BASE = r"G:\Intership\agrolens-plf\04_active_workspaces\member2026CS019_ai\ml\datasets"

OUTPUT = os.path.join(BASE, "livestock")

counter = 1

def copy_data(img_src, lbl_src, img_dst, lbl_dst):
    global counter

    if not os.path.exists(img_src):
        return

    for img in os.listdir(img_src):

        if not img.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        ext = os.path.splitext(img)[1]

        new_name = f"img_{counter:06d}"

        shutil.copy2(
            os.path.join(img_src, img),
            os.path.join(img_dst, new_name + ext)
        )

        label = os.path.splitext(img)[0] + ".txt"

        if os.path.exists(os.path.join(lbl_src, label)):
            shutil.copy2(
                os.path.join(lbl_src, label),
                os.path.join(lbl_dst, new_name + ".txt")
            )

        counter += 1


# Dataset1
copy_data(
    os.path.join(BASE, "Dataset1", "train", "images"),
    os.path.join(BASE, "Dataset1", "train", "labels"),
    os.path.join(OUTPUT, "images", "train"),
    os.path.join(OUTPUT, "labels", "train")
)

# Dataset2
copy_data(
    os.path.join(BASE, "Dataset2", "images"),
    os.path.join(BASE, "Dataset2", "labels"),
    os.path.join(OUTPUT, "images", "train"),
    os.path.join(OUTPUT, "labels", "train")
)

# Dataset3 Train
copy_data(
    os.path.join(BASE, "Dataset3", "train", "images"),
    os.path.join(BASE, "Dataset3", "train", "labels"),
    os.path.join(OUTPUT, "images", "train"),
    os.path.join(OUTPUT, "labels", "train")
)

# Dataset3 Validation
copy_data(
    os.path.join(BASE, "Dataset3", "valid", "images"),
    os.path.join(BASE, "Dataset3", "valid", "labels"),
    os.path.join(OUTPUT, "images", "val"),
    os.path.join(OUTPUT, "labels", "val")
)

print("Done!")
print("Total images copied:", counter - 1)