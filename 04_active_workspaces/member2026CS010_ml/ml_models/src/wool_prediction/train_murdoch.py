import joblib
import os

from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report

print("🚀 Loading split data...")

# =========================
# LOAD TRAIN DATA
# =========================

X_train = joblib.load(
    "../datasets/processed/murdoch/X_train.pkl"
)

y_train = joblib.load(
    "../datasets/processed/murdoch/y_train.pkl"
)

# =========================
# LOAD VALIDATION DATA
# =========================

X_val = joblib.load(
    "../datasets/processed/murdoch/X_val.pkl"
)

y_val = joblib.load(
    "../datasets/processed/murdoch/y_val.pkl"
)

# =========================
# LOAD TEST DATA
# =========================

X_test = joblib.load(
    "../datasets/processed/murdoch/X_test.pkl"
)

y_test = joblib.load(
    "../datasets/processed/murdoch/y_test.pkl"
)

print("Train shape:", X_train.shape)
print("Validation shape:", X_val.shape)
print("Test shape:", X_test.shape)

# =========================
# XGBOOST MODEL
# =========================

print("\n⚙️ Training XGBoost model...")

model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    n_jobs=-1,
    eval_metric="logloss"
)

model.fit(
    X_train,
    y_train
)

print("✅ Training done")

# =========================
# VALIDATION
# =========================

print("\n🔍 Validation prediction...")

y_val_pred = model.predict(X_val)

val_acc = accuracy_score(
    y_val,
    y_val_pred
)

print("📊 Validation Accuracy:", val_acc)

# =========================
# FINAL TEST
# =========================

print("\n🔍 Test prediction...")

y_test_pred = model.predict(X_test)

test_acc = accuracy_score(
    y_test,
    y_test_pred
)

print("✅ Test Accuracy:", test_acc)

print("\n📊 Test Classification Report:")
print(
    classification_report(
        y_test,
        y_test_pred
    )
)

# =========================
# SAVE MODEL
# =========================

os.makedirs("models", exist_ok=True)

model_path = "models/murdoch_xgb_model.pkl"

joblib.dump(
    model,
    model_path
)

print("\n💾 Model saved successfully!")
print("📂 Location:", model_path)