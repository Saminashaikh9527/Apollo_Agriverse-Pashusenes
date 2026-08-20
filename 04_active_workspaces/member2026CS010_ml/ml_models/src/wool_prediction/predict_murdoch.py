import pandas as pd
import joblib
import os

print("🚀 Loading XGBoost model...")

# =========================
# MODEL
# =========================

model_path = "models/murdoch_xgb_model.pkl"

print("📂 Model exists:", os.path.exists(model_path))

if not os.path.exists(model_path):
    raise FileNotFoundError(
        f"❌ Model not found: {model_path}"
    )

model = joblib.load(model_path)

print("✅ XGBoost model loaded")

# =========================
# DATA
# =========================

data_path = "../datasets/processed/murdoch/murdoch_clean.csv"

print("📂 Data exists:", os.path.exists(data_path))

if not os.path.exists(data_path):
    raise FileNotFoundError(
        f"❌ Data not found: {data_path}"
    )

df = pd.read_csv(data_path)

print("📊 Data shape:", df.shape)

# =========================
# REMOVE TARGET
# =========================

# Training target = grazing
# Prediction वेळी target remove करायचा

X = df.drop(
    columns=["grazing"],
    errors="ignore"
)

# =========================
# NUMERIC FEATURES
# =========================

X = X.select_dtypes(
    include=["number"]
)

print("📊 Input shape:", X.shape)

# =========================
# PREDICTION
# =========================

print("🔮 Predicting...")

predictions = model.predict(X)

print("✅ Prediction done")

print("\n🎯 First 10 predictions:")
print(predictions[:10])

# =========================
# SAVE PREDICTIONS
# =========================

output_path = (
    "../datasets/processed/murdoch/"
    "murdoch_predictions.csv"
)

output = pd.DataFrame({
    "prediction": predictions
})

output.to_csv(
    output_path,
    index=False
)

print("\n💾 Predictions saved successfully!")
print("📂 Location:", output_path)