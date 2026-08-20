import pandas as pd
import joblib

from sklearn.model_selection import train_test_split

print("🚀 Loading cleaned data...")

data_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\muresk\muresk_stubble_clean.csv"

df = pd.read_csv(data_path)

print("Dataset shape:", df.shape)

# Target
target = "steps"

X = df.drop(columns=[target])
y = df[target]

print("📊 Splitting data...")

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

# Save
joblib.dump(X_train, "../datasets/processed/muresk/muresk_stubble_X_train.pkl")
joblib.dump(X_val, "../datasets/processed/muresk/muresk_stubble_X_val.pkl")
joblib.dump(X_test, "../datasets/processed/muresk/muresk_stubble_X_test.pkl")

joblib.dump(y_train, "../datasets/processed/muresk/muresk_stubble_y_train.pkl")
joblib.dump(y_val, "../datasets/processed/muresk/muresk_stubble_y_val.pkl")
joblib.dump(y_test, "../datasets/processed/muresk/muresk_stubble_y_test.pkl")

print("✅ 70/15/15 split saved")
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split

print("🚀 Loading cleaned data...")

data_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\muresk\muresk_stubble_clean.csv"

df = pd.read_csv(data_path)

print("Dataset shape:", df.shape)

# Target
target = "steps"

X = df.drop(columns=[target])
y = df[target]

print("📊 Splitting data...")

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

# Save
joblib.dump(X_train, "../datasets/processed/muresk/muresk_stubble_X_train.pkl")
joblib.dump(X_val, "../datasets/processed/muresk/muresk_stubble_X_val.pkl")
joblib.dump(X_test, "../datasets/processed/muresk/muresk_stubble_X_test.pkl")

joblib.dump(y_train, "../datasets/processed/muresk/muresk_stubble_y_train.pkl")
joblib.dump(y_val, "../datasets/processed/muresk/muresk_stubble_y_val.pkl")
joblib.dump(y_test, "../datasets/processed/muresk/muresk_stubble_y_test.pkl")

print("✅ 70/15/15 split saved")