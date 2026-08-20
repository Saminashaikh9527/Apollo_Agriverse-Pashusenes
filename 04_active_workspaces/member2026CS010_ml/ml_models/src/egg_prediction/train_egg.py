import joblib
import os

from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report

print("🚀 Loading egg split data...")

SRC_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

PROJECT_DIR = os.path.abspath(
    os.path.join(SRC_DIR, "..")
)

data_dir = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "egg"
)

model_dir = os.path.join(
    SRC_DIR,
    "models"
)

# Load data
X_train = joblib.load(
    os.path.join(data_dir, "X_train.pkl")
)

X_val = joblib.load(
    os.path.join(data_dir, "X_val.pkl")
)

X_test = joblib.load(
    os.path.join(data_dir, "X_test.pkl")
)

y_train = joblib.load(
    os.path.join(data_dir, "y_train.pkl")
)

y_val = joblib.load(
    os.path.join(data_dir, "y_val.pkl")
)

y_test = joblib.load(
    os.path.join(data_dir, "y_test.pkl")
)

print("Train shape:", X_train.shape)
print("Validation shape:", X_val.shape)
print("Test shape:", X_test.shape)

print("⚙️ Training XGBoost...")

# Convert labels to numbers
classes = sorted(
    y_train.unique()
)

class_to_number = {
    cls: i
    for i, cls in enumerate(classes)
}

y_train_encoded = y_train.map(
    class_to_number
)

y_val_encoded = y_val.map(
    class_to_number
)

y_test_encoded = y_test.map(
    class_to_number
)

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.05,
    random_state=42,
    n_jobs=-1,
    objective="multi:softprob",
    num_class=len(classes),
    eval_metric="mlogloss"
)

model.fit(
    X_train,
    y_train_encoded,
    eval_set=[
        (X_val, y_val_encoded)
    ],
    verbose=False
)

print("✅ Training done")

# Test prediction
y_pred = model.predict(
    X_test
)

accuracy = accuracy_score(
    y_test_encoded,
    y_pred
)

print("📊 Test Accuracy:", accuracy)

print("📋 Classification Report:")

print(
    classification_report(
        y_test_encoded,
        y_pred
    )
)

# Save model
os.makedirs(
    model_dir,
    exist_ok=True
)

model_path = os.path.join(
    model_dir,
    "egg_xgb_model.pkl"
)

mapping_path = os.path.join(
    model_dir,
    "egg_class_mapping.pkl"
)

joblib.dump(
    model,
    model_path
)

joblib.dump(
    class_to_number,
    mapping_path
)

print("💾 Model saved:")
print(model_path)

print("💾 Class mapping saved:")
print(mapping_path)