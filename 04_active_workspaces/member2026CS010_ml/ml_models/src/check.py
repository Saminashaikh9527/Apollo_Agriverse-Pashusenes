import pandas as pd

# Load your combined dataset
df = pd.read_csv("lactation_combined.csv")

# 1. Shape (rows, columns)
print("Shape:", df.shape)

# 2. Column names
print("\nColumns:")
print(df.columns)

# 3. First 5 rows
print("\nHead:")
print(df.head())

# 4. Last 5 rows
print("\nTail:")
print(df.tail())

# 5. Check missing values
print("\nMissing values:")
print(df.isnull().sum())