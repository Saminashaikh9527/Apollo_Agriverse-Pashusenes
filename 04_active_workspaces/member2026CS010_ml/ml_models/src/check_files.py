import pandas as pd

# files paths
activity_file = "../datasets/raw/activity_all_cows_sampled_1_min.csv"
location1_file = "../datasets/raw/location_all_cows_sampled_1_min.csv"
location2_file = "../datasets/raw/location_all_cows_sampled_1_min_3lyingareas.csv"

# read only headers (fast)
activity = pd.read_csv(activity_file, nrows=5)
location1 = pd.read_csv(location1_file, nrows=5)
location2 = pd.read_csv(location2_file, nrows=5)

# clean column names
activity_cols = activity.columns.str.lower().str.strip()
location1_cols = location1.columns.str.lower().str.strip()
location2_cols = location2.columns.str.lower().str.strip()

print("Activity columns:\n", list(activity_cols))
print("\nLocation1 columns:\n", list(location1_cols))
print("\nLocation2 columns:\n", list(location2_cols))

# compare
print("\n--- Column Matching ---")

if list(activity_cols) == list(location1_cols):
    print("✅ Activity & Location1 match")
else:
    print("❌ Activity & Location1 mismatch")

if list(activity_cols) == list(location2_cols):
    print("✅ Activity & Location2 match")
else:
    print("❌ Activity & Location2 mismatch")