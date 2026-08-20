import pandas as pd
import os

print("🚀 Loading data...")

# Correct paths from src/
input_path = "../datasets/processed/muresk/muresk_barley_combined.csv"
output_path = "../datasets/processed/muresk/muresk_clean.csv"

# Load data
df = pd.read_csv(
    input_path,
    low_memory=False
)

print("Original shape:", df.shape)

# Remove unnecessary columns
df = df.drop(
    columns=["study_name"],
    errors="ignore"
)

# Fill missing numeric values
numeric_columns = df.select_dtypes(
    include=["number"]
).columns

df[numeric_columns] = df[numeric_columns].fillna(
    df[numeric_columns].median()
)

# Keep numeric columns only
df = df.select_dtypes(
    include=["number"]
)

print("After clean:", df.shape)

# Make sure folder exists
os.makedirs(
    os.path.dirname(output_path),
    exist_ok=True
)

# Save cleaned data
df.to_csv(
    output_path,
    index=False
)

print("✅ Cleaned dataset saved!")
print(output_path)