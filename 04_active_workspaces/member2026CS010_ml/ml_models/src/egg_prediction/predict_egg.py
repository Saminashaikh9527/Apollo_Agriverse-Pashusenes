import pandas as pd
import joblib
import os

print(" Loading egg model...")

SRC_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

PROJECT_DIR = os.path.abspath(
    os.path.join(SRC_DIR, "..")
)

model_path = os.path.join(
    SRC_DIR,
    "models",
    "egg_xgb_model.pkl"
)

mapping_path = os.path.join(
    SRC_DIR,
    "models",
    "egg_class_mapping.pkl"
)

data_path = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "egg",
    "egg_clean.csv"
)

output_path = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "egg",
    "egg_predictions.csv"
)

print(" Model path:", model_path)
print(" Model exists:", os.path.exists(model_path))

if not os.path.exists(model_path):
    raise FileNotFoundError(
        f" Model not found: {model_path}"
    )

model = joblib.load(
    model_path
)

class_to_number = joblib.load(
    mapping_path
)

# Reverse mapping
number_to_class = {
    value: key
    for key, value in class_to_number.items()
}

print("Model loaded")

# Load data
print(" Data path:", data_path)
print(" Data exists:", os.path.exists(data_path))

if not os.path.exists(data_path):
    raise FileNotFoundError(
        f" Dataset not found: {data_path}"
    )

df = pd.read_csv(
    data_path,
    low_memory=False
)

print(" Data shape:", df.shape)

# Remove target
X = df.drop(
    columns=["Production"],
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

print(" Input shape:", X.shape)

print(" Predicting egg production...")

predictions_encoded = model.predict(
    X
)

# Convert back to original labels
predictions = [
    number_to_class[int(pred)]
    for pred in predictions_encoded
]

print(" Prediction done")

print(" First 10 predictions:")
print(predictions[:10])

# Save
output = pd.DataFrame({
    "predicted_production": predictions
})

output.to_csv(
    output_path,
    index=False
)

print("Predictions saved:")
print(output_path)