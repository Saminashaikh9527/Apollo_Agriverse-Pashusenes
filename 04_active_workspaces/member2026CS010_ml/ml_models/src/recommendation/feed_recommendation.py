import pandas as pd

INPUT_FILE = "../datasets/processed/feed/feed_clean.csv"
OUTPUT_FILE = "../datasets/processed/feed/feed_recommendations.csv"

# User input
animal_type = "Cow"
production_goal = "Milk"
season = "Summer"


df = pd.read_csv(INPUT_FILE, low_memory=False)


# --------------------------------------------------
# 1. Match animal type
# --------------------------------------------------

animal_score = pd.Series(0.0, index=df.index)

if animal_type == "Cow":
    animal_score = (
        df["suitable_for_Dairy Cow"].astype(float) * 1.0
        + df["suitable_for_All Cattle"].astype(float) * 0.8
    )

elif animal_type == "Buffalo":
    animal_score = (
        df["suitable_for_Buffalo"].astype(float) * 1.0
        + df["suitable_for_All Cattle"].astype(float) * 0.8
    )

elif animal_type == "Goat":
    animal_score = df["suitable_for_Goat"].astype(float)

elif animal_type == "Sheep":
    animal_score = df["suitable_for_Sheep"].astype(float)


# --------------------------------------------------
# 2. Production goal match
# --------------------------------------------------

goal_column = f"production_goal_{production_goal}"

if goal_column in df.columns:
    goal_score = df[goal_column].astype(float)
else:
    goal_score = pd.Series(0.0, index=df.index)


# --------------------------------------------------
# 3. Season match
# --------------------------------------------------

season_column = f"season_{season}"

if season_column in df.columns:
    season_score = df[season_column].astype(float)
else:
    season_score = pd.Series(0.0, index=df.index)


# --------------------------------------------------
# 4. Normalize nutritional values
# --------------------------------------------------

def normalize(series):
    minimum = series.min()
    maximum = series.max()

    if maximum == minimum:
        return pd.Series(1.0, index=series.index)

    return (series - minimum) / (maximum - minimum)


protein_score = normalize(df["crude_protein_percent"])
energy_score = normalize(df["metabolizable_energy_MJkg"])
digestibility_score = normalize(df["digestibility_percent"])

# Lower cost = better
cost_score = 1 - normalize(df["cost_per_kg_inr"])


# --------------------------------------------------
# 5. Final recommendation score
# --------------------------------------------------

df["recommendation_score"] = (
    animal_score * 0.25
    + goal_score * 0.20
    + season_score * 0.10
    + protein_score * 0.15
    + energy_score * 0.15
    + digestibility_score * 0.10
    + cost_score * 0.05
)


# --------------------------------------------------
# 6. Get feed name
# --------------------------------------------------

feed_name_columns = [
    col for col in df.columns
    if col.startswith("feed_name_")
]


def get_feed_name(row):
    for col in feed_name_columns:
        if row[col]:
            return col.replace("feed_name_", "")
    return "Unknown"


df["recommended_feed"] = df.apply(get_feed_name, axis=1)


# --------------------------------------------------
# 7. Top recommendations
# --------------------------------------------------

result = df.sort_values(
    "recommendation_score",
    ascending=False
).head(10)


result["recommendation_score"] = (
    result["recommendation_score"] * 100
).round(2)


output_columns = [
    "recommended_feed",
    "recommendation_score",
    "crude_protein_percent",
    "metabolizable_energy_MJkg",
    "digestibility_percent",
    "cost_per_kg_inr"
]

result[output_columns].to_csv(
    OUTPUT_FILE,
    index=False
)


print("\nTOP FEED RECOMMENDATIONS")
print("=" * 60)
print(result[output_columns].to_string(index=False))

print("\nRecommendation file created:")
print(OUTPUT_FILE)