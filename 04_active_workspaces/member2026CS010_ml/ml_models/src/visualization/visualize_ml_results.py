import os
import pandas as pd
import matplotlib.pyplot as plt


# --------------------------------------------------
# Paths
# --------------------------------------------------

feed_prediction_file = "../datasets/processed/feed/feed_predictions.csv"
feed_recommendation_file = "../datasets/processed/feed/feed_recommendations.csv"
milk_forecast_file = "../datasets/processed/milk/milk_forecast_predictions.csv"

output_dir = "../outputs/visualization"
os.makedirs(output_dir, exist_ok=True)


print("Starting ML visualization...")


# --------------------------------------------------
# 1. Feed Prediction Visualization
# --------------------------------------------------

feed_predictions = pd.read_csv(feed_prediction_file)

plt.figure(figsize=(10, 6))
plt.hist(feed_predictions["prediction"], bins=20)
plt.xlabel("Predicted Value")
plt.ylabel("Frequency")
plt.title("Feed Prediction Distribution")
plt.tight_layout()

plt.savefig(
    os.path.join(output_dir, "feed_prediction_distribution.png")
)
plt.close()

print("Feed prediction visualization saved.")


# --------------------------------------------------
# 2. Feed Recommendation Visualization
# --------------------------------------------------

feed_recommendations = pd.read_csv(feed_recommendation_file)

plt.figure(figsize=(12, 6))
plt.bar(
    feed_recommendations["recommended_feed"].astype(str),
    feed_recommendations["recommendation_score"]
)

plt.xlabel("Recommended Feed")
plt.ylabel("Recommendation Score")
plt.title("Top Feed Recommendations")
plt.xticks(rotation=45, ha="right")
plt.tight_layout()

plt.savefig(
    os.path.join(output_dir, "feed_recommendation_scores.png")
)
plt.close()

print("Feed recommendation visualization saved.")


# --------------------------------------------------
# 3. Milk Forecast Visualization
# --------------------------------------------------

milk_forecast = pd.read_csv(milk_forecast_file)

milk_forecast["Date"] = pd.to_datetime(
    milk_forecast["Date"]
)

milk_forecast = milk_forecast.sort_values("Date")

plt.figure(figsize=(12, 6))

plt.plot(
    milk_forecast["Date"],
    milk_forecast["milk_production"],
    label="Actual Milk Production"
)

plt.plot(
    milk_forecast["Date"],
    milk_forecast["predicted_milk"],
    label="Predicted Milk Production"
)

plt.xlabel("Date")
plt.ylabel("Milk Production")
plt.title("Milk Production Forecast")

plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()

plt.savefig(
    os.path.join(output_dir, "milk_production_forecast.png")
)
plt.close()

print("Milk forecast visualization saved.")


# --------------------------------------------------
# Completed
# --------------------------------------------------

print("\nVisualization completed successfully.")
print("Output folder:", output_dir)