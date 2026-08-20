import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split

print("🚀 Loading cleaned feed data...")

data_path = "../datasets/processed/feed/feed_clean.csv"

df = pd.read_csv(data_path)

print("Dataset shape:", df.shape)

# Target
target_column = "cost_per_kg_inr"

X = df.drop(
    columns=[target_column]
)

y = df[target_column]

# 70% train, 30% temporary
X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42
)

# 15% validation, 15% test
X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42
)

print("Train:", X_train.shape)
print("Validation:", X_val.shape)
print("Test:", X_test.shape)

output_dir = "../datasets/processed/feed"

os.makedirs(
    output_dir,
    exist_ok=True
)

joblib.dump(X_train, f"{output_dir}/feed_X_train.pkl")
joblib.dump(X_val, f"{output_dir}/feed_X_val.pkl")
joblib.dump(X_test, f"{output_dir}/feed_X_test.pkl")

joblib.dump(y_train, f"{output_dir}/feed_y_train.pkl")
joblib.dump(y_val, f"{output_dir}/feed_y_val.pkl")
joblib.dump(y_test, f"{output_dir}/feed_y_test.pkl")

print("✅ 70/15/15 split saved")