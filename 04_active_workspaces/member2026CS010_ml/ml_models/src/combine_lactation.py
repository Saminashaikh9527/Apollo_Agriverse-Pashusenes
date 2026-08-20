import pandas as pd
import glob
import os

#  milk folder path
folder_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\raw\milk"

#  get all csv files
files = glob.glob(os.path.join(folder_path, "*.csv"))

print("Files found:")
for f in files:
    print(f)

dfs = []

for file in files:
    try:
        print("Reading:", file)
        df = pd.read_csv(file, low_memory=False)

        #  add source file (important)
        df["source_file"] = os.path.basename(file)

        dfs.append(df)

    except Exception as e:
        print(" Skipped:", file)

#  combine
combined_df = pd.concat(dfs, ignore_index=True)

print("Final Shape:", combined_df.shape)

#  save to processed folder
output_path = r"E:\internship\AGROLENS_PLF\agrolens-plf\04_active_workspaces\member2026CS010_ml\ml_models\datasets\processed\milk_combined.csv"

combined_df.to_csv(output_path, index=False)

print(" Milk dataset combined successfully!")