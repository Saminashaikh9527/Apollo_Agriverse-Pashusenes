import pandas as pd
import glob
import os

# ✅ Direct feed folder
folder_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\raw\feed"

all_files = glob.glob(os.path.join(folder_path, "*.csv"))

print("Files to combine:")
for f in all_files:
    print(f)

df_list = []

for file in all_files:
    try:
        df = pd.read_csv(file, low_memory=False)
        df_list.append(df)
    except Exception as e:
        print("❌ Skipped:", file)

combined_df = pd.concat(df_list, ignore_index=True)

print("Final Shape:", combined_df.shape)

# ✅ Save in processed folder
output_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\feed_combined.csv"

combined_df.to_csv(output_path, index=False)

print("✅ Feed dataset combined successfully!")