import pandas as pd
import numpy as np
import os
import joblib

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


print(" Starting Milk Forecasting...")


# =====================================================
# PATHS
# =====================================================

SRC_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

PROJECT_DIR = os.path.abspath(
    os.path.join(SRC_DIR, "..", "..")
)

INPUT_PATH = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "milk",
    "Milk_combined.csv"
)

OUTPUT_DIR = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "milk"
)

MODEL_DIR = os.path.join(
    PROJECT_DIR,
    "src",
    "models"
)

FORECAST_DATA_PATH = os.path.join(
    OUTPUT_DIR,
    "milk_forecast_data.csv"
)

PREDICTION_PATH = os.path.join(
    OUTPUT_DIR,
    "milk_forecast_predictions.csv"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "milk_forecast_xgb_model.pkl"
)


print(" Input:")
print(INPUT_PATH)


# =====================================================
# LOAD DATA
# =====================================================

df = pd.read_csv(
    INPUT_PATH,
    low_memory=False
)

print("Original shape:", df.shape)


# =====================================================
# CHECK COLUMNS
# =====================================================

if "Date" not in df.columns:
    raise ValueError("Date column not found")

if "milkyield_summed" not in df.columns:
    raise ValueError(
        " milkyield_summed column not found"
    )


# =====================================================
# DATE + TARGET
# =====================================================

df["Date"] = pd.to_datetime(
    df["Date"],
    errors="coerce"
)

df["milkyield_summed"] = pd.to_numeric(
    df["milkyield_summed"],
    errors="coerce"
)

df = df.dropna(
    subset=[
        "Date",
        "milkyield_summed"
    ]
)


# =====================================================
# DAILY MILK PRODUCTION
# =====================================================

daily = (
    df.groupby("Date")["milkyield_summed"]
    .sum()
    .reset_index()
)

daily = daily.sort_values("Date")

daily = daily.rename(
    columns={
        "milkyield_summed":
        "milk_production"
    }
)

print(
    "Daily dataset shape:",
    daily.shape
)


# =====================================================
# TIME FEATURES
# =====================================================

daily["year"] = daily["Date"].dt.year
daily["month"] = daily["Date"].dt.month
daily["day"] = daily["Date"].dt.day
daily["day_of_week"] = (
    daily["Date"].dt.dayofweek
)
daily["day_of_year"] = (
    daily["Date"].dt.dayofyear
)


# =====================================================
# LAG FEATURES
# =====================================================

daily["lag_1"] = (
    daily["milk_production"].shift(1)
)

daily["lag_2"] = (
    daily["milk_production"].shift(2)
)

daily["lag_3"] = (
    daily["milk_production"].shift(3)
)

daily["lag_7"] = (
    daily["milk_production"].shift(7)
)

daily["lag_14"] = (
    daily["milk_production"].shift(14)
)


# =====================================================
# ROLLING FEATURES
# =====================================================

daily["rolling_mean_7"] = (
    daily["milk_production"]
    .shift(1)
    .rolling(7)
    .mean()
)

daily["rolling_mean_14"] = (
    daily["milk_production"]
    .shift(1)
    .rolling(14)
    .mean()
)


# =====================================================
# REMOVE MISSING LAG ROWS
# =====================================================

daily = daily.dropna()

print(
    "Forecast dataset shape:",
    daily.shape
)


# =====================================================
# CREATE FOLDERS
# =====================================================

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


# =====================================================
# SAVE FORECAST DATA
# =====================================================

daily.to_csv(
    FORECAST_DATA_PATH,
    index=False
)

print(
    " Forecast data saved:"
)

print(
    FORECAST_DATA_PATH
)


# =====================================================
# FEATURES
# =====================================================

feature_columns = [
    "year",
    "month",
    "day",
    "day_of_week",
    "day_of_year",
    "lag_1",
    "lag_2",
    "lag_3",
    "lag_7",
    "lag_14",
    "rolling_mean_7",
    "rolling_mean_14"
]

X = daily[
    feature_columns
]

y = daily[
    "milk_production"
]


# =====================================================
# TIME-BASED SPLIT
# =====================================================

split_index = int(
    len(daily) * 0.80
)

X_train = X.iloc[
    :split_index
]

X_test = X.iloc[
    split_index:
]

y_train = y.iloc[
    :split_index
]

y_test = y.iloc[
    split_index:
]


print(
    "Train:",
    X_train.shape
)

print(
    "Test:",
    X_test.shape
)


# =====================================================
# XGBOOST FORECASTING MODEL
# =====================================================

print(
    " Training forecasting model..."
)

model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42
)

model.fit(
    X_train,
    y_train
)

print(
    " Forecasting model trained"
)


# =====================================================
# PREDICTION
# =====================================================

predictions = model.predict(
    X_test
)


# =====================================================
# EVALUATION
# =====================================================

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        predictions
    )
)

print()
print(
    " Forecasting Evaluation"
)

print(
    "MAE :",
    mae
)

print(
    "RMSE:",
    rmse
)


# =====================================================
# SAVE MODEL
# =====================================================

joblib.dump(
    model,
    MODEL_PATH
)

print()
print(
    " Model saved:"
)

print(
    MODEL_PATH
)


# =====================================================
# SAVE PREDICTIONS
# =====================================================

forecast_result = daily.iloc[
    split_index:
].copy()

forecast_result[
    "predicted_milk"
] = predictions

forecast_result[
    [
        "Date",
        "milk_production",
        "predicted_milk"
    ]
].to_csv(
    PREDICTION_PATH,
    index=False
)

print()
print(
    " Predictions saved:"
)

print(
    PREDICTION_PATH
)

print()
print(
    " Milk Forecasting completed!"
)