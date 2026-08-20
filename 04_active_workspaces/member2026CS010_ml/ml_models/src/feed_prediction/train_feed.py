import joblib
import os

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

print("🚀 Loading split data...")

base_path = "../datasets/processed/feed"

X_train = joblib.load(f"{base_path}/feed_X_train.pkl")
X_val = joblib.load(f"{base_path}/feed_X_val.pkl")
X_test = joblib.load(f"{base_path}/feed_X_test.pkl")

y_train = joblib.load(f"{base_path}/feed_y_train.pkl")
y_val = joblib.load(f"{base_path}/feed_y_val.pkl")
y_test = joblib.load(f"{base_path}/feed_y_test.pkl")

print("Train shape:", X_train.shape)
print("Validation shape:", X_val.shape)
print("Test shape:", X_test.shape)

print("⚙️ Training XGBoost...")

model = XGBRegressor(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.05,
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train,
    y_train,
    eval_set=[(X_val, y_val)],
    verbose=False
)

print("✅ Training done")

# Test prediction
y_pred = model.predict(X_test)

mae = mean_absolute_error(
    y_test,
    y_pred
)

rmse = mean_squared_error(
    y_test,
    y_pred
) ** 0.5

print("📊 Test MAE:", mae)
print("📊 Test RMSE:", rmse)

# Save model
model_path = "models/feed_xgb_model.pkl"

os.makedirs(
    "models",
    exist_ok=True
)

joblib.dump(
      model,
        "models/feed_xgb_model.pkl"
)

print("💾 Model saved:")
print(os.path.abspath(model_path))