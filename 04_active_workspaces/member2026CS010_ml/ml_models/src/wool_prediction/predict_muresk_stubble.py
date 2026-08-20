import pandas as pd
import joblib

print("🚀 Loading model...")

model = joblib.load(
    "models/muresk_stubble_xgb_model.pkl"
)

print("✅ Model loaded")

# Load cleaned data
df = pd.read_csv(
    "../datasets/processed/muresk/muresk_stubble_clean.csv"
)

print("📊 Data shape:", df.shape)

# Remove target
X = df.drop(
    columns=["steps"],
    errors="ignore"
)

# Numeric only
X = X.select_dtypes(
    include=["number"]
)

print("📊 Input shape:", X.shape)

print("🔮 Predicting...")

predictions = model.predict(X)

print("✅ Prediction done")

print("🎯 First 10 predictions:")
print(predictions[:10])

# Save predictions
output = pd.DataFrame({
    "prediction": predictions
})

output.to_csv(
    "../datasets/processed/muresk/muresk_stubble_predictions.csv",
    index=False
)

print("💾 Predictions saved")