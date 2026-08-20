import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from xgboost import XGBRegressor
import joblib
import os

print("🚀 Loading data...")

df = pd.read_csv(
    r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\katanning\katanning_ready.csv",
    nrows=5000
)

print("✅ Loaded:", df.shape)

# 🎯 TARGET
target = "steps"

# X and y
X = df.drop(columns=[target])
y = df[target]

# Only numeric features
X = X.select_dtypes(include=["number"])

print("Features shape:", X.shape)

# 🔀 Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("Train size:", X_train.shape)
print("Test size:", X_test.shape)

# 🚀 XGBoost model
model = XGBRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    n_jobs=-1,
    objective="reg:squarederror"
)

print("🚀 XGBoost Training started...")

model.fit(X_train, y_train)

print("✅ Training done")

# 🔮 Prediction
y_pred = model.predict(X_test)

# 📊 Evaluation
mae = mean_absolute_error(y_test, y_pred)

print("📊 MAE:", mae)

# 📁 Save model
os.makedirs("models", exist_ok=True)

model_path = "models/katanning_model.pkl"

joblib.dump(model, model_path)

print("✅ XGBoost model saved successfully!")
print("📂 Location:", model_path)