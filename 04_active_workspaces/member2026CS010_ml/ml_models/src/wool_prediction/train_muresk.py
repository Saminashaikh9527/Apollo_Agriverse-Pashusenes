import joblib
import os

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

print("🚀 Loading Muresk split data...")

# =====================================================
# LOAD SPLIT DATA
# =====================================================

data_dir = "../datasets/processed/muresk"

X_train = joblib.load(f"{data_dir}/X_train.pkl")
X_val = joblib.load(f"{data_dir}/X_val.pkl")
X_test = joblib.load(f"{data_dir}/X_test.pkl")

y_train = joblib.load(f"{data_dir}/y_train.pkl")
y_val = joblib.load(f"{data_dir}/y_val.pkl")
y_test = joblib.load(f"{data_dir}/y_test.pkl")

print("Train:", X_train.shape)
print("Validation:", X_val.shape)
print("Test:", X_test.shape)

# =====================================================
# XGBOOST MODEL
# =====================================================

print("\n⚙️ Training XGBoost model...")

model = XGBRegressor(
    n_estimators=200,
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
    y_train,
    eval_set=[(X_val, y_val)],
    verbose=False
)

print("✅ Training completed!")

# =====================================================
# VALIDATION
# =====================================================

print("\n🔍 Validation prediction...")

val_pred = model.predict(X_val)

val_mae = mean_absolute_error(y_val, val_pred)
val_rmse = mean_squared_error(y_val, val_pred) ** 0.5
val_r2 = r2_score(y_val, val_pred)

print("📊 Validation Results:")
print("MAE :", val_mae)
print("RMSE:", val_rmse)
print("R²  :", val_r2)

# =====================================================
# TEST
# =====================================================

print("\n🔍 Test prediction...")

test_pred = model.predict(X_test)

test_mae = mean_absolute_error(y_test, test_pred)
test_rmse = mean_squared_error(y_test, test_pred) ** 0.5
test_r2 = r2_score(y_test, test_pred)

print("📊 Test Results:")
print("MAE :", test_mae)
print("RMSE:", test_rmse)
print("R²  :", test_r2)

# =====================================================
# SAVE MODEL
# =====================================================

model_dir = "models"
os.makedirs(model_dir, exist_ok=True)

model_path = "models/muresk_model.pkl"

joblib.dump(model, model_path)

print("\n💾 Model saved successfully!")
print("📁", model_path)