import pandas as pd
import numpy as np
import os
import joblib

from sklearn.ensemble import IsolationForest


print(" Starting Cow Behaviour Anomaly Detection...")


# =====================================================
# PATHS
# =====================================================

SRC_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

PROJECT_DIR = os.path.abspath(
    os.path.join(SRC_DIR, "..", "..")
)

INPUT_PATH = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "cow_behaviour",
    "Behavior_clean.csv"
)

OUTPUT_DIR = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "cow_behaviour"
)

MODEL_DIR = os.path.join(
    PROJECT_DIR,
    "src",
    "models"
)

OUTPUT_PATH = os.path.join(
    OUTPUT_DIR,
    "Behaviour_anomaly_predictions.csv"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "cow_behaviour_anomaly_model.pkl"
)


# =====================================================
# LOAD DATA
# =====================================================

print(" Loading data...")
print(INPUT_PATH)

df = pd.read_csv(
    INPUT_PATH,
    low_memory=False
)

print("Original shape:", df.shape)


# =====================================================
# FEATURES
# =====================================================

feature_columns = [
    "mi",
    "steps",
    "area",
    "hour",
    "minute"
]

for col in feature_columns:

    if col not in df.columns:

        raise ValueError(
            f" Column not found: {col}"
        )


X = df[feature_columns].copy()


# =====================================================
# HANDLE MISSING VALUES
# =====================================================

X = X.replace(
    [np.inf, -np.inf],
    np.nan
)

X = X.fillna(
    X.median()
)


# =====================================================
# ISOLATION FOREST
# =====================================================

print(" Training anomaly detection model...")


model = IsolationForest(
    n_estimators=200,
    contamination=0.01,
    random_state=42,
    n_jobs=-1
)


model.fit(X)


print(" Anomaly model trained")


# =====================================================
# PREDICT ANOMALIES
# =====================================================

print("🔍 Detecting abnormal behaviour...")


predictions = model.predict(X)

scores = model.decision_function(X)


# Isolation Forest:
#  1  = Normal
# -1  = Anomaly

df["anomaly_label"] = np.where(
    predictions == -1,
    "Abnormal",
    "Normal"
)

df["anomaly_score"] = scores


# =====================================================
# SAVE MODEL
# =====================================================

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)

joblib.dump(
    model,
    MODEL_PATH
)


# =====================================================
# SAVE RESULTS
# =====================================================

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)

df.to_csv(
    OUTPUT_PATH,
    index=False
)


# =====================================================
# SUMMARY
# =====================================================

normal_count = (
    df["anomaly_label"] == "Normal"
).sum()

abnormal_count = (
    df["anomaly_label"] == "Abnormal"
).sum()


print()
print(" Anomaly Detection Results")
print("--------------------------------")

print(
    "Normal records:",
    normal_count
)

print(
    "Abnormal records:",
    abnormal_count
)

print(
    "Anomaly percentage:",
    round(
        abnormal_count / len(df) * 100,
        2
    ),
    "%"
)


print()
print(" Model saved:")
print(MODEL_PATH)

print()
print(" Results saved:")
print(OUTPUT_PATH)

print()
print(" Cow Behaviour Anomaly Detection completed!")