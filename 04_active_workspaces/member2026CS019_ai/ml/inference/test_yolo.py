from pathlib import Path
import json
from yolo_inference import detect_animals


IMAGE_PATH = Path(
    r"G:\Intership\agrolens-plf\04_active_workspaces\member2026CS019_ai"
    r"\ml\datasets\CURATED\Detection\Combined_Livestock"
    r"\images\test\-OWS_mp4-105_jpg.rf.12f35a8f4cb7c44f77778c850c8ad960.jpg"
)


result = detect_animals(IMAGE_PATH)

print("\nYOLO DETECTION RESULT")
print("=====================")

print(json.dumps(result, indent=2))