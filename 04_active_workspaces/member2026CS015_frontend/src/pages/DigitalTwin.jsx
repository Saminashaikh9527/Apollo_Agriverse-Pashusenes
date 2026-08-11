import { useState } from "react";

function DigitalTwin() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setPrediction(null);
  };

  const handlePredict = () => {
    if (!image) {
      alert("Please upload an animal photo first.");
      return;
    }

    setLoading(true);

    // Temporary frontend-only prediction.
    // Later replace this with your FastAPI API call.
    setTimeout(() => {
      setPrediction({
        animal: "Cow",
        health: "Healthy",
        confidence: "94%",
        temperature: "Normal",
        activity: "Normal",
        recommendation:
          "Animal appears healthy. Continue regular feeding and monitoring.",
      });

      setLoading(false);
    }, 1200);
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    setPrediction(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Digital Twin</h1>
          <p style={styles.subtitle}>
            Upload an animal photo to analyze its health
          </p>
        </div>

        <div style={styles.badge}>
          🐄 AI Animal Analysis
        </div>
      </div>

      <div style={styles.grid}>
        {/* Upload section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Animal Photo</h2>

          {!preview ? (
            <label style={styles.uploadBox}>
              <div style={styles.uploadIcon}>📷</div>

              <h3 style={styles.uploadTitle}>
                Upload Animal Photo
              </h3>

              <p style={styles.uploadText}>
                Take or select a clear photo of the animal
              </p>

              <span style={styles.uploadButton}>
                Choose Photo
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          ) : (
            <div>
              <div style={styles.imageContainer}>
                <img
                  src={preview}
                  alt="Animal preview"
                  style={styles.preview}
                />
              </div>

              <div style={styles.imageActions}>
                <label style={styles.changeButton}>
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>

                <button
                  onClick={removeImage}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handlePredict}
            disabled={!image || loading}
            style={{
              ...styles.predictButton,
              opacity: !image || loading ? 0.5 : 1,
              cursor:
                !image || loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading ? "Analyzing..." : "🔍 Analyze & Predict"}
          </button>
        </div>

        {/* Prediction section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Prediction Result
          </h2>

          {!prediction ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🤖</div>

              <h3 style={styles.emptyTitle}>
                Waiting for Analysis
              </h3>

              <p style={styles.emptyText}>
                Upload an animal photo and click
                <br />
                "Analyze & Predict"
              </p>
            </div>
          ) : (
            <div>
              <div style={styles.resultHeader}>
                <div style={styles.resultAnimal}>
                  🐄
                </div>

                <div>
                  <div style={styles.resultLabel}>
                    Detected Animal
                  </div>

                  <div style={styles.resultValue}>
                    {prediction.animal}
                  </div>
                </div>

                <div style={styles.healthy}>
                  ✓ {prediction.health}
                </div>
              </div>

              <div style={styles.stats}>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>
                    Confidence
                  </span>

                  <strong style={styles.statValue}>
                    {prediction.confidence}
                  </strong>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statLabel}>
                    Temperature
                  </span>

                  <strong style={styles.statValue}>
                    {prediction.temperature}
                  </strong>
                </div>

                <div style={styles.stat}>
                  <span style={styles.statLabel}>
                    Activity
                  </span>

                  <strong style={styles.statValue}>
                    {prediction.activity}
                  </strong>
                </div>
              </div>

              <div style={styles.recommendation}>
                <div style={styles.recommendationTitle}>
                  💡 Recommendation
                </div>

                <p style={styles.recommendationText}>
                  {prediction.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.info}>
        <span>ℹ️</span>

        <span>
          This is currently a frontend demo. The actual AI
          prediction API can be connected when the backend is
          ready.
        </span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background:
      "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #ecfeff 100%)",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800",
    color: "#14532d",
  },

  subtitle: {
    margin: "7px 0 0",
    fontSize: "15px",
    color: "#64748b",
  },

  badge: {
    padding: "11px 18px",
    borderRadius: "30px",
    background: "#dcfce7",
    color: "#166534",
    fontWeight: "700",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(300px, 1fr) minmax(300px, 1fr)",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 12px 35px rgba(15,23,42,0.08)",
    border: "1px solid #e2e8f0",
  },

  cardTitle: {
    margin: "0 0 20px",
    fontSize: "20px",
    fontWeight: "800",
    color: "#1e293b",
  },

  uploadBox: {
    minHeight: "330px",
    border: "2px dashed #86efac",
    borderRadius: "18px",
    background: "#f0fdf4",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  uploadIcon: {
    fontSize: "54px",
    marginBottom: "10px",
  },

  uploadTitle: {
    margin: "5px 0",
    fontSize: "20px",
    color: "#166534",
  },

  uploadText: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "18px",
  },

  uploadButton: {
    background: "#16a34a",
    color: "#fff",
    padding: "11px 20px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
  },

  imageContainer: {
    width: "100%",
    height: "330px",
    borderRadius: "18px",
    overflow: "hidden",
    background: "#f1f5f9",
  },

  preview: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  imageActions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },

  changeButton: {
    flex: 1,
    textAlign: "center",
    padding: "11px",
    borderRadius: "10px",
    background: "#e0f2fe",
    color: "#0369a1",
    fontWeight: "700",
    cursor: "pointer",
  },

  removeButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontWeight: "700",
    cursor: "pointer",
  },

  predictButton: {
    width: "100%",
    marginTop: "18px",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "800",
  },

  empty: {
    minHeight: "390px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  emptyTitle: {
    margin: 0,
    color: "#334155",
    fontSize: "20px",
  },

  emptyText: {
    color: "#94a3b8",
    lineHeight: "1.7",
    fontSize: "14px",
  },

  resultHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "15px",
    borderRadius: "14px",
    background: "#f0fdf4",
  },

  resultAnimal: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#dcfce7",
    fontSize: "30px",
  },

  resultLabel: {
    fontSize: "12px",
    color: "#64748b",
  },

  resultValue: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#166534",
    marginTop: "3px",
  },

  healthy: {
    marginLeft: "auto",
    padding: "7px 12px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#15803d",
    fontSize: "13px",
    fontWeight: "800",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginTop: "18px",
  },

  stat: {
    padding: "14px",
    background: "#f8fafc",
    borderRadius: "12px",
    textAlign: "center",
  },

  statLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "11px",
    marginBottom: "6px",
  },

  statValue: {
    color: "#0f172a",
    fontSize: "15px",
  },

  recommendation: {
    marginTop: "18px",
    padding: "16px",
    borderRadius: "14px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
  },

  recommendationTitle: {
    fontWeight: "800",
    color: "#92400e",
    fontSize: "14px",
  },

  recommendationText: {
    color: "#78350f",
    fontSize: "13px",
    lineHeight: "1.6",
    marginBottom: 0,
  },

  info: {
    maxWidth: "1200px",
    margin: "22px auto 0",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "#eff6ff",
    color: "#1e40af",
    fontSize: "13px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
};

export default DigitalTwin;