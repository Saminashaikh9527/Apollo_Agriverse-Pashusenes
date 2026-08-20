import joblib
import os

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error

print("🚀 Loading split data...")

X_train = joblib.load(
    "../datasets/processed/muresk/muresk_dry_X_train_dry.pkl"
)

X_test = joblib.load(
    "../datasets/processed/muresk/muresk_dry_X_test_dry.pkl"
)

X_val = joblib.load(
    "../datasets/processed/muresk/muresk_dry_X_val_dry.pkl"
)

y_train = joblib.load(
    "../datasets/processed/muresk/muresk_dry_y_train_dry.pkl"
)

y_test = joblib.load(
    "../datasets/processed/muresk/muresk_dry_y_test_dry.pkl"
)

y_val = joblib.load(
    "../datasets/processed/muresk/muresk_dry_y_val_dry.pkl"
)

print("Train:", X_train.shape)
print("Test :", X_test.shape)
print("Val  :", X_val.shape)

print("⚙️ Training XGBoost...")

model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42,
    n_jobs=-1
)

model.fit(
    X_train,
    y_train
)

print("✅ Training completed")

# Test
test_pred = model.predict(X_test)
test_mae = mean_absolute_error(
    y_test,
    test_pred
)

print("📊 Test MAE:", test_mae)

# Validation
val_pred = model.predict(X_val)
val_mae = mean_absolute_error(
    y_val,
    val_pred
)

print("📊 Validation MAE:", val_mae)

# Save model
os.makedirs(
    "models",
    exist_ok=True
)

model_path = "models/muresk_dry_model.pkl"

joblib.dump(
    model,
    model_path
)

print("💾 Model saved:")
print(model_path)