import pandas as pd
import joblib
import os

print("🚀 Loading model...")

model_path = "models/feed_xgb_model.pkl"

print("📂 Model exists:", os.path.exists(model_path))

model = joblib.load(model_path)

print("✅ Model loaded")

# Load cleaned data
data_path = "../datasets/processed/feed/feed_clean.csv"

print("📂 Data exists:", os.path.exists(data_path))

df = pd.read_csv(
    data_path,
    low_memory=False
)

print("📊 Data shape:", df.shape)

# Remove target
X = df.drop(
    columns=["cost_per_kg_inr"],
    errors="ignore"
)

# Numeric columns only
X = X.select_dtypes(
    include=["number"]
)

# Match training features
if hasattr(model, "feature_names_in_"):

    X = X.reindex(
        columns=model.feature_names_in_,
        fill_value=0
    )

print("📊 Input shape:", X.shape)

print("🔮 Predicting...")

predictions = model.predict(X)

print("✅ Prediction done")

print("🎯 First 10 predictions:")
print(predictions[:10])

# Save predictions
output_path = (
    "../datasets/processed/feed/"
    "feed_predictions.csv"
)

output = pd.DataFrame({
    "prediction": predictions
})

output.to_csv(
    output_path,
    index=False
)

print("💾 Predictions saved:")
print(os.path.abspath(output_path))