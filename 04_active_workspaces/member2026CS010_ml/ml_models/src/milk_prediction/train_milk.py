import joblib
import os

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

print("🚀 Loading split data...")

# -------------------------------------------------
# Paths
# -------------------------------------------------

SRC_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

PROJECT_DIR = os.path.abspath(
    os.path.join(SRC_DIR, "..")
)

data_dir = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "milk"
)

model_dir = os.path.join(
    SRC_DIR,
    "models"
)

print("📂 Data folder:", data_dir)
print("📂 Model folder:", model_dir)

# -------------------------------------------------
# Load split data
# -------------------------------------------------

X_train = joblib.load(
    os.path.join(data_dir, "X_train.pkl")
)

X_val = joblib.load(
    os.path.join(data_dir, "X_val.pkl")
)

X_test = joblib.load(
    os.path.join(data_dir, "X_test.pkl")
)

y_train = joblib.load(
    os.path.join(data_dir, "y_train.pkl")
)

y_val = joblib.load(
    os.path.join(data_dir, "y_val.pkl")
)

y_test = joblib.load(
    os.path.join(data_dir, "y_test.pkl")
)

print("Train shape:", X_train.shape)
print("Validation shape:", X_val.shape)
print("Test shape:", X_test.shape)

# -------------------------------------------------
# Train XGBoost
# -------------------------------------------------

print("⚙️ Training XGBoost...")

model = XGBRegressor(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.05,
    random_state=42,
    n_jobs=-1,
    objective="reg:squarederror"
)

model.fit(
    X_train,
    y_train,
    eval_set=[
        (X_val, y_val)
    ],
    verbose=False
)

print("✅ Training done")

# -------------------------------------------------
# Evaluation
# -------------------------------------------------

y_pred = model.predict(X_test)

mae = mean_absolute_error(
    y_test,
    y_pred
)

rmse = mean_squared_error(
    y_test,
    y_pred
) ** 0.5

r2 = r2_score(
    y_test,
    y_pred
)

print("📊 Test MAE:", mae)
print("📊 Test RMSE:", rmse)
print("📊 Test R²:", r2)

# -------------------------------------------------
# Save model inside src/models
# -------------------------------------------------

os.makedirs(
    model_dir,
    exist_ok=True
)

model_path = os.path.join(
    model_dir,
    "milk_xgb_model.pkl"
)

joblib.dump(
    model,
    model_path
)

print("💾 Model saved:")
print(model_path)