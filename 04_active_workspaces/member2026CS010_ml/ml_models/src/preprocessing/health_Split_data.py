import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split

print("🚀 Loading cleaned health data...")

data_path = "../datasets/processed/health/health_clean.csv"

df = pd.read_csv(data_path, low_memory=False)

print("Dataset shape:", df.shape)

# Target column
target_column = "Disease"

# Separate features and target
X = df.drop(columns=[target_column])
y = df[target_column]

print("Features:", X.shape)
print("Target:", y.shape)

# 70% Train / 30% Temporary
X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42,
    stratify=y
)

# 15% Validation / 15% Test
X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42,
    stratify=y_temp
)

print("Train:", X_train.shape)
print("Validation:", X_val.shape)
print("Test:", X_test.shape)

# Save location
output_dir = "../datasets/processed/health"

os.makedirs(output_dir, exist_ok=True)

joblib.dump(X_train, f"{output_dir}/X_train.pkl")
joblib.dump(X_val, f"{output_dir}/X_val.pkl")
joblib.dump(X_test, f"{output_dir}/X_test.pkl")

joblib.dump(y_train, f"{output_dir}/y_train.pkl")
joblib.dump(y_val, f"{output_dir}/y_val.pkl")
joblib.dump(y_test, f"{output_dir}/y_test.pkl")

print("✅ 70/15/15 health split saved")