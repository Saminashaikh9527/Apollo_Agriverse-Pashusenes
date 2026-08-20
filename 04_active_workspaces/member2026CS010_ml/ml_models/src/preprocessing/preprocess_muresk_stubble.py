import pandas as pd
import os

print("🚀 Loading data...")

input_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\muresk\muresk_stubble_combined.csv"

output_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\muresk\muresk_stubble_clean.csv"

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

os.makedirs(
    os.path.dirname(output_path),
    exist_ok=True
)

df.to_csv(
    output_path,
    index=False
)

print("✅ Muresk Stubble preprocessing done")
print("💾 Saved:", output_path)