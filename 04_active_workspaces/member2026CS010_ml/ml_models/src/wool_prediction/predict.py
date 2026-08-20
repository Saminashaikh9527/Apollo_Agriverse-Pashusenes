import pandas as pd
import joblib
import os

print("🚀 Loading XGBoost model...")

# Model
model_path = "models/wool_model.pkl"

print("📂 Model exists:", os.path.exists(model_path))

model = joblib.load(model_path)

print("✅ Model loaded")

# Test data — already split
test_path = "../datasets/processed/katanning/X_test.pkl"

print("📂 Test data exists:", os.path.exists(test_path))

X_test = pd.read_pickle(test_path)

print("📊 Test shape:", X_test.shape)

# Make sure only numeric columns are used
X_test = X_test.select_dtypes(include=["number"])

print("📊 Input shape:", X_test.shape)

# Prediction
print("🔮 Predicting...")

predictions = model.predict(X_test)

print("✅ Prediction done")

print("🎯 First 10 predictions:")
print(predictions[:10])

# Save predictions
output_path = "../datasets/processed/katanning/katanning_predictions.csv"

output = pd.DataFrame({
    "prediction": predictions
})

output.to_csv(output_path, index=False)

print("💾 Predictions saved at:")
print(output_path)