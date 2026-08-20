import pandas as pd
import os

print("🚀 Loading milk data...")

# Project root पासून path
BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

input_path = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "milk",
    "milk_combined.csv"
)

output_path = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "milk",
    "milk_clean.csv"
)

print(" Input:", input_path)

df = pd.read_csv(
    input_path,
    low_memory=False
)

print("Original shape:", df.shape)

# -------------------------------------------------
# Target
# -------------------------------------------------

target_column = "milkyield_summed"

# Remove rows where target is missing
df = df.dropna(
    subset=[target_column]
)

# -------------------------------------------------
# Remove leakage columns
# -------------------------------------------------

df = df.drop(
    columns=[
        "milkyield_morning",
        "milkyield_evening"
    ],
    errors="ignore"
)

# -------------------------------------------------
# Date processing
# -------------------------------------------------

if "Date" in df.columns:

    df["Date"] = pd.to_datetime(
        df["Date"],
        errors="coerce"
    )

    df["year"] = df["Date"].dt.year
    df["month"] = df["Date"].dt.month
    df["day"] = df["Date"].dt.day
    df["day_of_week"] = df["Date"].dt.dayofweek

    # Remove original date
    df = df.drop(
        columns=["Date"]
    )

# -------------------------------------------------
# Separate target
# -------------------------------------------------

y = df[target_column]

X = df.drop(
    columns=[target_column]
)

# -------------------------------------------------
# Handle categorical columns
# -------------------------------------------------

categorical_cols = X.select_dtypes(
    include=["object", "category"]
).columns

for col in categorical_cols:

    X[col] = X[col].fillna(
        "Unknown"
    )

# Convert categorical → numeric
X = pd.get_dummies(
    X,
    dtype=int
)

# -------------------------------------------------
# Handle numeric missing values
# -------------------------------------------------

numeric_cols = X.select_dtypes(
    include=["number"]
).columns

for col in numeric_cols:

    X[col] = X[col].fillna(
        X[col].median()
    )

# -------------------------------------------------
# Combine X + y
# -------------------------------------------------

df_clean = X.copy()

df_clean[target_column] = y.values

# Remove remaining rows with missing target
df_clean = df_clean.dropna(
    subset=[target_column]
)

# -------------------------------------------------
# Save
# -------------------------------------------------

os.makedirs(
    os.path.dirname(output_path),
    exist_ok=True
)

df_clean.to_csv(
    output_path,
    index=False
)

print(" Milk preprocessing done")
print("Cleaned shape:", df_clean.shape)
print(" Target:", target_column)
print(" Saved:", output_path)