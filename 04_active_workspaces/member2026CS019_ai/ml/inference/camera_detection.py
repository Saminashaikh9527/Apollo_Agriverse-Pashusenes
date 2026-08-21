
import cv2
from pathlib import Path
from ultralytics import YOLO
from collections import Counter
import time


# ============================================================
# Apollo Agriverse Pashusense
# YOLO Diagnostic Camera Detection
#
# Shows:
#   - Class name
#   - Actual YOLO confidence
#   - Tracking ID
#   - Per-class count
#   - Total detections
#   - FPS
#
# Keyboard:
#   Q = Quit
# ============================================================


# ------------------------------------------------------------
# 1. MODEL PATH
# ------------------------------------------------------------

MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "yolo"
    / "combined_livestock"
    / "best.pt"
)


# ------------------------------------------------------------
# 2. LOAD MODEL
# ------------------------------------------------------------

print("=" * 60)
print("Apollo Agriverse Pashusense")
print("YOLO Diagnostic Camera Detection")
print("=" * 60)

print("\nLoading YOLO model...")

model = YOLO(str(MODEL_PATH))

print("YOLO model loaded successfully!")
print("Model:", MODEL_PATH)
print("Classes:", model.names)


# ------------------------------------------------------------
# 3. OPEN CAMERA
# ------------------------------------------------------------

print("\nOpening camera...")

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("ERROR: Camera could not be opened.")
    raise SystemExit

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

print("Camera started.")
print("Press Q to stop.")
print()


# ------------------------------------------------------------
# 4. DETECTION SETTINGS
# ------------------------------------------------------------

# Minimum confidence required for a detection.
# 0.50 = 50%
#
# This removes many weak detections such as:
# 20%, 25%, 30%, 35%, etc.

DETECTION_THRESHOLD = 0.75

# Higher image size can help detect smaller animals.
IMAGE_SIZE = 960

# IoU used by YOLO NMS.
IOU_THRESHOLD = 0.45


# ------------------------------------------------------------
# 5. FPS VARIABLES
# ------------------------------------------------------------

previous_time = time.time()
fps = 0.0


# ------------------------------------------------------------
# 6. CAMERA LOOP
# ------------------------------------------------------------

while True:

    ret, frame = cap.read()

    if not ret:
        print("ERROR: Could not read camera frame.")
        break


    # --------------------------------------------------------
    # YOLO TRACKING
    # --------------------------------------------------------

    results = model.track(
        source=frame,
        conf=DETECTION_THRESHOLD,
        iou=IOU_THRESHOLD,
        imgsz=IMAGE_SIZE,
        persist=True,
        tracker="bytetrack.yaml",
        verbose=False
    )

    result = results[0]


    # --------------------------------------------------------
    # COPY FRAME
    # --------------------------------------------------------

    display_frame = frame.copy()


    # --------------------------------------------------------
    # DETECTION DATA
    # --------------------------------------------------------

    detection_counts = Counter()
    detection_number = 0


    if result.boxes is not None and len(result.boxes) > 0:

        boxes = result.boxes

        class_ids = boxes.cls.cpu().numpy().astype(int)
        confidences = boxes.conf.cpu().numpy()
        coordinates = boxes.xyxy.cpu().numpy()


        # Tracking IDs
        if boxes.id is not None:
            tracking_ids = boxes.id.cpu().numpy().astype(int)
        else:
            tracking_ids = [None] * len(class_ids)


        # ----------------------------------------------------
        # PROCESS EVERY DETECTION
        # ----------------------------------------------------

        for class_id, confidence, bbox, track_id in zip(
            class_ids,
            confidences,
            coordinates,
            tracking_ids
        ):

            detection_number += 1


            # ------------------------------------------------
            # CLASS NAME
            # ------------------------------------------------

            class_name = model.names.get(
                int(class_id),
                f"Class_{class_id}"
            )


            # ------------------------------------------------
            # COUNT
            # ------------------------------------------------

            detection_counts[class_name] += 1


            # ------------------------------------------------
            # BOUNDING BOX
            # ------------------------------------------------

            x1, y1, x2, y2 = map(int, bbox)


            # ------------------------------------------------
            # CONFIDENCE
            # ------------------------------------------------

            confidence_percent = confidence * 100


            # ------------------------------------------------
            # LABEL
            # ------------------------------------------------

            if track_id is not None:

                label = (
                    f"{class_name} "
                    f"{confidence_percent:.1f}% "
                    f"ID:{track_id}"
                )

            else:

                label = (
                    f"{class_name} "
                    f"{confidence_percent:.1f}%"
                )


            # ------------------------------------------------
            # DRAW BOUNDING BOX
            # ------------------------------------------------

            cv2.rectangle(
                display_frame,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )


            # ------------------------------------------------
            # LABEL BACKGROUND
            # ------------------------------------------------

            (text_width, text_height), baseline = cv2.getTextSize(
                label,
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                2
            )

            label_y = max(
                y1,
                text_height + baseline + 5
            )

            cv2.rectangle(
                display_frame,
                (
                    x1,
                    label_y - text_height - baseline - 5
                ),
                (
                    x1 + text_width + 5,
                    label_y
                ),
                (0, 0, 0),
                -1
            )


            # ------------------------------------------------
            # DRAW LABEL
            # ------------------------------------------------

            cv2.putText(
                display_frame,
                label,
                (x1 + 2, label_y - 4),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (0, 255, 255),
                2
            )


            # ------------------------------------------------
            # PRINT DETECTION
            # ------------------------------------------------

            print(
                f"Detection {detection_number}: "
                f"{class_name} | "
                f"Confidence={confidence_percent:.1f}% | "
                f"ID={track_id} | "
                f"BBox=({x1},{y1},{x2},{y2})"
            )


    # --------------------------------------------------------
    # TOTAL COUNT
    # --------------------------------------------------------

    total_detections = sum(detection_counts.values())


    # --------------------------------------------------------
    # FPS
    # --------------------------------------------------------

    current_time = time.time()
    elapsed = current_time - previous_time

    if elapsed > 0:
        fps = 1.0 / elapsed

    previous_time = current_time


    # --------------------------------------------------------
    # INFORMATION PANEL
    # --------------------------------------------------------

    panel_height = 205

    overlay = display_frame.copy()

    cv2.rectangle(
        overlay,
        (0, 0),
        (330, panel_height),
        (0, 0, 0),
        -1
    )

    display_frame = cv2.addWeighted(
        overlay,
        0.65,
        display_frame,
        0.35,
        0
    )


    # --------------------------------------------------------
    # PROJECT NAME
    # --------------------------------------------------------

    cv2.putText(
        display_frame,
        "Apollo Agriverse Pashusense",
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.60,
        (0, 255, 0),
        2
    )


    # --------------------------------------------------------
    # THRESHOLD
    # --------------------------------------------------------

    cv2.putText(
        display_frame,
        f"Threshold: {DETECTION_THRESHOLD:.2f}",
        (10, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.50,
        (255, 255, 255),
        1
    )


    # --------------------------------------------------------
    # FPS
    # --------------------------------------------------------

    cv2.putText(
        display_frame,
        f"FPS: {fps:.1f}",
        (175, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.50,
        (255, 255, 255),
        1
    )


    # --------------------------------------------------------
    # COUNTS
    # --------------------------------------------------------

    y = 78

    for animal in [
        "Cow",
        "Goat",
        "Sheep",
        "Buffalo",
        "Chicken"
    ]:

        count = detection_counts.get(animal, 0)

        cv2.putText(
            display_frame,
            f"{animal}: {count}",
            (10, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.50,
            (255, 255, 255),
            1
        )

        y += 23


    # --------------------------------------------------------
    # TOTAL
    # --------------------------------------------------------

    cv2.putText(
        display_frame,
        f"Total detections: {total_detections}",
        (10, y + 3),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.55,
        (0, 255, 255),
        2
    )


    # --------------------------------------------------------
    # DISPLAY WINDOW
    # --------------------------------------------------------

    cv2.imshow(
        "Apollo Agriverse Pashusense - YOLO Diagnostic",
        display_frame
    )


    # --------------------------------------------------------
    # KEYBOARD
    # --------------------------------------------------------

    key = cv2.waitKey(1) & 0xFF

    if key == ord("q"):
        break


# ------------------------------------------------------------
# 7. CLEANUP
# ------------------------------------------------------------

cap.release()
cv2.destroyAllWindows()

print()
print("=" * 60)
print("Camera stopped.")
print("=" * 60)

