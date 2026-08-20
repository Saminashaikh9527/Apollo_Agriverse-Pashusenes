import pandas as pd
import joblib
import os

print("🚀 Loading model...")

model_path = "models/health_xgb_model.pkl"
mapping_path = "models/health_class_mapping.pkl"

print(" Model path:", os.path.abspath(model_path))
print(" Model exists:", os.path.exists(model_path))

if not os.path.exists(model_path):
    raise FileNotFoundError(
        f" Model not found: {os.path.abspath(model_path)}"
    )

model = joblib.load(model_path)
class_to_number = joblib.load(mapping_path)

# Reverse mapping
number_to_class = {
    value: key
    for key, value in class_to_number.items()
}

print(" Model loaded")

# Load cleaned dataset
data_path = "../datasets/processed/health/health_clean.csv"

print(" Data path:", os.path.abspath(data_path))
print(" Data exists:", os.path.exists(data_path))

df = pd.read_csv(
    data_path,
    low_memory=False
)

print("Data shape:", df.shape)

# Remove target
X = df.drop(
    columns=["Disease"],
    errors="ignore"
)

# Keep numeric features
X = X.select_dtypes(
    include=["number", "bool"]
)

# Match training features
if hasattr(model, "feature_names_in_"):
    X = X.reindex(
        columns=model.feature_names_in_,
        fill_value=0
    )

print("Input shape:", X.shape)

print(" Predicting...")

predictions_encoded = model.predict(X)

# Convert numbers back to Disease names
predictions = [
    number_to_class[int(pred)]
    for pred in predictions_encoded
]

print(" Prediction done")

print("🎯 First 10 predictions:")
print(predictions[:10])

# Save predictions
output_path = (
    "../datasets/processed/health/"
    "health_predictions.csv"
)

output = pd.DataFrame({
    "prediction": predictions
})

output.to_csv(
    output_path,
    index=False
)

print(" Predictions saved:")
print(os.path.abspath(output_path))