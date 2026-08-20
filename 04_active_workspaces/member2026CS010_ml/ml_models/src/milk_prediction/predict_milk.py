import pandas as pd
import joblib
import os

print("🚀 Loading milk model...")

# -------------------------------------------------
# Paths
# -------------------------------------------------

SRC_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

PROJECT_DIR = os.path.abspath(
    os.path.join(SRC_DIR, "..")
)

model_path = os.path.join(
    SRC_DIR,
    "models",
    "milk_xgb_model.pkl"
)

data_path = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "milk",
    "milk_clean.csv"
)

output_path = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "milk",
    "milk_predictions.csv"
)

print("📂 Model path:", model_path)
print("📂 Model exists:", os.path.exists(model_path))

# -------------------------------------------------
# Load model
# -------------------------------------------------

model = joblib.load(model_path)

print("✅ Model loaded")

# -------------------------------------------------
# Load cleaned data
# -------------------------------------------------

print("📂 Data path:", data_path)
print("📂 Data exists:", os.path.exists(data_path))

if not os.path.exists(data_path):
    raise FileNotFoundError(
        f"❌ Dataset not found: {data_path}"
    )

df = pd.read_csv(
    data_path,
    low_memory=False
)

print("📊 Data shape:", df.shape)

# -------------------------------------------------
# Remove target
# -------------------------------------------------

target_column = "milkyield_summed"

X = df.drop(
    columns=[target_column],
    errors="ignore"
)

# Keep numeric columns
X = X.select_dtypes(
    include=["number", "bool"]
)

# -------------------------------------------------
# Match training features
# -------------------------------------------------

if hasattr(model, "feature_names_in_"):

    X = X.reindex(
        columns=model.feature_names_in_,
        fill_value=0
    )

print("📊 Input shape:", X.shape)

# -------------------------------------------------
# Predict
# -------------------------------------------------

print("🔮 Predicting milk production...")

predictions = model.predict(X)

print("✅ Prediction done")

print("🎯 First 10 predictions:")

print(predictions[:10])

# -------------------------------------------------
# Save predictions
# -------------------------------------------------

output = pd.DataFrame({
    "predicted_milk_yield": predictions
})

output.to_csv(
    output_path,
    index=False
)

print("💾 Predictions saved:")
print(output_path)