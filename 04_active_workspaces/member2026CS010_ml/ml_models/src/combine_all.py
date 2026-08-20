import pandas as pd
import glob
import os

base_path = "../datasets/raw/"

groups = {
    "katanning": "Katanning Green Pasture_*.csv",
    "murdoch": "Murdoch Green Pasture_*.csv",
    "muresk_barley": "Muresk Barley_*.csv",
    "muresk_dry": "Muresk Dry Pasture_*.csv",
    "muresk_stubble": "Muresk Stubble_*.csv"
}

output_path = "../datasets/processed/"
os.makedirs(output_path, exist_ok=True)

for name, pattern in groups.items():
    files = glob.glob(base_path + pattern)
    
    df = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)
    
    save_path = output_path + f"{name}_combined.csv"
    df.to_csv(save_path, index=False)
    
    print(f"✅ {name} done → {save_path}  Shape: {df.shape}")