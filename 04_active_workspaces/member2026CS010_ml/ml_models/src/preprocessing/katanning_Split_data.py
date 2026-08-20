import pandas as pd
from sklearn.model_selection import train_test_split

print("📥 Loading...")

df = pd.read_csv(
    "../datasets/processed/katanning/katanning_ready.csv"
)

target = "steps"

X = df.drop(columns=[target])
y = df[target]

print("📊 Dataset:", X.shape)

# =========================
# STEP 1: 70% TRAIN
#        30% TEMP
# =========================

print("🔀 Creating 70% train + 30% temp...")

X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.30,
    random_state=42
)

# =========================
# STEP 2:
# TEMP -> 15% VALIDATION
#        15% TEST
# =========================

print("🔀 Splitting temp into validation + test...")

X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.50,
    random_state=42
)

# =========================
# CHECK
# =========================

print("\n✅ Split completed!")

print("Train:", X_train.shape)
print("Validation:", X_val.shape)
print("Test:", X_test.shape)

# =========================
# SAVE
# =========================

print("\n💾 Saving split data...")

X_train.to_pickle("../datasets/processed/katanning/X_train.pkl")
y_train.to_pickle("../datasets/processed/katanning/y_train.pkl")

X_val.to_pickle("../datasets/processed/katanning/X_val.pkl")
y_val.to_pickle("../datasets/processed/katanning/y_val.pkl")

X_test.to_pickle("../datasets/processed/katanning/X_test.pkl")
y_test.to_pickle("../datasets/processed/katanning/y_test.pkl")

print("✅ DONE")