import pandas as pd
import os

print("🚀 Loading data...")

input_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\cow_behaviour\Behavior_combined.csv"

output_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\cow_behaviour\Behavior_clean.csv"

df = pd.read_csv(input_path, low_memory=False)

print("Original shape:", df.shape)

# Drop ID / categorical column
df = df.drop(columns=["cow_name"], errors="ignore")

# Convert timestamp
df["timestamp"] = pd.to_datetime(
    df["timestamp"],
    errors="coerce"
)

# Convert timestamp to numeric features
df["year"] = df["timestamp"].dt.year
df["month"] = df["timestamp"].dt.month
df["day"] = df["timestamp"].dt.day
df["hour"] = df["timestamp"].dt.hour
df["minute"] = df["timestamp"].dt.minute

# Remove original timestamp
df = df.drop(columns=["timestamp"])

# Numeric columns
numeric_columns = df.select_dtypes(include=["number"]).columns

df[numeric_columns] = df[numeric_columns].fillna(
    df[numeric_columns].median()
)

# Remove remaining missing rows
df = df.dropna()

print("Clean shape:", df.shape)

os.makedirs(
    os.path.dirname(output_path),
    exist_ok=True
)

df.to_csv(output_path, index=False)

print("✅ Preprocessing done")
print("💾 Saved:", output_path)