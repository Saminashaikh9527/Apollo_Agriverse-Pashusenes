import pandas as pd
import os

print("🚀 Loading feed dataset...")

input_path = "../datasets/processed/feed/feed_combined.csv"
output_path = "../datasets/processed/feed/feed_clean.csv"

df = pd.read_csv(input_path, low_memory=False)

print("Original shape:", df.shape)

# Keep only the main feed dataset
# The last 50 rows belong to a separate price table
df = df[df["feed_id"].notna()].copy()

print("After removing separate price table:", df.shape)

# Columns belonging to the separate price dataset
remove_columns = [
    "Price_ID",
    "Feed_ID",
    "Feed_Name",
    "Category",
    "Price_Rs_per_kg",
    "Market",
    "State"
]

df = df.drop(
    columns=remove_columns,
    errors="ignore"
)

# Remove ID column
df = df.drop(
    columns=["feed_id"],
    errors="ignore"
)

# Convert categorical columns to numeric
df = pd.get_dummies(df)

# Fill numeric missing values
numeric_columns = df.select_dtypes(
    include=["number"]
).columns

df[numeric_columns] = df[numeric_columns].fillna(
    df[numeric_columns].median()
)

# Remove remaining missing rows
df = df.dropna()

# Create folder
os.makedirs(
    os.path.dirname(output_path),
    exist_ok=True
)

df.to_csv(
    output_path,
    index=False
)

print("✅ Preprocessing completed")
print("Cleaned shape:", df.shape)
print("💾 Saved:", output_path)