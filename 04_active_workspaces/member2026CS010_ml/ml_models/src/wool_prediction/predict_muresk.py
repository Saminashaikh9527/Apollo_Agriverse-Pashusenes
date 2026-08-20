import pandas as pd
import joblib
import os

print("🚀 Loading Muresk model...")

# =====================================================
# MODEL PATH
# =====================================================

model_path = "models/muresk_model.pkl"

print("📂 Model exists:", os.path.exists(model_path))

model = joblib.load(model_path)

print("✅ Model loaded")

# =====================================================
# DATA PATH
# =====================================================

data_path = "../datasets/processed/muresk/muresk_clean.csv"

print("📂 Data exists:", os.path.exists(data_path))

df = pd.read_csv(data_path)

print("📊 Data shape:", df.shape)

# =====================================================
# REMOVE TARGET
# =====================================================

target = "steps"

X = df.drop(
    columns=[target],
    errors="ignore"
)

# Keep numeric columns
X = X.select_dtypes(
    include=["number"]
)

print("📊 Input shape:", X.shape)

# =====================================================
# PREDICTION
# =====================================================

print("🔮 Predicting...")

predictions = model.predict(X)

print("✅ Prediction completed!")

print("\n🎯 First 10 predictions:")
print(predictions[:10])

# =====================================================
# SAVE PREDICTIONS
# =====================================================

output_path = "../datasets/processed/muresk/muresk_predictions.csv"

output = pd.DataFrame({
    "prediction": predictions
})

output.to_csv(
    output_path,
    index=False
)

print("\n💾 Predictions saved!")
print("📁", output_path)