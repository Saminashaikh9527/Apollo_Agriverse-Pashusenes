
// ============================================================
// src/pages/Predictions.jsx
// Apollo AgriVerse - PashuSense
// ML Prediction Dashboard
//
// IMPORTANT:
// - NO Animal ID for ML predictions
// - User selects ML model
// - Backend provides model features
// - User enters 2–3 features
// - Sends only model_name + data
// ============================================================

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getMLModels,
  getMLModelFeatures,
  predictProduction,
  getApiErrorMessage,
} from "../api/backend";

// ============================================================
// MODEL GROUPS
// ============================================================

const MODEL_GROUPS = [
  {
    title: "Production Prediction",
    models: [
      {
        name: "Egg Production",
        keywords: [
          "egg",
          "egg_production",
        ],
      },
      {
        name: "Feed Cost",
        keywords: [
          "feed",
          "feed_cost",
        ],
      },
      {
        name: "Milk Production",
        keywords: [
          "milk",
          "milk_production",
        ],
      },
      {
        name: "Milk Forecast",
        keywords: [
          "milk",
          "forecast",
        ],
      },
    ],
  },

  {
    title: "Health Prediction",
    models: [
      {
        name: "Health Classification",
        keywords: [
          "health",
          "classification",
        ],
      },
      {
        name: "Behaviour Anomaly",
        keywords: [
          "behaviour",
          "behavior",
          "anomaly",
        ],
      },
    ],
  },

  {
    title: "Behaviour / Activity Prediction",
    models: [
      {
        name: "Grazing / Behaviour",
        keywords: [
          "grazing",
          "behaviour",
          "behavior",
        ],
      },
      {
        name: "Katanning Activity / Steps",
        keywords: [
          "katanning",
          "activity",
          "steps",
        ],
      },
      {
        name: "Murdoch Grazing Behaviour",
        keywords: [
          "murdoch",
          "grazing",
          "behaviour",
          "behavior",
        ],
      },
      {
        name: "Muresk Activity / Steps",
        keywords: [
          "muresk",
          "activity",
          "steps",
        ],
      },
      {
        name: "Muresk Dry-Pasture Activity / Steps",
        keywords: [
          "muresk",
          "dry",
          "pasture",
          "activity",
          "steps",
        ],
      },
      {
        name: "Muresk Stubble Activity / Steps",
        keywords: [
          "muresk",
          "stubble",
          "activity",
          "steps",
        ],
      },
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================

function cleanModelName(value) {
  return String(value || "")
    .trim();
}

function getModelDisplayName(model) {
  if (typeof model === "string") {
    return model;
  }

  if (!model || typeof model !== "object") {
    return "";
  }

  return (
    model.display_name ||
    model.name ||
    model.model_name ||
    model.filename ||
    model.file_name ||
    ""
  );
}

function getModelKey(model) {
  if (typeof model === "string") {
    return model;
  }

  if (!model || typeof model !== "object") {
    return "";
  }

  return (
    model.model_name ||
    model.name ||
    model.filename ||
    model.file_name ||
    ""
  );
}

function normalizeModelsResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.models)) {
    return response.models;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

function normalizeFeaturesResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.features)) {
    return response.features;
  }

  if (
    Array.isArray(
      response?.data?.features
    )
  ) {
    return response.data.features;
  }

  return [];
}

function prettifyFeatureName(feature) {
  return String(feature || "")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function isNumericFeature(featureName) {
  const name = String(
    featureName || ""
  ).toLowerCase();

  return (
    name.includes("age") ||
    name.includes("weight") ||
    name.includes("temperature") ||
    name.includes("humidity") ||
    name.includes("feed") ||
    name.includes("intake") ||
    name.includes("milk") ||
    name.includes("egg") ||
    name.includes("step") ||
    name.includes("activity") ||
    name.includes("distance") ||
    name.includes("duration") ||
    name.includes("cost") ||
    name.includes("rain") ||
    name.includes("speed") ||
    name.includes("time") ||
    name.includes("score") ||
    name.includes("yield") ||
    name.includes("production")
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function Predictions() {
  // ----------------------------------------------------------
  // MODEL STATE
  // ----------------------------------------------------------

  const [models, setModels] =
    useState([]);

  const [selectedModel, setSelectedModel] =
    useState("");

  const [loadingModels, setLoadingModels] =
    useState(false);

  // ----------------------------------------------------------
  // FEATURE STATE
  // ----------------------------------------------------------

  const [modelFeatures, setModelFeatures] =
    useState([]);

  const [featureValues, setFeatureValues] =
    useState({});

  const [loadingFeatures, setLoadingFeatures] =
    useState(false);

  // ----------------------------------------------------------
  // PREDICTION STATE
  // ----------------------------------------------------------

  const [prediction, setPrediction] =
    useState(null);

  const [predicting, setPredicting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================================
  // LOAD MODELS
  // ==========================================================

  useEffect(() => {
    loadModels();
  }, []);

  async function loadModels() {
    try {
      setLoadingModels(true);
      setError("");

      const response =
        await getMLModels();

      const loadedModels =
        normalizeModelsResponse(
          response
        );

      setModels(loadedModels);

      if (
        loadedModels.length > 0
      ) {
        const firstModel =
          getModelKey(
            loadedModels[0]
          );

        if (firstModel) {
          setSelectedModel(
            firstModel
          );
        }
      }
    } catch (err) {
      console.error(
        "GET ML MODELS ERROR:",
        err
      );

      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setLoadingModels(false);
    }
  }

  // ==========================================================
  // LOAD MODEL FEATURES
  // ==========================================================

  useEffect(() => {
    if (!selectedModel) {
      setModelFeatures([]);
      setFeatureValues({});
      return;
    }

    loadModelFeatures(
      selectedModel
    );
  }, [selectedModel]);

  async function loadModelFeatures(
    modelName
  ) {
    try {
      setLoadingFeatures(true);
      setError("");
      setSuccess("");
      setPrediction(null);

      const response =
        await getMLModelFeatures(
          modelName
        );

      let features =
        normalizeFeaturesResponse(
          response
        );

      // ------------------------------------------------------
      // NORMALIZE FEATURE NAMES
      // ------------------------------------------------------

      features = features
        .map((feature) => {
          if (
            typeof feature ===
            "string"
          ) {
            return feature;
          }

          if (
            feature &&
            typeof feature ===
              "object"
          ) {
            return (
              feature.name ||
              feature.feature ||
              feature.feature_name ||
              feature.column ||
              ""
            );
          }

          return "";
        })
        .filter(Boolean);

      // ------------------------------------------------------
      // ONLY SHOW MAXIMUM 3 FEATURES
      // ------------------------------------------------------

      features =
        features.slice(0, 3);

      setModelFeatures(
        features
      );

      // ------------------------------------------------------
      // RESET VALUES
      // ------------------------------------------------------

      const initialValues =
        {};

      features.forEach(
        (feature) => {
          initialValues[
            feature
          ] = "";
        }
      );

      setFeatureValues(
        initialValues
      );
    } catch (err) {
      console.error(
        "GET MODEL FEATURES ERROR:",
        err
      );

      setModelFeatures([]);
      setFeatureValues({});

      setError(
        getApiErrorMessage(err)
      );
    } finally {
      setLoadingFeatures(false);
    }
  }

  // ==========================================================
  // FEATURE INPUT CHANGE
  // ==========================================================

  function handleFeatureChange(
    featureName,
    value
  ) {
    setFeatureValues(
      (previous) => ({
        ...previous,
        [featureName]: value,
      })
    );

    setError("");
    setSuccess("");
    setPrediction(null);
  }

  // ==========================================================
  // VALIDATE FEATURES
  // ==========================================================

  const validFeatureCount =
    useMemo(() => {
      return modelFeatures.filter(
        (feature) => {
          const value =
            featureValues[
              feature
            ];

          return (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
          );
        }
      ).length;
    }, [
      modelFeatures,
      featureValues,
    ]);

  // ==========================================================
  // RUN PREDICTION
  // ==========================================================

  async function handlePredict(
    event
  ) {
    event?.preventDefault();

    setError("");
    setSuccess("");
    setPrediction(null);

    // --------------------------------------------------------
    // MODEL CHECK
    // --------------------------------------------------------

    if (!selectedModel) {
      setError(
        "Please select an ML model."
      );

      return;
    }

    // --------------------------------------------------------
    // FEATURE CHECK
    // --------------------------------------------------------

    const enteredFeatures =
      {};

    modelFeatures.forEach(
      (feature) => {
        const rawValue =
          featureValues[
            feature
          ];

        if (
          rawValue !==
            undefined &&
          rawValue !== null &&
          String(rawValue).trim() !==
            ""
        ) {
          const trimmed =
            String(
              rawValue
            ).trim();

          // Convert numeric values
          // into numbers.
          if (
            isNumericFeature(
              feature
            ) &&
            trimmed !== ""
          ) {
            const numericValue =
              Number(trimmed);

            if (
              Number.isFinite(
                numericValue
              )
            ) {
              enteredFeatures[
                feature
              ] = numericValue;
            } else {
              enteredFeatures[
                feature
              ] = trimmed;
            }
          } else {
            enteredFeatures[
              feature
            ] = trimmed;
          }
        }
      }
    );

    const featureCount =
      Object.keys(
        enteredFeatures
      ).length;

    // --------------------------------------------------------
    // REQUIRE 2–3 INPUTS
    // --------------------------------------------------------

    if (
      featureCount < 2
    ) {
      setError(
        "Please enter at least 2 prediction features."
      );

      return;
    }

    if (
      featureCount > 3
    ) {
      setError(
        "Please enter only 2 or 3 prediction features."
      );

      return;
    }

    // --------------------------------------------------------
    // IMPORTANT:
    // REMOVE ANY ANIMAL ID ACCIDENTALLY PRESENT
    // --------------------------------------------------------

    delete enteredFeatures.animal_id;
    delete enteredFeatures.animalId;
    delete enteredFeatures.id;

    // --------------------------------------------------------
    // PREDICT
    // --------------------------------------------------------

    try {
      setPredicting(true);

      console.log(
        "================================="
      );

      console.log(
        "RUNNING ML PREDICTION"
      );

      console.log(
        "MODEL:",
        selectedModel
      );

      console.log(
        "FEATURES:",
        enteredFeatures
      );

      console.log(
        "FEATURE COUNT:",
        Object.keys(
          enteredFeatures
        ).length
      );

      console.log(
        "================================="
      );

      // ------------------------------------------------------
      // IMPORTANT:
      // ONLY TWO ARGUMENTS
      //
      // predictProduction(
      //   modelName,
      //   features
      // )
      //
      // NO ANIMAL ID
      // ------------------------------------------------------

      const result =
        await predictProduction(
          selectedModel,
          enteredFeatures
        );

      console.log(
        "ML PREDICTION RESULT:",
        result
      );

      setPrediction(
        result
      );

      setSuccess(
        "Prediction completed successfully."
      );
    } catch (err) {
      console.error(
        "PREDICTION ERROR:",
        err
      );

      setError(
        err?.message ||
        getApiErrorMessage(err)
      );
    } finally {
      setPredicting(false);
    }
  }

  // ==========================================================
  // DISPLAY MODEL NAME
  // ==========================================================

  const selectedModelObject =
    models.find(
      (model) =>
        getModelKey(model) ===
        selectedModel
    );

  const selectedModelDisplayName =
    getModelDisplayName(
      selectedModelObject
    ) ||
    selectedModel;

  // ==========================================================
  // RESULT HELPERS
  // ==========================================================

  function getPredictionValue() {
    if (
      prediction === null ||
      prediction === undefined
    ) {
      return null;
    }

    if (
      prediction.prediction !==
        undefined &&
      prediction.prediction !== null
    ) {
      return prediction.prediction;
    }

    if (
      prediction.result !==
        undefined &&
      prediction.result !== null
    ) {
      return prediction.result;
    }

    if (
      prediction.value !==
        undefined &&
      prediction.value !== null
    ) {
      return prediction.value;
    }

    return prediction;
  }

  function getConfidence() {
    if (
      prediction?.confidence ===
        undefined ||
      prediction?.confidence ===
        null
    ) {
      return null;
    }

    const value =
      Number(
        prediction.confidence
      );

    if (
      Number.isFinite(value)
    ) {
      return value <= 1
        ? `${(
            value * 100
          ).toFixed(2)}%`
        : `${value.toFixed(2)}%`;
    }

    return String(
      prediction.confidence
    );
  }

  const predictionValue =
    getPredictionValue();

  const confidence =
    getConfidence();

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        width: "100%",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          AI Predictions
        </h1>

        <p
          style={{
            marginTop: "8px",
            marginBottom: 0,
            color: "#666",
          }}
        >
          Generate AI-powered
          production, health,
          behaviour and activity
          predictions for your
          livestock.
        </p>
      </div>

      {/* ================================================== */}
      {/* MODEL GROUPS */}
      {/* ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {MODEL_GROUPS.map(
          (group) => (
            <div
              key={
                group.title
              }
              style={{
                border:
                  "1px solid #e5e5e5",
                borderRadius:
                  "12px",
                padding: "18px",
                background:
                  "#fff",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom:
                    "12px",
                  fontSize:
                    "16px",
                }}
              >
                {group.title}
              </h3>

              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap: "7px",
                }}
              >
                {group.models.map(
                  (item) => (
                    <div
                      key={
                        item.name
                      }
                      style={{
                        color:
                          "#555",
                        fontSize:
                          "14px",
                      }}
                    >
                      •{" "}
                      {item.name}
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* ================================================== */}
      {/* ML ENGINE */}
      {/* ================================================== */}

      <div
        style={{
          marginBottom:
            "24px",
          padding:
            "16px 18px",
          borderRadius:
            "10px",
          background:
            "#f7f8fa",
          border:
            "1px solid #e5e5e5",
        }}
      >
        <strong>
          ML Prediction Engine
        </strong>

        <div
          style={{
            marginTop: "5px",
            color: "#666",
          }}
        >
          {loadingModels
            ? "Loading trained models..."
            : `${models.length || 0} trained models available`}
        </div>
      </div>

      {/* ================================================== */}
      {/* PREDICTION FORM */}
      {/* ================================================== */}

      <form
        onSubmit={
          handlePredict
        }
        style={{
          background:
            "#fff",
          border:
            "1px solid #e2e2e2",
          borderRadius:
            "14px",
          padding:
            "24px",
          marginBottom:
            "24px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom:
              "20px",
            fontSize:
              "20px",
          }}
        >
          Run Prediction
        </h2>

        {/* ================================================= */}
        {/* MODEL SELECT */}
        {/* ================================================= */}

        <div
          style={{
            marginBottom:
              "22px",
          }}
        >
          <label
            style={{
              display:
                "block",
              fontWeight: 600,
              marginBottom:
                "8px",
            }}
          >
            ML Model
          </label>

          <select
            value={
              selectedModel
            }
            onChange={(event) =>
              setSelectedModel(
                event.target
                  .value
              )
            }
            disabled={
              loadingModels
            }
            style={{
              width: "100%",
              padding:
                "12px",
              border:
                "1px solid #ccc",
              borderRadius:
                "8px",
              fontSize:
                "14px",
              background:
                "#fff",
            }}
          >
            <option value="">
              Select ML Model
            </option>

            {models.map(
              (
                model,
                index
              ) => {
                const key =
                  getModelKey(
                    model
                  );

                const display =
                  getModelDisplayName(
                    model
                  ) || key;

                return (
                  <option
                    key={`${key}-${index}`}
                    value={key}
                  >
                    {display}
                  </option>
                );
              }
            )}
          </select>
        </div>

        {/* ================================================= */}
        {/* SELECTED MODEL */}
        {/* ================================================= */}

        {selectedModel && (
          <div
            style={{
              marginBottom:
                "20px",
              padding:
                "14px 16px",
              background:
                "#f7f9fc",
              borderRadius:
                "8px",
              border:
                "1px solid #e4e8ee",
            }}
          >
            <div
              style={{
                fontSize:
                  "12px",
                color:
                  "#777",
                marginBottom:
                  "4px",
              }}
            >
              SELECTED MODEL
            </div>

            <strong>
              {
                selectedModelDisplayName
              }
            </strong>
          </div>
        )}

        {/* ================================================= */}
        {/* FEATURES */}
        {/* ================================================= */}

        {selectedModel && (
          <>
            <div
              style={{
                marginBottom:
                  "14px",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 5px 0",
                  fontSize:
                    "16px",
                }}
              >
                Prediction Features
              </h3>

              <p
                style={{
                  margin: 0,
                  color:
                    "#777",
                  fontSize:
                    "13px",
                }}
              >
                Enter 2–3 input
                features for
                this model.
              </p>
            </div>

            {loadingFeatures ? (
              <div
                style={{
                  padding:
                    "20px 0",
                  color:
                    "#666",
                }}
              >
                Loading model
                features...
              </div>
            ) : modelFeatures.length ===
              0 ? (
              <div
                style={{
                  padding:
                    "14px",
                  borderRadius:
                    "8px",
                  background:
                    "#fff8e6",
                  border:
                    "1px solid #f0d48a",
                  color:
                    "#725b1c",
                  marginBottom:
                    "18px",
                }}
              >
                No features were
                returned for this
                model.
              </div>
            ) : (
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "16px",
                  marginBottom:
                    "20px",
                }}
              >
                {modelFeatures.map(
                  (
                    feature
                  ) => (
                    <div
                      key={
                        feature
                      }
                    >
                      <label
                        style={{
                          display:
                            "block",
                          fontWeight:
                            600,
                          marginBottom:
                            "7px",
                          fontSize:
                            "14px",
                        }}
                      >
                        {prettifyFeatureName(
                          feature
                        )}
                      </label>

                      <input
                        type={
                          isNumericFeature(
                            feature
                          )
                            ? "number"
                            : "text"
                        }
                        step={
                          isNumericFeature(
                            feature
                          )
                            ? "any"
                            : undefined
                        }
                        value={
                          featureValues[
                            feature
                          ] ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          handleFeatureChange(
                            feature,
                            event
                              .target
                              .value
                          )
                        }
                        placeholder={`Enter ${prettifyFeatureName(
                          feature
                        )}`}
                        style={{
                          width:
                            "100%",
                          boxSizing:
                            "border-box",
                          padding:
                            "11px 12px",
                          border:
                            "1px solid #ccc",
                          borderRadius:
                            "8px",
                          fontSize:
                            "14px",
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            )}

            {/* ============================================ */}
            {/* FEATURE COUNT */}
            {/* ============================================ */}

            {modelFeatures.length >
              0 && (
              <div
                style={{
                  marginBottom:
                    "18px",
                  color:
                    validFeatureCount >=
                    2
                      ? "#27744b"
                      : "#777",
                  fontSize:
                    "13px",
                }}
              >
                {validFeatureCount}
                {" "}
                of{" "}
                {modelFeatures.length}
                {" "}
                features entered
              </div>
            )}

            {/* ============================================ */}
            {/* PREDICT BUTTON */}
            {/* ============================================ */}

            <button
              type="submit"
              disabled={
                predicting ||
                loadingFeatures ||
                !selectedModel ||
                validFeatureCount < 2
              }
              style={{
                width: "100%",
                padding:
                  "13px 18px",
                border: "none",
                borderRadius:
                  "8px",
                background:
                  predicting
                    ? "#999"
                    : "#1f6f4a",
                color: "#fff",
                fontSize:
                  "15px",
                fontWeight:
                  600,
                cursor:
                  predicting ||
                  validFeatureCount <
                    2
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {predicting
                ? "Running Prediction..."
                : "Run Prediction"}
            </button>
          </>
        )}
      </form>

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (
        <div
          style={{
            marginBottom:
              "18px",
            padding:
              "13px 16px",
            borderRadius:
              "8px",
            background:
              "#fff0f0",
            border:
              "1px solid #efb5b5",
            color:
              "#a22",
          }}
        >
          {error}
        </div>
      )}

      {/* ================================================== */}
      {/* SUCCESS */}
      {/* ================================================== */}

      {success && (
        <div
          style={{
            marginBottom:
              "18px",
            padding:
              "13px 16px",
            borderRadius:
              "8px",
            background:
              "#eefaf3",
            border:
              "1px solid #b9dfc8",
            color:
              "#236b42",
          }}
        >
          {success}
        </div>
      )}

      {/* ================================================== */}
      {/* RESULT */}
      {/* ================================================== */}

      {prediction && (
        <div
          style={{
            background:
              "#fff",
            border:
              "1px solid #e2e2e2",
            borderRadius:
              "14px",
            padding:
              "24px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom:
                "22px",
              fontSize:
                "20px",
            }}
          >
            Prediction Result
          </h2>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
            }}
          >
            {/* ========================================== */}
            {/* PREDICTION TYPE */}
            {/* ========================================== */}

            <div
              style={{
                padding:
                  "16px",
                background:
                  "#f7f8fa",
                borderRadius:
                  "9px",
              }}
            >
              <div
                style={{
                  fontSize:
                    "11px",
                  color:
                    "#777",
                  marginBottom:
                    "6px",
                }}
              >
                MODEL
              </div>

              <strong>
                {
                  selectedModelDisplayName
                }
              </strong>
            </div>

            {/* ========================================== */}
            {/* PREDICTION */}
            {/* ========================================== */}

            <div
              style={{
                padding:
                  "16px",
                background:
                  "#f7f8fa",
                borderRadius:
                  "9px",
              }}
            >
              <div
                style={{
                  fontSize:
                    "11px",
                  color:
                    "#777",
                  marginBottom:
                    "6px",
                }}
              >
                PREDICTION
              </div>

              <strong
                style={{
                  fontSize:
                    "20px",
                }}
              >
                {typeof predictionValue ===
                "object"
                  ? JSON.stringify(
                      predictionValue
                    )
                  : String(
                      predictionValue
                    )}
              </strong>
            </div>

            {/* ========================================== */}
            {/* CONFIDENCE */}
            {/* ========================================== */}

            {confidence && (
              <div
                style={{
                  padding:
                    "16px",
                  background:
                    "#f7f8fa",
                  borderRadius:
                    "9px",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "11px",
                    color:
                      "#777",
                    marginBottom:
                      "6px",
                  }}
                >
                  CONFIDENCE
                </div>

                <strong
                  style={{
                    fontSize:
                      "20px",
                  }}
                >
                  {confidence}
                </strong>
              </div>
            )}

            {/* ========================================== */}
            {/* STATUS */}
            {/* ========================================== */}

            <div
              style={{
                padding:
                  "16px",
                background:
                  "#f7f8fa",
                borderRadius:
                  "9px",
              }}
            >
              <div
                style={{
                  fontSize:
                    "11px",
                  color:
                    "#777",
                  marginBottom:
                    "6px",
                }}
              >
                STATUS
              </div>

              <strong>
                {prediction.status ||
                  "success"}
              </strong>
            </div>
          </div>

          {/* ============================================ */}
          {/* FEATURES USED */}
          {/* ============================================ */}

          {prediction.features_used &&
            Array.isArray(
              prediction.features_used
            ) &&
            prediction
              .features_used
              .length > 0 && (
              <div
                style={{
                  marginTop:
                    "20px",
                  padding:
                    "16px",
                  background:
                    "#f7f8fa",
                  borderRadius:
                    "9px",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "11px",
                    color:
                      "#777",
                    marginBottom:
                      "8px",
                  }}
                >
                  FEATURES USED
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    flexWrap:
                      "wrap",
                    gap: "8px",
                  }}
                >
                  {prediction.features_used.map(
                    (
                      feature,
                      index
                    ) => (
                      <span
                        key={`${feature}-${index}`}
                        style={{
                          padding:
                            "6px 10px",
                          borderRadius:
                            "20px",
                          background:
                            "#e8f3ed",
                          color:
                            "#276b47",
                          fontSize:
                            "12px",
                        }}
                      >
                        {
                          prettifyFeatureName(
                            feature
                          )
                        }
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* ============================================ */}
          {/* INPUT VALUES */}
          {/* ============================================ */}

          <div
            style={{
              marginTop:
                "20px",
              padding:
                "16px",
              background:
                "#f7f8fa",
              borderRadius:
                "9px",
            }}
          >
            <div
              style={{
                fontSize:
                  "11px",
                color:
                  "#777",
                marginBottom:
                  "10px",
              }}
            >
              INPUT FEATURES
            </div>

            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "7px",
              }}
            >
              {Object.entries(
                featureValues
              )
                .filter(
                  ([
                    ,
                    value,
                  ]) =>
                    value !==
                      undefined &&
                    value !==
                      null &&
                    String(
                      value
                    ).trim() !== ""
                )
                .map(
                  ([
                    feature,
                    value,
                  ]) => (
                    <div
                      key={
                        feature
                      }
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        gap: "15px",
                        fontSize:
                          "13px",
                      }}
                    >
                      <span>
                        {prettifyFeatureName(
                          feature
                        )}
                      </span>

                      <strong>
                        {String(
                          value
                        )}
                      </strong>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

