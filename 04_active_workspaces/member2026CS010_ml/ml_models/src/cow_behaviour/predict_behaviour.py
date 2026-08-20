import pandas as pd
import joblib
import os

print(" Loading model...")

# ============================================================
# MODEL
# ============================================================

model_path = "models/behaviour_xgb_model.pkl"


print(" Model path:", os.path.abspath(model_path))
print(" Model exists:", os.path.exists(model_path))

if not os.path.exists(model_path):
    raise FileNotFoundError(
        f" Model not found: {os.path.abspath(model_path)}"
    )

model = joblib.load(model_path)

print(" Model loaded")


# ============================================================
# LOAD CLEANED DATA
# ============================================================

data_path = "../datasets/processed/cow_behaviour/Behavior_clean.csv"

print(" Data path:", os.path.abspath(data_path))
print(" Data exists:", os.path.exists(data_path))

if not os.path.exists(data_path):
    raise FileNotFoundError(
        f" Dataset not found: {os.path.abspath(data_path)}"
    )

df = pd.read_csv(data_path, low_memory=False)

print(" Data shape:", df.shape)


# ============================================================
# REMOVE TARGET
# ============================================================

target = "steps"

X = df.drop(columns=[target], errors="ignore")

# Keep numeric columns
X = X.select_dtypes(include=["number"])

print(" Input shape:", X.shape)


# ============================================================
# CHECK FEATURES
# ============================================================

if hasattr(model, "feature_names_in_"):

    model_features = list(model.feature_names_in_)
    current_features = list(X.columns)

    print(" Model features:", len(model_features))
    print(" Current features:", len(current_features))

    missing_features = [
        col for col in model_features
        if col not in current_features
    ]

    extra_features = [
        col for col in current_features
        if col not in model_features
    ]

    if missing_features:
        print(" Missing features:", missing_features[:10])

    if extra_features:
        print(" Extra features:", extra_features[:10])

    # Make prediction data exactly match training features
    X = X.reindex(columns=model_features, fill_value=0)

print(" Features matched")


# ============================================================
# PREDICTION
# ============================================================

print(" Predicting...")

predictions = model.predict(X)

print(" Prediction done")

print(" First 10 predictions:")
print(predictions[:10])


# ============================================================
# SAVE PREDICTIONS
# ============================================================

output_path = (
    "../datasets/processed/cow_behaviour/"
    "Behaviour_predictions.csv"
)

output = pd.DataFrame({
    "prediction": predictions
})

output.to_csv(output_path, index=False)

print(" Predictions saved:")
print(os.path.abspath(output_path))

print(" DONE!")