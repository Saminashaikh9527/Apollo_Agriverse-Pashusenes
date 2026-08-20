import pandas as pd

df = pd.read_csv("../datasets/processed/katanning_combined.csv")

# drop ID columns (if exist)
df = df.drop(["Record_ID", "Animal_ID"], axis=1, errors="ignore")

# convert categorical → numeric
df = pd.get_dummies(df)

# remove missing values
df = df.dropna()

# save cleaned dataset
df.to_csv("../datasets/processed/katanning_ready.csv", index=False)

print("✅ Katanning preprocessing done")