import pandas as pd
from sklearn.model_selection import train_test_split
import joblib

print("🚀 Loading cleaned data...")

# Clean file load
df = pd.read_csv(
    "../datasets/processed/murdoch/murdoch_clean.csv"
)

print("Shape:", df.shape)

# 🎯 TARGET
target_column = "grazing"

# Split X and y
X = df.drop(columns=[target_column])
y = df[target_column]

# ==========================================
# STEP 1: 70% TRAIN + 30% TEMP
# ==========================================

print("🔀 Creating 70% train + 30% temporary...")

X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42
)

# ==========================================
# STEP 2: TEMP → 15% VALIDATION + 15% TEST
# ==========================================

print("🔀 Creating 15% validation + 15% test...")

X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42
)

# ==========================================
# CHECK
# ==========================================

print("\n✅ Split completed!")

print("Train:", X_train.shape)
print("Validation:", X_val.shape)
print("Test:", X_test.shape)

# ==========================================
# SAVE
# ==========================================

print("\n💾 Saving split files...")

joblib.dump(
    X_train,
    "../datasets/processed/murdoch/X_train.pkl"
)

joblib.dump(
    y_train,
    "../datasets/processed/murdoch/y_train.pkl"
)

joblib.dump(
    X_val,
    "../datasets/processed/murdoch/X_val.pkl"
)

joblib.dump(
    y_val,
    "../datasets/processed/murdoch/y_val.pkl"
)

joblib.dump(
    X_test,
    "../datasets/processed/murdoch/X_test.pkl"
)

joblib.dump(
    y_test,
    "../datasets/processed/murdoch/y_test.pkl"
)

print("✅ 70/15/15 split saved successfully!")