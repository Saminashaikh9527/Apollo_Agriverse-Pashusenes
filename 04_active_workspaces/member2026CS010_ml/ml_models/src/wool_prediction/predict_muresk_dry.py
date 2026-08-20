import pandas as pd
import joblib
import os

print("🚀 Loading Muresk Dry model...")

model_path = "models/muresk_dry_model.pkl"

print("📂 Model exists:", os.path.exists(model_path))

model = joblib.load(model_path)

print("✅ Model loaded")

# Load cleaned data
data_path = "../datasets/processed/muresk/muresk_dry_clean.csv"

print("📂 Data exists:", os.path.exists(data_path))

df = pd.read_csv(data_path)

print("📊 Data shape:", df.shape)

# Remove target
target = "steps"

X = df.drop(
    columns=[target],
    errors="ignore"
)

# Numeric features
X = X.select_dtypes(
    include=["number"]
)

print("📊 Input shape:", X.shape)

# Prediction
print("🔮 Predicting...")

predictions = model.predict(X)

print("✅ Prediction completed")

print("\n🎯 First 10 predictions:")
print(predictions[:10])

# Save
output_path = "../datasets/processed/muresk/muresk_dry_predictions.csv"

output = pd.DataFrame({
    "prediction": predictions
})

output.to_csv(
    output_path,
    index=False
)

print("\n💾 Predictions saved:")
print(output_path)