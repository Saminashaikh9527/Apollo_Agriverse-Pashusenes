import pandas as pd

print("🚀 Loading data...")

df = pd.read_csv("../datasets/processed/murdoch/murdoch_combined.csv", low_memory=False)

print("Shape:", df.shape)

# drop unnecessary columns
df = df.drop(columns=["study_name"], errors="ignore")

# fill missing values
df = df.fillna(df.median(numeric_only=True))

# keep only numeric
df = df.select_dtypes(include=["number"])

print("After clean:", df.shape)

# ✅ FIXED PATH
df.to_csv("../datasets/processed/murdoch/murdoch_clean.csv", index=False)

print("✅ Cleaned saved")