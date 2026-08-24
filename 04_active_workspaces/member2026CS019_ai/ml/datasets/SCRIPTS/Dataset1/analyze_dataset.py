
from pathlib import Path
from collections import Counter

# Change this path if your dataset folder has a different name
labels_path = Path("datasets/Dataset4/labels")

counter = Counter()

for txt in labels_path.rglob("*.txt"):
    with open(txt, "r") as f:
        for line in f:
            if line.strip():
                class_id = line.split()[0]
                counter[class_id] += 1

print("\nClasses found:\n")
for class_id, count in sorted(counter.items()):
    print(f"Class {class_id}: {count} objects")