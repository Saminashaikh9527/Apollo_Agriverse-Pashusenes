import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split

print("🚀 Loading cleaned Muresk data...")

# Load cleaned dataset
input_path = "../datasets/processed/muresk/muresk_clean.csv"

df = pd.read_csv(input_path)

print("Original shape:", df.shape)

# 🎯 TARGET
# Change this if your actual target is different
target = "steps"

if target not in df.columns:
    raise ValueError(
        f"❌ Target column '{target}' not found.\n"
        f"Available columns: {list(df.columns)}"
    )

# Separate X and y
X = df.drop(columns=[target])
y = df[target]

print("Features:", X.shape)
print("Target:", y.shape)

# =====================================================
# 1️⃣ 70% TRAIN + 30% TEMP
# =====================================================

X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42
)

# =====================================================
# 2️⃣ 15% VALIDATION + 15% TEST
# =====================================================

X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42
)

print("\n📊 Split results:")
print("Train      :", X_train.shape)
print("Validation :", X_val.shape)
print("Test       :", X_test.shape)

# Create output folder
output_dir = "../datasets/processed/muresk"
os.makedirs(output_dir, exist_ok=True)

# =====================================================
# 💾 SAVE SPLITS
# =====================================================

joblib.dump(X_train, f"{output_dir}/X_train.pkl")
joblib.dump(X_val, f"{output_dir}/X_val.pkl")
joblib.dump(X_test, f"{output_dir}/X_test.pkl")

joblib.dump(y_train, f"{output_dir}/y_train.pkl")
joblib.dump(y_val, f"{output_dir}/y_val.pkl")
joblib.dump(y_test, f"{output_dir}/y_test.pkl")

print("\n✅ Muresk split completed!")
print("📁 Saved in:", output_dir)