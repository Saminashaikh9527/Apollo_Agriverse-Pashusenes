import pandas as pd

# load files
activity = pd.read_csv("../datasets/raw/activity_all_cows_sampled_1_min.csv")
location1 = pd.read_csv("../datasets/raw/location_all_cows_sampled_1_min.csv")
location2 = pd.read_csv("../datasets/raw/location_all_cows_sampled_1_min_3lyingareas.csv")

# clean column names
activity.columns = activity.columns.str.lower().str.strip()
location1.columns = location1.columns.str.lower().str.strip()
location2.columns = location2.columns.str.lower().str.strip()

# convert timestamp
activity["timestamp"] = pd.to_datetime(activity["timestamp"]).dt.floor("min")
location1["timestamp"] = pd.to_datetime(location1["timestamp"]).dt.floor("min")
location2["timestamp"] = pd.to_datetime(location2["timestamp"]).dt.floor("min")

# combine location files
location_all = pd.concat([location1, location2], ignore_index=True)

# merge
final_df = pd.merge(
    activity,
    location_all,
    on=["timestamp", "cow_name"],
    how="left"
)

# check result
print(final_df.head())
print("Shape:", final_df.shape)
print("Missing values:\n", final_df.isnull().sum())

# save
final_df.to_csv("../datasets/processed/Behavior_combined.csv", index=False)

print("✅ DONE")