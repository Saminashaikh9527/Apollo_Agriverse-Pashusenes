import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split

print("🚀 Loading cleaned egg data...")

SRC_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

PROJECT_DIR = os.path.abspath(
    os.path.join(SRC_DIR, "..")
)

data_path = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "egg",
    "egg_clean.csv"
)

output_dir = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "egg"
)

df = pd.read_csv(
    data_path,
    low_memory=False
)

print("Dataset shape:", df.shape)

target_column = "Production"

X = df.drop(
    columns=[target_column]
)

y = df[target_column]

print("Features:", X.shape)
print("Target:", y.shape)

# 70% Train / 30% Temporary
X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42,
    stratify=y
)

# 15% Validation / 15% Test
X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42,
    stratify=y_temp
)

print("Train:", X_train.shape)
print("Validation:", X_val.shape)
print("Test:", X_test.shape)

# Create folder
os.makedirs(
    output_dir,
    exist_ok=True
)

# Save
joblib.dump(
    X_train,
    os.path.join(output_dir, "X_train.pkl")
)

joblib.dump(
    X_val,
    os.path.join(output_dir, "X_val.pkl")
)

joblib.dump(
    X_test,
    os.path.join(output_dir, "X_test.pkl")
)

joblib.dump(
    y_train,
    os.path.join(output_dir, "y_train.pkl")
)

joblib.dump(
    y_val,
    os.path.join(output_dir, "y_val.pkl")
)

joblib.dump(
    y_test,
    os.path.join(output_dir, "y_test.pkl")
)

print("✅ 70/15/15 egg split saved")