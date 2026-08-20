import pandas as pd
import os

print("🚀 Loading health data...")

input_path = "../datasets/processed/health/health_combined.csv"
output_path = "../datasets/processed/health/health_clean.csv"

df = pd.read_csv(input_path, low_memory=False)

print("Original shape:", df.shape)

# Remove unnecessary ID columns
df = df.drop(
    columns=[
        "Record_ID",
        "Animal_ID",
        "ID",
        "Cattle_ID"
    ],
    errors="ignore"
)

# Remove rows only when target is missing
df = df.dropna(subset=["Disease"])

# Separate target
y = df["Disease"]

# Separate features
X = df.drop(columns=["Disease"])

# Fill categorical missing values
categorical_cols = X.select_dtypes(
    include=["object", "category"]
).columns

for col in categorical_cols:
    X[col] = X[col].fillna("Unknown")

# Fill numeric missing values
numeric_cols = X.select_dtypes(
    include=["number"]
).columns

for col in numeric_cols:
    X[col] = X[col].fillna(X[col].median())

# Convert categorical columns to numeric
X = pd.get_dummies(X)

# Combine features + target
df_clean = X.copy()
df_clean["Disease"] = y.values

# Create folder
os.makedirs(
    os.path.dirname(output_path),
    exist_ok=True
)

# Save
df_clean.to_csv(
    output_path,
    index=False
)

print("✅ Health preprocessing done")
print("Cleaned shape:", df_clean.shape)
print("🎯 Target: Disease")
print("💾 Saved:", output_path)