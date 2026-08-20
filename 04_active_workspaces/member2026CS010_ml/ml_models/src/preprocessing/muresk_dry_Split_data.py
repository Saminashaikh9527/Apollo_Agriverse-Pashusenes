import pandas as pd
from sklearn.model_selection import train_test_split
import joblib

print("🚀 Loading cleaned Muresk Dry data...")

df = pd.read_csv(
    "../datasets/processed/muresk/muresk_dry_clean.csv"
)

print("Shape:", df.shape)

target = "steps"

X = df.drop(columns=[target])
y = df[target]

# 70% train, 30% temporary
X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42
)

# 15% test, 15% validation
X_test, X_val, y_test, y_val = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42
)

print("Train:", X_train.shape)
print("Test :", X_test.shape)
print("Val  :", X_val.shape)

# Save
joblib.dump(
    X_train,
    "../datasets/processed/muresk/muresk_dry_X_train_dry.pkl"
)

joblib.dump(
    X_test,
    "../datasets/processed/muresk/muresk_dry_X_test_dry.pkl"
)

joblib.dump(
    X_val,
    "../datasets/processed/muresk/muresk_dry_X_val_dry.pkl"
)

joblib.dump(
    y_train,
    "../datasets/processed/muresk/muresk_dry_y_train_dry.pkl"
)

joblib.dump(
    y_test,
    "../datasets/processed/muresk/muresk_dry_y_test_dry.pkl"
)

joblib.dump(
    y_val,
    "../datasets/processed/muresk/muresk_dry_y_val_dry.pkl"
)

print("✅ 70/15/15 split saved!")