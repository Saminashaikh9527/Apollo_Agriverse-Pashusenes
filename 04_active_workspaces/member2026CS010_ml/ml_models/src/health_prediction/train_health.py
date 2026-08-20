import joblib
import os

from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report

print("🚀 Loading split data...")

base_path = "../datasets/processed/health"

X_train = joblib.load(f"{base_path}/X_train.pkl")
X_val = joblib.load(f"{base_path}/X_val.pkl")
X_test = joblib.load(f"{base_path}/X_test.pkl")

y_train = joblib.load(f"{base_path}/y_train.pkl")
y_val = joblib.load(f"{base_path}/y_val.pkl")
y_test = joblib.load(f"{base_path}/y_test.pkl")

print("Train shape:", X_train.shape)
print("Validation shape:", X_val.shape)
print("Test shape:", X_test.shape)

print("⚙️ Training XGBoost Classifier...")

# Convert target labels to numbers
classes = sorted(y_train.unique())

class_to_number = {
    cls: i for i, cls in enumerate(classes)
}

y_train_encoded = y_train.map(class_to_number)
y_val_encoded = y_val.map(class_to_number)
y_test_encoded = y_test.map(class_to_number)

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
y_pred = model.predict(X_test)

accuracy = accuracy_score(
    y_test_encoded,
    y_pred
)

print("📊 Test Accuracy:", accuracy)

print("\n📋 Classification Report:")
print(
    classification_report(
        y_test_encoded,
        y_pred
    )
)

# Save model
model_path = "models/health_xgb_model.pkl"

os.makedirs(
    "models",
    exist_ok=True
)

joblib.dump(
    model,
    model_path
)

# Save class mapping
mapping_path = "models/health_class_mapping.pkl"

joblib.dump(
    class_to_number,
    mapping_path
)

print("💾 Model saved:")
print(os.path.abspath(model_path))

print("💾 Class mapping saved:")
print(os.path.abspath(mapping_path))