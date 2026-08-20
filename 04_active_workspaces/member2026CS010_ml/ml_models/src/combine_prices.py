import pandas as pd
import os

# ✅ file paths
base_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\raw\prices"

file1 = os.path.join(base_path, "animal_feed_prices.csv")
file2 = os.path.join(base_path, "animal_feed_prices_updated.csv")

# ✅ read
df1 = pd.read_csv(file1)
df2 = pd.read_csv(file2)

# ✅ combine
combined_df = pd.concat([df1, df2], ignore_index=True)

# 🔥 remove duplicates (important)
combined_df = combined_df.drop_duplicates()

print("Final Shape:", combined_df.shape)

# ✅ save to processed
output_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\final_feed_prices.csv"

combined_df.to_csv(output_path, index=False)

print("✅ Feed prices combined successfully!")