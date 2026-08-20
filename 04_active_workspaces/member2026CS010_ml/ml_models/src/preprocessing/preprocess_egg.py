import pandas as pd
import os

print("🚀 Loading egg data...")

# =================================================
# PROJECT PATHS
# =================================================

SRC_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        ".."
    )
)

PROJECT_DIR = os.path.abspath(
    os.path.join(
        SRC_DIR,
        ".."
    )
)

# Input dataset
input_path = os.path.join(
    PROJECT_DIR,
    "datasets",
    "raw",
    "egg",
    "egg_production_predict_poultry.csv"
)

# Output cleaned dataset
output_path = os.path.join(
    PROJECT_DIR,
    "datasets",
    "processed",
    "egg",
    "egg_clean.csv"
)

print("📂 Input path:")
print(input_path)

print("📂 Output path:")
print(output_path)

# =================================================
# LOAD DATA
# =================================================

df = pd.read_csv(
    input_path,
    low_memory=False
)

print("Original shape:", df.shape)

print("Columns:")
print(df.columns.tolist())

# =================================================
# REMOVE UNNECESSARY ID COLUMN
# =================================================

df = df.drop(
    columns=[
        "Unnamed: 0"
    ],
    errors="ignore"
)

# =================================================
# REMOVE ROWS WHERE TARGET IS MISSING
# =================================================

df = df.dropna(
    subset=["Production"]
)

# =================================================
# TARGET
# =================================================

y = df["Production"]

# =================================================
# FEATURES
# =================================================

X = df.drop(
    columns=["Production"]
)

# =================================================
# CATEGORICAL MISSING VALUES
# =================================================

categorical_cols = X.select_dtypes(
    include=["object", "category"]
).columns

for col in categorical_cols:

    X[col] = X[col].fillna(
        "Unknown"
    )

# =================================================
# NUMERIC MISSING VALUES
# =================================================

numeric_cols = X.select_dtypes(
    include=["number"]
).columns

for col in numeric_cols:

    X[col] = X[col].fillna(
        X[col].median()
    )

# =================================================
# CATEGORICAL → NUMERIC
# =================================================

X = pd.get_dummies(
    X,
    dtype=int
)

# =================================================
# COMBINE FEATURES + TARGET
# =================================================

df_clean = X.copy()

df_clean["Production"] = y.values

# =================================================
# CREATE OUTPUT FOLDER
# =================================================

os.makedirs(
    os.path.dirname(output_path),
    exist_ok=True
)

# =================================================
# SAVE
# =================================================

df_clean.to_csv(
    output_path,
    index=False
)

print("✅ Egg preprocessing done")
print("Cleaned shape:", df_clean.shape)
print("🎯 Target: Production")

print("💾 Saved:")
print(output_path)