import pandas as pd

df1 = pd.read_csv("location_all_cows_sampled_1_min.csv")
df2 = pd.read_csv("activity_all_cows_sampled_1_min.csv")

print("DF1 Columns:")
print(df1.columns)

print("\nDF2 Columns:")
print(df2.columns)