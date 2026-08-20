import joblib
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error

print("🚀 Loading split data...")

X_train = joblib.load("../datasets/processed/cow_behaviour/Behaviour_X_train.pkl")
X_val = joblib.load("../datasets/processed/cow_behaviour/Behaviour_X_val.pkl")
X_test = joblib.load("../datasets/processed/cow_behaviour/Behaviour_X_test.pkl")

y_train = joblib.load("../datasets/processed/cow_behaviour/Behaviour_y_train.pkl")
y_val = joblib.load("../datasets/processed/cow_behaviour/Behaviour_y_val.pkl")
y_test = joblib.load("../datasets/processed/cow_behaviour/Behaviour_y_test.pkl")

print("Train:", X_train.shape)
print("Validation:", X_val.shape)
print("Test:", X_test.shape)

print("⚙️ Training XGBoost...")

model = XGBRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
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

mae = mean_absolute_error(y_test, y_pred)

print("📊 Test MAE:", mae)

# Save model
joblib.dump(
    model,
    "models/behaviour_xgb_model.pkl"
)

print("💾 Model saved!")