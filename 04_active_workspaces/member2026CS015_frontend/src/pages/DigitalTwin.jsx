// ============================================================
// src/pages/DigitalTwin.jsx
// Apollo Agriverse - PashuSense
// Digital Twin + AI Livestock Analysis + Three.js
// ============================================================

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import * as THREE from "three";

import {
  getAnimals,
  uploadAIImage,
} from "../api/backend";

// ============================================================
// GENERAL HELPERS
// ============================================================

function formatSpecies(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const text = String(value)
    .trim()
    .replace(/[_-]+/g, " ");

  if (!text) {
    return "";
  }

  return text
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
      );
    })
    .join(" ");
}

function getAnimalId(animal) {
  return (
    animal?.animal_id ??
    animal?.id ??
    animal?.animalId ??
    ""
  );
}

function getAnimalTag(animal) {
  return (
    animal?.tag_number ??
    animal?.tag ??
    animal?.animal_tag ??
    animal?.tag_id ??
    ""
  );
}

function getAnimalType(animal) {
  if (!animal) {
    return "Animal";
  }

  return formatSpecies(
    animal?.animal_type ||
      animal?.species ||
      animal?.animal_species ||
      animal?.type ||
      "Animal"
  );
}

function getAnimalWeight(animal) {
  return (
    animal?.weight ??
    animal?.body_weight ??
    animal?.current_weight ??
    animal?.weight_kg ??
    null
  );
}

// ============================================================
// AI RESPONSE HELPERS
// ============================================================

function unwrapAIResult(result) {
  if (!result) return {};
  if (result?.data && typeof result.data === "object") {
    // Axios-style response: response.data
    if (result.data?.analysis || result.data?.result || result.data?.yolo) {
      return result.data;
    }
  }
  return result;
}

function getAnalysis(result) {
  const root = unwrapAIResult(result);
  return (
    root?.analysis ||
    root?.result?.analysis ||
    root?.data?.analysis ||
    (root?.yolo || root?.cnn || root?.xgboost ? root : {}) ||
    {}
  );
}

function getYOLO(result) {
  const root = unwrapAIResult(result);
  const analysis = getAnalysis(root);

  return (
    analysis?.yolo ||
    analysis?.yolo_result ||
    analysis?.yolo_detection ||
    root?.yolo ||
    root?.yolo_result ||
    root?.yolo_detection ||
    {}
  );
}

function getCNN(result) {
  const root = unwrapAIResult(result);
  const analysis = getAnalysis(root);

  return (
    analysis?.cnn ||
    analysis?.cnn_result ||
    analysis?.cnn_classification ||
    root?.cnn ||
    root?.cnn_result ||
    root?.cnn_classification ||
    {}
  );
}

// ------------------------------------------------------------
// YOLO DETECTIONS
// ------------------------------------------------------------

function getYOLODetections(result) {
  const root = unwrapAIResult(result);
  const yolo = getYOLO(root);
  const analysis = getAnalysis(root);

  const possibleArrays = [
    yolo?.detections,
    yolo?.results,
    yolo?.predictions,
    yolo?.objects,
    yolo?.animals,
    analysis?.detections,
    analysis?.objects,
    root?.detections,
    root?.objects,
  ];

  for (const value of possibleArrays) {
    if (Array.isArray(value)) return value;
  }

  return [];
}

// ------------------------------------------------------------
// YOLO SPECIES
// ------------------------------------------------------------

function getDetectedSpecies(result) {
  const root = unwrapAIResult(result);
  const analysis = getAnalysis(root);
  const yolo = getYOLO(root);
  const detections = getYOLODetections(root);

  const directCandidates = [
    // Actual/common backend names
    yolo?.detected_species,
    yolo?.detectedSpecies,
    yolo?.species,
    yolo?.species_name,
    yolo?.speciesName,
    yolo?.animal_species,
    yolo?.animal_type,
    yolo?.class_name,
    yolo?.className,
    yolo?.label,

    analysis?.detected_species,
    analysis?.detectedSpecies,
    analysis?.species,
    analysis?.species_name,
    analysis?.speciesName,
    analysis?.animal_species,
    analysis?.animal_type,

    root?.detected_species,
    root?.detectedSpecies,
    root?.species,
    root?.species_name,
    root?.speciesName,
    root?.animal_species,
    root?.animal_type,
  ];

  for (const candidate of directCandidates) {
    if (
      candidate !== null &&
      candidate !== undefined &&
      typeof candidate !== "object" &&
      String(candidate).trim() !== ""
    ) {
      return formatSpecies(candidate);
    }
  }

  if (detections.length > 0) {
    const speciesList = detections
      .map((item) => {
        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          return item;
        }

        if (!item || typeof item !== "object") return "";

        return (
          item?.species ||
          item?.species_name ||
          item?.speciesName ||
          item?.animal_type ||
          item?.animal_species ||
          item?.class_name ||
          item?.className ||
          item?.class ||
          item?.label ||
          item?.name ||
          item?.category ||
          item?.object_name ||
          item?.objectName ||
          item?.detected_species ||
          ""
        );
      })
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
      )
      .map(formatSpecies)
      .filter(Boolean);

    const uniqueSpecies = [...new Set(speciesList)];

    if (uniqueSpecies.length > 0) {
      return uniqueSpecies.join(", ");
    }
  }

  return null;
}

// ------------------------------------------------------------
// YOLO COUNT
// ------------------------------------------------------------

function getDetectionCount(result) {
  const root = unwrapAIResult(result);
  const yolo = getYOLO(root);
  const analysis = getAnalysis(root);
  const detections = getYOLODetections(root);

  const countCandidates = [
    yolo?.count,
    yolo?.animal_count,
    yolo?.animals_detected,
    yolo?.total_animals,
    yolo?.totalAnimals,
    yolo?.detection_count,
    yolo?.detectionCount,

    analysis?.animal_count,
    analysis?.animals_detected,
    analysis?.total_animals,
    analysis?.totalAnimals,

    root?.animal_count,
    root?.animals_detected,
    root?.total_animals,
    root?.totalAnimals,
  ];

  for (const candidate of countCandidates) {
    if (
      candidate !== null &&
      candidate !== undefined &&
      candidate !== "" &&
      Number.isFinite(Number(candidate))
    ) {
      return Math.max(0, Number(candidate));
    }
  }

  return detections.length;
}

// ------------------------------------------------------------
// YOLO CONFIDENCE
// ------------------------------------------------------------

function getDetectionConfidence(result) {
  const root = unwrapAIResult(result);
  const yolo = getYOLO(root);
  const analysis = getAnalysis(root);
  const detections = getYOLODetections(root);

  const directCandidates = [
    yolo?.confidence,
    yolo?.best_confidence,
    yolo?.bestConfidence,
    yolo?.score,
    yolo?.probability,
    yolo?.conf,

    analysis?.yolo_confidence,
    analysis?.yoloConfidence,
    root?.yolo_confidence,
    root?.yoloConfidence,
  ];

  for (const candidate of directCandidates) {
    if (
      candidate !== null &&
      candidate !== undefined &&
      typeof candidate === "object"
    ) {
      const nested = [
        candidate?.best,
        candidate?.value,
        candidate?.score,
        candidate?.confidence,
        candidate?.probability,
      ];

      for (const value of nested) {
        if (Number.isFinite(Number(value))) {
          return Number(value);
        }
      }
    }

    if (
      candidate !== null &&
      candidate !== undefined &&
      Number.isFinite(Number(candidate))
    ) {
      return Number(candidate);
    }
  }

  if (detections.length > 0) {
    const values = detections
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        return (
          item?.confidence ??
          item?.score ??
          item?.probability ??
          item?.conf
        );
      })
      .map(Number)
      .filter(Number.isFinite);

    if (values.length > 0) return Math.max(...values);
  }

  return null;
}

// ============================================================
// CNN HELPERS
// ============================================================

function getCNNStatus(result) {
  const root = unwrapAIResult(result);
  const cnn = getCNN(root);

  return (
    cnn?.status ||
    root?.cnn_status ||
    root?.cnnStatus ||
    null
  );
}

function getCNNClassification(result) {
  const root = unwrapAIResult(result);
  const cnn = getCNN(root);

  const candidates = [
    cnn?.classification,
    cnn?.prediction,
    cnn?.predicted_class,
    cnn?.predictedClass,
    cnn?.result,
    cnn?.class_name,
    cnn?.className,
    cnn?.class,
    cnn?.label,
    cnn?.disease,
    cnn?.condition,
  ];

  for (const value of candidates) {
    if (
      value !== null &&
      value !== undefined &&
      typeof value !== "object" &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return null;
}

function getCNNConfidence(result) {
  const root = unwrapAIResult(result);
  const cnn = getCNN(root);

  const candidates = [
    cnn?.confidence,
    cnn?.probability,
    cnn?.score,
    cnn?.prediction_confidence,
    cnn?.predictionConfidence,
    cnn?.classification_confidence,
    cnn?.classificationConfidence,
  ];

  for (const value of candidates) {
    if (
      value !== null &&
      value !== undefined &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return null;
}

function getTopCNNPredictions(result) {
  const root = unwrapAIResult(result);
  const cnn = getCNN(root);

  const predictions =
    cnn?.top_predictions ||
    cnn?.topPredictions ||
    cnn?.predictions ||
    cnn?.top_classes ||
    cnn?.topClasses ||
    [];

  return Array.isArray(predictions) ? predictions : [];
}

// ------------------------------------------------------------
// SAFE CNN CLASSIFICATION
// A low-confidence CNN result must NOT be displayed as a
// confirmed disease/health diagnosis.
// ------------------------------------------------------------

function getSafeCNNClassification(result) {
  const classification = getCNNClassification(result);
  const confidence = getCNNConfidence(result);
  const status = String(getCNNStatus(result) || "").toLowerCase();

  if (!classification) return null;

  const percentage =
    confidence === null
      ? null
      : Math.abs(Number(confidence)) <= 1
        ? Number(confidence) * 100
        : Number(confidence);

  if (
    status.includes("low") ||
    (percentage !== null && percentage < 60)
  ) {
    return null;
  }

  return classification;
}

// ============================================================
// HEALTH
// IMPORTANT: Do not use a low-confidence CNN class as health.
// Only explicit backend health data or a sufficiently confident
// CNN classification is displayed.
// ============================================================

function getHealth(result) {
  const root = unwrapAIResult(result);
  const analysis = getAnalysis(root);

  const explicitHealth =
    analysis?.health ||
    root?.health;

  if (
    typeof explicitHealth === "string" &&
    explicitHealth.trim()
  ) {
    return explicitHealth;
  }

  if (
    explicitHealth &&
    typeof explicitHealth === "object"
  ) {
    return (
      explicitHealth?.prediction ??
      explicitHealth?.classification ??
      explicitHealth?.result ??
      explicitHealth?.condition ??
      explicitHealth?.status ??
      "Not available"
    );
  }

  const safeCNNClassification =
    getSafeCNNClassification(root);

  return safeCNNClassification || "Not available";
}

// ============================================================
// BEHAVIOUR
// ============================================================

function getBehaviour(result) {
  const root = unwrapAIResult(result);
  const analysis = getAnalysis(root);

  const value =
    analysis?.behaviour ??
    analysis?.behavior ??
    analysis?.behaviour_result ??
    analysis?.behavior_result ??
    root?.behaviour ??
    root?.behavior ??
    null;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not available";
  }

  if (typeof value === "object") {
    return (
      value?.prediction ??
      value?.classification ??
      value?.result ??
      value?.behaviour ??
      value?.behavior ??
      value?.status ??
      "Not available"
    );
  }

  return String(value);
}

// ============================================================
// ACTIVITY
// ============================================================

function getActivity(result) {
  const root = unwrapAIResult(result);
  const analysis = getAnalysis(root);

  const value =
    analysis?.activity ??
    analysis?.movement ??
    analysis?.activity_result ??
    root?.activity ??
    root?.movement ??
    null;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not available";
  }

  if (typeof value === "object") {
    return (
      value?.prediction ??
      value?.result ??
      value?.activity ??
      value?.movement ??
      value?.status ??
      "Not available"
    );
  }

  return String(value);
}

// ============================================================
// XGBOOST
// IMPORTANT:
// The AI image-upload response can contain:
//   xgboost: { status: "available", models_loaded: 12 }
// That is MODEL AVAILABILITY, not a prediction.
//
// Only explicit XGBoost prediction fields are accepted.
// Generic result.prediction is deliberately ignored.
// ============================================================

function getActualXGBoostPrediction(result) {
  const root = unwrapAIResult(result);
  const analysis = getAnalysis(root);

  const explicitCandidates = [
    analysis?.xgboost_prediction,
    analysis?.xgboostPrediction,
    analysis?.xgboost_result,
    analysis?.xgboostResult,

    root?.xgboost_prediction,
    root?.xgboostPrediction,
    root?.xgboost_prediction_result,
    root?.xgboostPredictionResult,
  ];

  for (const value of explicitCandidates) {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      typeof value !== "object"
    ) {
      return value;
    }

    if (value && typeof value === "object") {
      const prediction =
        value?.prediction ??
        value?.predicted_value ??
        value?.predictedValue ??
        value?.prediction_value ??
        value?.predictionValue;

      if (
        prediction !== null &&
        prediction !== undefined &&
        prediction !== ""
      ) {
        return prediction;
      }
    }
  }

  // Some backends may nest the actual prediction under a
  // dedicated xgboost object. Capability-only objects are ignored.
  const xgbObjects = [
    analysis?.xgboost_prediction_result,
    root?.xgboost_prediction_result,
  ];

  for (const object of xgbObjects) {
    if (!object || typeof object !== "object") continue;

    const prediction =
      object?.prediction ??
      object?.predicted_value ??
      object?.predictedValue ??
      object?.result;

    if (
      prediction !== null &&
      prediction !== undefined &&
      prediction !== ""
    ) {
      return prediction;
    }
  }

  return null;
}

function getXGBoostModelAvailability(result) {
  const root = unwrapAIResult(result);
  const analysis = getAnalysis(root);

  const xgboost =
    analysis?.xgboost ||
    root?.xgboost ||
    null;

  if (!xgboost) return null;

  if (
    typeof xgboost === "number" ||
    typeof xgboost === "string"
  ) {
    return xgboost;
  }

  if (typeof xgboost !== "object") return null;

  return (
    xgboost?.models_loaded ??
    xgboost?.modelsLoaded ??
    xgboost?.available_models ??
    xgboost?.availableModels ??
    null
  );
}

// ============================================================
// CONFIDENCE FORMAT
// ============================================================

function formatConfidence(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(Number(value))
  ) {
    return "—";
  }

  const number = Number(value);

  const percentage =
    Math.abs(number) <= 1
      ? number * 100
      : number;

  return `${percentage.toFixed(1)}%`;
}

// ============================================================
// STATUS HELPERS
// ============================================================

function normalizeStatus(value) {
  if (!value) return "";

  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function getCNNDisplayStatus(result) {
  const status = String(getCNNStatus(result) || "").toLowerCase();
  const confidence = getCNNConfidence(result);

  if (
    status.includes("low") ||
    (
      confidence !== null &&
      (
        Math.abs(Number(confidence)) <= 1
          ? Number(confidence) * 100
          : Number(confidence)
      ) < 60
    )
  ) {
    return "Low Confidence";
  }

  if (status) return normalizeStatus(status);

  return "Not available";
}

function getXGBoostDisplayStatus(result) {
  const prediction = getActualXGBoostPrediction(result);
  return prediction === null || prediction === undefined
    ? "Ready / Not run"
    : "Prediction available";
}


// ============================================================
// STRUCTURED ML / XGBOOST CONNECTION
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

const STRUCTURED_MODELS = [
  "health",
  "egg",
  "feed",
  "milk",
  "behaviour",
  "anomaly",
  "milk_forecast",
  "katanning",
  "murdoch",
  "muresk",
  "muresk_dry",
  "muresk_stubble",
];

function getAuthToken() {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

async function mlRequest(path, options = {}) {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  const text = await response.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `ML request failed (${response.status})`;

    const error = new Error(String(message));
    error.status = response.status;
    error.isUnauthorized = response.status === 401;
    throw error;
  }

  return data;
}

function normalizeFeatureNames(response) {
  const values =
    response?.features ||
    response?.feature_names ||
    response?.featureNames ||
    response?.data?.features ||
    response?.data?.feature_names ||
    response?.data ||
    [];

  if (!Array.isArray(values)) {
    return [];
  }

  return [
    ...new Set(
      values
        .map((item) => {
          if (typeof item === "string") return item;

          if (item && typeof item === "object") {
            return (
              item?.name ||
              item?.feature ||
              item?.feature_name ||
              item?.key ||
              item?.column ||
              ""
            );
          }

          return "";
        })
        .map((item) => String(item).trim())
        .filter(Boolean)
    ),
  ];
}

function getNumericAnimalValue(animal, keys, fallback = null) {
  for (const key of keys) {
    const value = animal?.[key];

    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return fallback;
}

function buildStructuredData(
  animal,
  modelName,
  featureNames = []
) {
  const now = new Date();

  const animalId = Number(getAnimalId(animal));

  // These are real animal-record values where available.
  // Missing model-specific sensor fields are intentionally omitted;
  // the backend ML service handles its own documented defaults.
  const data = {
    animal_id: animalId,
    id: animalId,
    weight: getNumericAnimalValue(
      animal,
      ["weight", "body_weight", "current_weight", "weight_kg"],
      0
    ),
  };

  const species = getAnimalType(animal);
  if (species) {
    data.species = species;
    data.animal_type = species;
  }

  // Behaviour model's seven known input features.
  if (modelName === "behaviour") {
    data.mi = getNumericAnimalValue(
      animal,
      ["mi", "movement_index", "movement_intensity"],
      1
    );

    data.area = getNumericAnimalValue(
      animal,
      ["area", "grazing_area", "farm_area"],
      100
    );

    data.year = now.getFullYear();
    data.month = now.getMonth() + 1;
    data.day = now.getDate();
    data.hour = now.getHours();
    data.minute = now.getMinutes();
  }

  // If the backend exposes feature names, copy only known animal values
  // into those exact keys. This prevents [object Object] and bad payloads.
  for (const feature of featureNames) {
    if (
      data[feature] !== undefined ||
      !animal
    ) {
      continue;
    }

    const value =
      animal?.[feature] ??
      animal?.[feature.replace(/_([a-z])/g, (_, c) =>
        c.toUpperCase()
      )];

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      data[feature] = value;
    }
  }

  return data;
}

function extractMLPrediction(response) {
  if (!response) return null;

  const candidates = [
    response?.prediction,
    response?.predicted_value,
    response?.predictedValue,
    response?.result?.prediction,
    response?.result?.predicted_value,
    response?.data?.prediction,
    response?.data?.predicted_value,
  ];

  for (const value of candidates) {
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      typeof value !== "object"
    ) {
      return value;
    }
  }

  return null;
}

function getHealthModelLabel(prediction, species) {
  if (
    prediction === null ||
    prediction === undefined ||
    prediction === ""
  ) {
    return null;
  }

  const numeric = Number(prediction);

  if (
    Number.isFinite(numeric) &&
    String(species).toLowerCase().includes("cow")
  ) {
    const cowClasses = {
      0: "Anthrax",
      1: "Blackleg",
      2: "Foot and Mouth Disease",
      3: "Lumpy Skin Disease",
      4: "Pneumonia",
    };

    return (
      cowClasses[Math.round(numeric)] ??
      `Health class ${numeric}`
    );
  }

  return String(prediction);
}

function formatMLPrediction(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not returned";
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? String(value)
      : value.toFixed(4);
  }

  return String(value);
}

// ============================================================
// THREE.JS DIGITAL TWIN
// ============================================================

function DigitalTwin3D({
  species,
  mode,
  animalId,
}) {
  const mountRef = useRef(null);

  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  const animationRef = useRef(null);

  const raycasterRef =
    useRef(new THREE.Raycaster());

  const mouseRef =
    useRef(new THREE.Vector2());

  const targetRef = useRef(
    new THREE.Vector3(0, 0, 5)
  );

  const animalsRef = useRef([]);

  const [canvasReady, setCanvasReady] =
    useState(false);

  // ----------------------------------------------------------
  // MATERIALS
  // ----------------------------------------------------------

  function createMaterials() {
    return {
      wool: new THREE.MeshStandardMaterial({
        color: 0xf3f3ee,
        roughness: 0.95,
      }),

      woolDark:
        new THREE.MeshStandardMaterial({
          color: 0xd9d9d3,
          roughness: 1,
        }),

      face:
        new THREE.MeshStandardMaterial({
          color: 0x7b5b4a,
          roughness: 0.8,
        }),

      faceDark:
        new THREE.MeshStandardMaterial({
          color: 0x4b342a,
          roughness: 0.85,
        }),

      black:
        new THREE.MeshStandardMaterial({
          color: 0x111111,
          roughness: 0.5,
        }),

      brown:
        new THREE.MeshStandardMaterial({
          color: 0x8a5a35,
          roughness: 0.8,
        }),

      cowWhite:
        new THREE.MeshStandardMaterial({
          color: 0xf4f4f0,
          roughness: 0.9,
        }),

      cowBlack:
        new THREE.MeshStandardMaterial({
          color: 0x222222,
          roughness: 0.85,
        }),

      pink:
        new THREE.MeshStandardMaterial({
          color: 0xd58d8d,
          roughness: 0.8,
        }),

      chicken:
        new THREE.MeshStandardMaterial({
          color: 0xe8e0c7,
          roughness: 0.9,
        }),

      red:
        new THREE.MeshStandardMaterial({
          color: 0xc73535,
          roughness: 0.7,
        }),

      orange:
        new THREE.MeshStandardMaterial({
          color: 0xe39b35,
          roughness: 0.75,
        }),

      ground:
        new THREE.MeshStandardMaterial({
          color: 0x31433c,
          roughness: 1,
        }),

      fence:
        new THREE.MeshStandardMaterial({
          color: 0x71806f,
          roughness: 0.9,
        }),

      wood:
        new THREE.MeshStandardMaterial({
          color: 0x604b3b,
          roughness: 0.9,
        }),

      metal:
        new THREE.MeshStandardMaterial({
          color: 0x667085,
          metalness: 0.5,
          roughness: 0.7,
        }),
    };
  }

  // ----------------------------------------------------------
  // WOOL PUFF
  // ----------------------------------------------------------

  function addWoolPuff(
    parent,
    materials,
    x,
    y,
    z,
    scale = 1
  ) {
    const puff =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.23 * scale,
          10,
          8
        ),
        materials.wool
      );

    puff.position.set(
      x,
      y,
      z
    );

    puff.scale.set(
      1,
      0.85,
      1.15
    );

    puff.castShadow = true;

    parent.add(puff);

    return puff;
  }

  // ----------------------------------------------------------
  // SHEEP / RUMINANT
  // ----------------------------------------------------------

  function createRuminant(
    id,
    materials
  ) {
    const group =
      new THREE.Group();

    group.userData.id = id;
    group.userData.type =
      "ruminant";

    group.userData.phase =
      Math.random() *
      Math.PI *
      2;

    // BODY
    const bodyGroup =
      new THREE.Group();

    const body =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.95,
          20,
          16
        ),
        materials.wool
      );

    body.scale.set(
      1.05,
      0.85,
      1.45
    );

    body.castShadow = true;

    bodyGroup.add(body);

    addWoolPuff(
      bodyGroup,
      materials,
      0.55,
      0.35,
      0.55,
      1.1
    );

    addWoolPuff(
      bodyGroup,
      materials,
      -0.55,
      0.35,
      0.45,
      1.05
    );

    addWoolPuff(
      bodyGroup,
      materials,
      0.55,
      0.2,
      -0.35,
      1.1
    );

    addWoolPuff(
      bodyGroup,
      materials,
      -0.5,
      0.2,
      -0.45,
      1.05
    );

    addWoolPuff(
      bodyGroup,
      materials,
      0,
      0.65,
      0,
      1.15
    );

    bodyGroup.position.y =
      1.35;

    group.add(bodyGroup);

    // NECK
    const neck =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.38,
          16,
          12
        ),
        materials.wool
      );

    neck.scale.set(
      0.9,
      1.35,
      0.85
    );

    neck.position.set(
      0,
      1.45,
      0.85
    );

    neck.castShadow = true;

    group.add(neck);

    // HEAD
    const headGroup =
      new THREE.Group();

    headGroup.position.set(
      0,
      1.85,
      1.15
    );

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.38,
          18,
          14
        ),
        materials.face
      );

    head.scale.set(
      0.8,
      1,
      1.15
    );

    head.castShadow = true;

    headGroup.add(head);

    // WOOL CAP
    const cap =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.39,
          16,
          12
        ),
        materials.wool
      );

    cap.scale.set(
      1,
      0.5,
      0.95
    );

    cap.position.set(
      0,
      0.25,
      -0.05
    );

    headGroup.add(cap);

    // EARS
    const earGeo =
      new THREE.SphereGeometry(
        0.16,
        12,
        8
      );

    const earL =
      new THREE.Mesh(
        earGeo,
        materials.faceDark
      );

    earL.scale.set(
      1.3,
      0.45,
      0.7
    );

    earL.position.set(
      0.3,
      0.1,
      0
    );

    earL.rotation.z =
      -Math.PI / 5;

    headGroup.add(earL);

    const earR =
      new THREE.Mesh(
        earGeo,
        materials.faceDark
      );

    earR.scale.set(
      1.3,
      0.45,
      0.7
    );

    earR.position.set(
      -0.3,
      0.1,
      0
    );

    earR.rotation.z =
      Math.PI / 5;

    headGroup.add(earR);

    // EYES
    const eyeGeo =
      new THREE.SphereGeometry(
        0.045,
        8,
        8
      );

    const eyeL =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeL.position.set(
      0.22,
      0.08,
      0.34
    );

    headGroup.add(eyeL);

    const eyeR =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeR.position.set(
      -0.22,
      0.08,
      0.34
    );

    headGroup.add(eyeR);

    group.add(headGroup);

    // LEGS
    const legGeo =
      new THREE.CylinderGeometry(
        0.09,
        0.11,
        1.05,
        8
      );

    const legs = [];

    const legPositions = [
      [-0.48, 0.55, 0.65],
      [0.48, 0.55, 0.65],
      [-0.48, 0.55, -0.65],
      [0.48, 0.55, -0.65],
    ];

    legPositions.forEach(
      ([x, y, z]) => {
        const leg =
          new THREE.Mesh(
            legGeo,
            materials.faceDark
          );

        leg.position.set(
          x,
          y,
          z
        );

        leg.castShadow = true;

        group.add(leg);

        legs.push(leg);
      }
    );

    // TAIL
    const tail =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.045,
          0.07,
          0.55,
          8
        ),
        materials.woolDark
      );

    tail.position.set(
      0,
      1.45,
      -1.35
    );

    tail.rotation.x =
      Math.PI / 2;

    group.add(tail);

    group.userData.legs =
      legs;

    group.userData.head =
      headGroup;

    group.userData.tail =
      tail;

    return group;
  }

  // ----------------------------------------------------------
  // DAIRY COW
  // ----------------------------------------------------------

  function createCow(
    id,
    materials
  ) {
    const group =
      new THREE.Group();

    group.userData.id = id;
    group.userData.type =
      "cow";

    group.userData.phase =
      Math.random() *
      Math.PI *
      2;

    // BODY
    const body =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          1,
          20,
          16
        ),
        materials.cowWhite
      );

    body.scale.set(
      1.35,
      0.85,
      1.8
    );

    body.position.y =
      1.25;

    body.castShadow = true;

    group.add(body);

    // BLACK PATCHES
    const patch1 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.35,
          12,
          10
        ),
        materials.cowBlack
      );

    patch1.scale.set(
      1.2,
      0.5,
      0.8
    );

    patch1.position.set(
      0.65,
      1.55,
      0.4
    );

    group.add(patch1);

    const patch2 =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.3,
          12,
          10
        ),
        materials.cowBlack
      );

    patch2.scale.set(
      1,
      0.5,
      0.8
    );

    patch2.position.set(
      -0.75,
      1.3,
      -0.35
    );

    group.add(patch2);

    // NECK
    const neck =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.38,
          0.5,
          1.15,
          12
        ),
        materials.cowWhite
      );

    neck.position.set(
      0,
      1.65,
      1.3
    );

    group.add(neck);

    // HEAD
    const head =
      new THREE.Group();

    head.position.set(
      0,
      1.95,
      1.65
    );

    const headMesh =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.48,
          16,
          12
        ),
        materials.cowWhite
      );

    headMesh.scale.set(
      0.9,
      1,
      1.2
    );

    head.add(headMesh);

    // MUZZLE
    const muzzle =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.27,
          12,
          8
        ),
        materials.pink
      );

    muzzle.scale.set(
      1,
      0.65,
      0.85
    );

    muzzle.position.set(
      0,
      -0.05,
      0.45
    );

    head.add(muzzle);

    // HORNS
    const hornGeo =
      new THREE.ConeGeometry(
        0.07,
        0.42,
        8
      );

    const hornL =
      new THREE.Mesh(
        hornGeo,
        materials.brown
      );

    hornL.position.set(
      0.28,
      0.38,
      0
    );

    hornL.rotation.z =
      -0.45;

    head.add(hornL);

    const hornR =
      new THREE.Mesh(
        hornGeo,
        materials.brown
      );

    hornR.position.set(
      -0.28,
      0.38,
      0
    );

    hornR.rotation.z =
      0.45;

    head.add(hornR);

    // EARS
    const earGeo =
      new THREE.SphereGeometry(
        0.15,
        10,
        8
      );

    const earL =
      new THREE.Mesh(
        earGeo,
        materials.cowWhite
      );

    earL.scale.set(
      1.5,
      0.5,
      0.8
    );

    earL.position.set(
      0.48,
      0.2,
      0
    );

    head.add(earL);

    const earR =
      new THREE.Mesh(
        earGeo,
        materials.cowWhite
      );

    earR.scale.set(
      1.5,
      0.5,
      0.8
    );

    earR.position.set(
      -0.48,
      0.2,
      0
    );

    head.add(earR);

    // EYES
    const eyeGeo =
      new THREE.SphereGeometry(
        0.045,
        8,
        8
      );

    const eyeL =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeL.position.set(
      0.24,
      0.12,
      0.38
    );

    head.add(eyeL);

    const eyeR =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeR.position.set(
      -0.24,
      0.12,
      0.38
    );

    head.add(eyeR);

    group.add(head);

    // LEGS
    const legGeo =
      new THREE.CylinderGeometry(
        0.11,
        0.14,
        1.1,
        8
      );

    const legs = [];

    [
      [-0.72, 0.55, 0.85],
      [0.72, 0.55, 0.85],
      [-0.72, 0.55, -0.85],
      [0.72, 0.55, -0.85],
    ].forEach(
      ([x, y, z]) => {
        const leg =
          new THREE.Mesh(
            legGeo,
            materials.cowWhite
          );

        leg.position.set(
          x,
          y,
          z
        );

        leg.castShadow = true;

        group.add(leg);

        legs.push(leg);
      }
    );

    // TAIL
    const tail =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.045,
          0.07,
          0.8,
          8
        ),
        materials.cowBlack
      );

    tail.position.set(
      0,
      1.35,
      -1.8
    );

    tail.rotation.x =
      Math.PI / 2;

    group.add(tail);

    group.userData.legs =
      legs;

    group.userData.head =
      head;

    group.userData.tail =
      tail;

    return group;
  }

  // ----------------------------------------------------------
  // CHICKEN
  // ----------------------------------------------------------

  function createChicken(
    id,
    materials
  ) {
    const group =
      new THREE.Group();

    group.userData.id = id;
    group.userData.type =
      "poultry";

    group.userData.phase =
      Math.random() *
      Math.PI *
      2;

    // BODY
    const body =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.5,
          16,
          12
        ),
        materials.chicken
      );

    body.scale.set(
      0.9,
      1,
      1.25
    );

    body.position.y =
      0.72;

    body.castShadow = true;

    group.add(body);

    // HEAD
    const head =
      new THREE.Group();

    head.position.set(
      0,
      1.25,
      0.35
    );

    const headMesh =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.3,
          14,
          10
        ),
        materials.chicken
      );

    head.add(headMesh);

    // BEAK
    const beak =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          0.1,
          0.3,
          8
        ),
        materials.orange
      );

    beak.rotation.x =
      Math.PI / 2;

    beak.position.set(
      0,
      -0.03,
      0.28
    );

    head.add(beak);

    // COMB
    const comb =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.11,
          10,
          8
        ),
        materials.red
      );

    comb.scale.set(
      0.7,
      1.5,
      0.5
    );

    comb.position.y =
      0.27;

    head.add(comb);

    // EYES
    const eyeGeo =
      new THREE.SphereGeometry(
        0.035,
        8,
        8
      );

    const eyeL =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeL.position.set(
      0.17,
      0.06,
      0.22
    );

    head.add(eyeL);

    const eyeR =
      new THREE.Mesh(
        eyeGeo,
        materials.black
      );

    eyeR.position.set(
      -0.17,
      0.06,
      0.22
    );

    head.add(eyeR);

    group.add(head);

    // WINGS
    const wingGeo =
      new THREE.SphereGeometry(
        0.28,
        12,
        10
      );

    const wingL =
      new THREE.Mesh(
        wingGeo,
        materials.woolDark
      );

    wingL.scale.set(
      0.35,
      1,
      1.1
    );

    wingL.position.set(
      0.45,
      0.85,
      0
    );

    group.add(wingL);

    const wingR =
      new THREE.Mesh(
        wingGeo,
        materials.woolDark
      );

    wingR.scale.set(
      0.35,
      1,
      1.1
    );

    wingR.position.set(
      -0.45,
      0.85,
      0
    );

    group.add(wingR);

    // LEGS
    const legs = [];

    const legGeo =
      new THREE.CylinderGeometry(
        0.035,
        0.045,
        0.55,
        8
      );

    [
      [-0.16, 0.35, 0.15],
      [0.16, 0.35, 0.15],
    ].forEach(
      ([x, y, z]) => {
        const leg =
          new THREE.Mesh(
            legGeo,
            materials.orange
          );

        leg.position.set(
          x,
          y,
          z
        );

        group.add(leg);

        legs.push(leg);
      }
    );

    group.userData.legs =
      legs;

    group.userData.head =
      head;

    group.userData.wings = [
      wingL,
      wingR,
    ];

    return group;
  }

  // ----------------------------------------------------------
  // FARM ENVIRONMENT
  // ----------------------------------------------------------

  function createBarn(
    scene,
    materials
  ) {
    const barn =
      new THREE.Group();

    const body =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          8,
          4.2,
          5
        ),
        materials.wood
      );

    body.position.set(
      0,
      2.1,
      -9
    );

    body.castShadow = true;
    body.receiveShadow = true;

    barn.add(body);

    // ROOF
    const roof =
      new THREE.Mesh(
        new THREE.ConeGeometry(
          5.8,
          2.2,
          4
        ),
        materials.red
      );

    roof.rotation.y =
      Math.PI / 4;

    roof.position.set(
      0,
      5.1,
      -9
    );

    roof.castShadow = true;

    barn.add(roof);

    // DOOR
    const door =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          2.2,
          2.8,
          0.15
        ),
        materials.black
      );

    door.position.set(
      0,
      1.4,
      -6.45
    );

    barn.add(door);

    scene.add(barn);
  }

  function createFence(
    scene,
    materials
  ) {
    const fence =
      new THREE.Group();

    for (
      let x = -18;
      x <= 18;
      x += 3
    ) {
      const post =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            0.18,
            1.6,
            0.18
          ),
          materials.fence
        );

      post.position.set(
        x,
        0.8,
        -17
      );

      post.castShadow = true;

      fence.add(post);
    }

    const rail1 =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          36,
          0.15,
          0.15
        ),
        materials.fence
      );

    rail1.position.set(
      0,
      1.2,
      -17
    );

    fence.add(rail1);

    const rail2 =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          36,
          0.15,
          0.15
        ),
        materials.fence
      );

    rail2.position.set(
      0,
      0.65,
      -17
    );

    fence.add(rail2);

    scene.add(fence);
  }

  // ----------------------------------------------------------
  // INITIALISE THREE
  // ----------------------------------------------------------

  useEffect(() => {
    const mount =
      mountRef.current;

    if (!mount) {
      return;
    }

    // Clear previous canvas
    while (
      mount.firstChild
    ) {
      mount.removeChild(
        mount.firstChild
      );
    }

    const scene =
      new THREE.Scene();

    scene.background =
      new THREE.Color(
        0x0b1220
      );

    scene.fog =
      new THREE.Fog(
        0x0b1220,
        28,
        70
      );

    const width =
      mount.clientWidth || 800;

    const height =
      mount.clientHeight || 520;

    const camera =
      new THREE.PerspectiveCamera(
        42,
        width / height,
        0.1,
        100
      );

    camera.position.set(
      7,
      4.5,
      11
    );

    camera.lookAt(
      0,
      1,
      4
    );

    cameraRef.current =
      camera;

    const renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        2
      )
    );

    renderer.setSize(
      width,
      height
    );

    renderer.shadowMap.enabled =
      true;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure =
      1.1;

    rendererRef.current =
      renderer;

    mount.appendChild(
      renderer.domElement
    );

    // --------------------------------------------------------
    // LIGHTING
    // --------------------------------------------------------

    const ambient =
      new THREE.HemisphereLight(
        0xb8d8d0,
        0x17241f,
        1.7
      );

    scene.add(ambient);

    const directional =
      new THREE.DirectionalLight(
        0xffffff,
        2.5
      );

    directional.position.set(
      12,
      20,
      10
    );

    directional.castShadow =
      true;

    directional.shadow.mapSize.width =
      2048;

    directional.shadow.mapSize.height =
      2048;

    directional.shadow.camera.left =
      -25;

    directional.shadow.camera.right =
      25;

    directional.shadow.camera.top =
      25;

    directional.shadow.camera.bottom =
      -25;

    scene.add(
      directional
    );

    const fill =
      new THREE.DirectionalLight(
        0x88a99e,
        0.8
      );

    fill.position.set(
      -15,
      8,
      -5
    );

    scene.add(fill);

    // --------------------------------------------------------
    // MATERIALS
    // --------------------------------------------------------

    const materials =
      createMaterials();

    // --------------------------------------------------------
    // GROUND
    // --------------------------------------------------------

    const ground =
      new THREE.Mesh(
        new THREE.PlaneGeometry(
          60,
          60
        ),
        materials.ground
      );

    ground.rotation.x =
      -Math.PI / 2;

    ground.receiveShadow =
      true;

    scene.add(ground);

    // GRID
    const grid =
      new THREE.GridHelper(
        50,
        50,
        0x52685f,
        0x263d35
      );

    grid.position.y =
      0.01;

    scene.add(grid);

    createBarn(
      scene,
      materials
    );

    createFence(
      scene,
      materials
    );

    // --------------------------------------------------------
    // TARGET INDICATOR
    // --------------------------------------------------------

    const indicator =
      new THREE.Mesh(
        new THREE.RingGeometry(
          0.35,
          0.48,
          32
        ),
        new THREE.MeshBasicMaterial({
          color: 0x6ee7b7,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        })
      );

    indicator.rotation.x =
      -Math.PI / 2;

    indicator.position.set(
      0,
      0.03,
      5
    );

    scene.add(indicator);

    // --------------------------------------------------------
    // ANIMALS
    // --------------------------------------------------------

    const animalMeshes =
      [];

    const isPoultry =
      species === "poultry";

    const isDairy =
      species === "dairy";

    const count =
      mode === "individual"
        ? 1
        : isPoultry
        ? 18
        : 10;

    for (
      let index = 0;
      index < count;
      index++
    ) {
      const animalIdValue =
        mode === "individual"
          ? animalId || "1"
          : `${index + 1}`;

      let animal;

      if (isPoultry) {
        animal =
          createChicken(
            animalIdValue,
            materials
          );
      } else if (isDairy) {
        animal =
          createCow(
            animalIdValue,
            materials
          );
      } else {
        animal =
          createRuminant(
            animalIdValue,
            materials
          );
      }

      if (
        mode === "individual"
      ) {
        animal.position.set(
          0,
          0,
          4
        );

        animal.scale.setScalar(
          isPoultry
            ? 1.25
            : 1
        );
      } else {
        const angle =
          Math.random() *
          Math.PI *
          2;

        const radius =
          3 +
          Math.random() *
            11;

        animal.position.set(
          Math.cos(angle) *
            radius,
          0,
          Math.sin(angle) *
            radius +
            3
        );

        const scale =
          isPoultry
            ? 0.65 +
              Math.random() *
                0.25
            : 0.8 +
              Math.random() *
                0.25;

        animal.scale.setScalar(
          scale
        );
      }

      animal.userData.velocity =
        new THREE.Vector3(
          (Math.random() -
            0.5) *
            0.6,
          0,
          (Math.random() -
            0.5) *
            0.6
        );

      scene.add(animal);

      animalMeshes.push({
        mesh: animal,
        velocity:
          animal.userData.velocity,
      });
    }

    animalsRef.current =
      animalMeshes;

    // --------------------------------------------------------
    // ANIMATION
    // --------------------------------------------------------

    let previousTime =
      performance.now();

    const animate = (
      currentTime
    ) => {
      animationRef.current =
        requestAnimationFrame(
          animate
        );

      const delta =
        Math.min(
          (currentTime -
            previousTime) /
            1000,
          0.05
        );

      previousTime =
        currentTime;

      const time =
        currentTime / 1000;

      // INDIVIDUAL
      if (
        mode === "individual" &&
        animalMeshes.length > 0
      ) {
        const item =
          animalMeshes[0];

        const animal =
          item.mesh;

        const rig =
          animal.userData;

        const direction =
          new THREE.Vector3()
            .subVectors(
              targetRef.current,
              animal.position
            );

        direction.y = 0;

        const distance =
          direction.length();

        if (
          distance > 0.15
        ) {
          direction.normalize();

          const speed =
            isPoultry
              ? 2.2
              : 1.3;

          animal.position.addScaledVector(
            direction,
            speed * delta
          );

          animal.rotation.y =
            Math.atan2(
              direction.x,
              direction.z
            );

          if (
            rig.phase !==
            undefined
          ) {
            rig.phase +=
              delta *
              speed *
              5;
          }
        }

        if (
          rig.legs
        ) {
          rig.legs.forEach(
            (
              leg,
              index
            ) => {
              const offset =
                index % 2 ===
                0
                  ? 0
                  : Math.PI;

              leg.rotation.x =
                Math.sin(
                  rig.phase +
                    offset
                ) * 0.3;
            }
          );
        }

        if (
          rig.head
        ) {
          rig.head.rotation.x =
            Math.sin(
              time * 2
            ) * 0.05;
        }

        if (
          rig.tail
        ) {
          rig.tail.rotation.z =
            Math.sin(
              time * 3
            ) * 0.15;
        }

        indicator.position.x =
          targetRef.current.x;

        indicator.position.z =
          targetRef.current.z;

        indicator.scale.setScalar(
          1 +
            Math.sin(
              time * 6
            ) *
              0.08
        );
      }

      // FLOCK
      if (
        mode === "flock"
      ) {
        animalMeshes.forEach(
          (
            item,
            index
          ) => {
            const animal =
              item.mesh;

            const velocity =
              item.velocity;

            const rig =
              animal.userData;

            velocity.x +=
              (Math.random() -
                0.5) *
              0.06;

            velocity.z +=
              (Math.random() -
                0.5) *
              0.06;

            const distance =
              Math.sqrt(
                animal.position.x *
                  animal.position.x +
                  animal.position.z *
                    animal.position.z
              );

            if (
              distance > 20
            ) {
              const returnDirection =
                new THREE.Vector3(
                  -animal.position.x,
                  0,
                  -animal.position.z
                ).normalize();

              velocity.add(
                returnDirection.multiplyScalar(
                  0.08
                )
              );
            }

            velocity.clampLength(
              0.15,
              isPoultry
                ? 1.8
                : 1.1
            );

            animal.position.addScaledVector(
              velocity,
              delta
            );

            if (
              velocity.length() >
              0.05
            ) {
              animal.rotation.y =
                Math.atan2(
                  velocity.x,
                  velocity.z
                );
            }

            if (
              rig.phase !==
              undefined
            ) {
              rig.phase +=
                delta *
                velocity.length() *
                5;
            }

            if (
              rig.legs
            ) {
              rig.legs.forEach(
                (
                  leg,
                  legIndex
                ) => {
                  const offset =
                    legIndex %
                      2 ===
                    0
                      ? 0
                      : Math.PI;

                  leg.rotation.x =
                    Math.sin(
                      rig.phase +
                        offset
                    ) *
                    (isPoultry
                      ? 0.45
                      : 0.3);
                }
              );
            }

            if (
              isPoultry &&
              rig.wings
            ) {
              rig.wings[0].rotation.z =
                Math.sin(
                  time * 2 +
                    index
                ) *
                0.08;

              rig.wings[1].rotation.z =
                -Math.sin(
                  time * 2 +
                    index
                ) *
                0.08;
            }

            if (
              rig.head
            ) {
              rig.head.rotation.x =
                Math.sin(
                  time * 2 +
                    index
                ) *
                0.05;
            }
          }
        );
      }

      renderer.render(
        scene,
        camera
      );
    };

    animate(
      performance.now()
    );

    // --------------------------------------------------------
    // CLICK GROUND
    // --------------------------------------------------------

    const handlePointerDown =
      (event) => {
        if (
          mode !==
          "individual"
        ) {
          return;
        }

        const rect =
          renderer.domElement.getBoundingClientRect();

        mouseRef.current.x =
          ((event.clientX -
            rect.left) /
            rect.width) *
            2 -
          1;

        mouseRef.current.y =
          -(
            ((event.clientY -
              rect.top) /
              rect.height) *
              2 -
            1
          );

        raycasterRef.current.setFromCamera(
          mouseRef.current,
          camera
        );

        const plane =
          new THREE.Plane(
            new THREE.Vector3(
              0,
              1,
              0
            ),
            0
          );

        const groundPoint =
          new THREE.Vector3();

        if (
          raycasterRef.current.ray.intersectPlane(
            plane,
            groundPoint
          )
        ) {
          groundPoint.x =
            THREE.MathUtils.clamp(
              groundPoint.x,
              -22,
              22
            );

          groundPoint.z =
            THREE.MathUtils.clamp(
              groundPoint.z,
              -14,
              20
            );

          targetRef.current.copy(
            groundPoint
          );
        }
      };

    renderer.domElement.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    // --------------------------------------------------------
    // RESIZE
    // --------------------------------------------------------

    const handleResize =
      () => {
        const currentMount =
          mountRef.current;

        if (
          !currentMount
        ) {
          return;
        }

        const newWidth =
          currentMount.clientWidth ||
          800;

        const newHeight =
          currentMount.clientHeight ||
          520;

        camera.aspect =
          newWidth /
          newHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
          newWidth,
          newHeight
        );
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    handleResize();

    setCanvasReady(true);

    // --------------------------------------------------------
    // CLEANUP
    // --------------------------------------------------------

    return () => {
      setCanvasReady(false);

      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      window.removeEventListener(
        "resize",
        handleResize
      );

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      scene.traverse(
        (object) => {
          if (
            object.geometry
          ) {
            object.geometry.dispose();
          }

          if (
            object.material
          ) {
            if (
              Array.isArray(
                object.material
              )
            ) {
              object.material.forEach(
                (material) =>
                  material.dispose()
              );
            } else {
              object.material.dispose();
            }
          }
        }
      );

      renderer.dispose();

      if (
        mount.contains(
          renderer.domElement
        )
      ) {
        mount.removeChild(
          renderer.domElement
        );
      }

      rendererRef.current =
        null;

      cameraRef.current =
        null;
    };
  }, [
    species,
    mode,
    animalId,
  ]);

  // ----------------------------------------------------------
  // CAMERA
  // ----------------------------------------------------------

  useEffect(() => {
    const camera =
      cameraRef.current;

    if (!camera) {
      return;
    }

    if (
      mode ===
      "individual"
    ) {
      camera.position.set(
        7,
        4.5,
        11
      );

      camera.lookAt(
        0,
        1,
        4
      );
    } else {
      camera.position.set(
        0,
        18,
        22
      );

      camera.lookAt(
        0,
        0,
        2
      );
    }
  }, [mode]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: 420,
          md: 560,
        },
        overflow: "hidden",
        borderRadius: 2,
        backgroundColor:
          "#0b1220",
      }}
    >
      <Box
        ref={mountRef}
        sx={{
          position:
            "absolute",
          inset: 0,
        }}
      />

      {/* TOP LEFT */}
      <Box
        sx={{
          position:
            "absolute",
          top: 16,
          left: 16,
          px: 2,
          py: 1,
          borderRadius: 2,
          backgroundColor:
            "rgba(15,23,42,0.88)",
          color: "white",
          backdropFilter:
            "blur(8px)",
          pointerEvents:
            "none",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color:
              "rgba(255,255,255,0.65)",
            letterSpacing:
              "0.08em",
          }}
        >
          PASHUSENSE DIGITAL TWIN
        </Typography>

        <Typography
          fontWeight={700}
        >
          {formatSpecies(
            species
          )}
        </Typography>
      </Box>

      {/* ANIMAL ID */}
      {mode ===
        "individual" && (
        <Box
          sx={{
            position:
              "absolute",
            top: 92,
            left: "50%",
            transform:
              "translateX(-50%)",
            px: 3,
            py: 1.1,
            borderRadius: 2,
            backgroundColor:
              "rgba(71,91,128,0.95)",
            color: "white",
            fontWeight: 700,
            fontSize: 18,
            pointerEvents:
              "none",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.25)",
          }}
        >
          ANIMAL #
          {animalId || "1"}
        </Box>
      )}

      {/* READY STATUS */}
      <Box
        sx={{
          position:
            "absolute",
          top: 16,
          right: 16,
          px: 1.5,
          py: 0.7,
          borderRadius: 2,
          backgroundColor:
            "rgba(15,23,42,0.82)",
          color:
            "#6ee7b7",
          fontSize: 12,
          fontWeight: 700,
          pointerEvents:
            "none",
        }}
      >
        {canvasReady
          ? "LIVE"
          : "LOADING"}
      </Box>

      {/* BOTTOM */}
      <Box
        sx={{
          position:
            "absolute",
          bottom: 14,
          left: 14,
          right: 14,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          pointerEvents:
            "none",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.7,
            borderRadius: 1.5,
            backgroundColor:
              "rgba(15,23,42,0.82)",
            color: "white",
          }}
        >
          <Typography
            variant="caption"
          >
            MODE
          </Typography>

          <Typography
            variant="body2"
            fontWeight={700}
          >
            {mode ===
            "individual"
              ? "Individual Twin"
              : "Flock Simulation"}
          </Typography>
        </Box>

        {mode ===
          "individual" && (
          <Box
            sx={{
              px: 1.5,
              py: 0.7,
              borderRadius: 1.5,
              backgroundColor:
                "rgba(15,23,42,0.82)",
              color:
                "#6ee7b7",
            }}
          >
            <Typography
              variant="caption"
            >
              INTERACTION
            </Typography>

            <Typography
              variant="body2"
              fontWeight={700}
            >
              Click ground to move
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DigitalTwin() {
  const [
    animals,
    setAnimals,
  ] = useState([]);

  const [
    selectedAnimalId,
    setSelectedAnimalId,
  ] = useState("");

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState("");

  const [
    aiResult,
    setAiResult,
  ] = useState(null);

  const [
    loadingAnimals,
    setLoadingAnimals,
  ] = useState(true);

  const [
    analyzing,
    setAnalyzing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    twinMode,
    setTwinMode,
  ] = useState("individual");

  const [mlResults, setMlResults] = useState({});
  const [mlLoading, setMlLoading] = useState(false);
  const [mlModels, setMlModels] = useState([]);
  const [mlFeatures, setMlFeatures] = useState({});
  const [mlError, setMlError] = useState("");


  // ==========================================================
  // LOAD STRUCTURED ML MODELS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadMLModels() {
      try {
        const response =
          await mlRequest("/api/ml-predictions/models");

        if (!mounted) return;

        const models =
          response?.models ||
          response?.loaded_models ||
          response?.data?.models ||
          response?.data ||
          [];

        if (Array.isArray(models)) {
          const names = models
            .map((item) =>
              typeof item === "string"
                ? item
                : item?.model_name ||
                  item?.model ||
                  item?.name ||
                  ""
            )
            .map((item) => String(item).trim())
            .filter(Boolean);

          setMlModels([
            ...new Set(
              names.length
                ? names
                : STRUCTURED_MODELS
            ),
          ]);
        } else {
          setMlModels(STRUCTURED_MODELS);
        }
      } catch (err) {
        console.warn(
          "Unable to load structured ML model list:",
          err
        );

        if (mounted) {
          // Keep the known backend model list visible if the
          // endpoint is temporarily unavailable.
          setMlModels(STRUCTURED_MODELS);
        }
      }
    }

    loadMLModels();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // LOAD ANIMALS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function loadAnimals() {
      try {
        setLoadingAnimals(true);
        setError("");

        const response =
          await getAnimals();

        if (!mounted) {
          return;
        }

        let list = [];

        if (
          Array.isArray(response)
        ) {
          list = response;
        } else if (
          Array.isArray(
            response?.animals
          )
        ) {
          list =
            response.animals;
        } else if (
          Array.isArray(
            response?.data
          )
        ) {
          list =
            response.data;
        }

        setAnimals(list);

        if (list.length > 0) {
          let firstId = getAnimalId(list[0]);

          // Restore the most recent AI analysis when it belongs
          // to an animal that still exists in the backend.
          try {
            const saved =
              localStorage.getItem(
                "pashusense_last_ai_result"
              );

            if (saved) {
              const parsed = JSON.parse(saved);
              const savedId = parsed?.animalId;

              const matchingAnimal = list.find(
                (animal) =>
                  String(getAnimalId(animal)) ===
                  String(savedId)
              );

              if (matchingAnimal && parsed?.result) {
                firstId = getAnimalId(matchingAnimal);
                setAiResult(parsed.result);
              }
            }
          } catch (storageError) {
            console.warn(
              "Unable to restore saved AI result:",
              storageError
            );
          }

          if (
            firstId !== "" &&
            firstId !== null &&
            firstId !== undefined
          ) {
            setSelectedAnimalId(
              String(firstId)
            );
          }
        }
      } catch (err) {
        console.error(
          "Failed to load animals:",
          err
        );

        if (!mounted) {
          return;
        }

        if (
          err?.status === 401 ||
          err?.isUnauthorized
        ) {
          setError(
            "Your login session has expired. Please login again."
          );
        } else {
          setError(
            err?.message ||
              "Unable to load animals."
          );
        }
      } finally {
        if (mounted) {
          setLoadingAnimals(
            false
          );
        }
      }
    }

    loadAnimals();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // SELECTED ANIMAL
  // ==========================================================

  const selectedAnimal =
    useMemo(() => {
      return animals.find(
        (animal) =>
          String(
            getAnimalId(
              animal
            )
          ) ===
          String(
            selectedAnimalId
          )
      );
    }, [
      animals,
      selectedAnimalId,
    ]);

  // ==========================================================
  // DIGITAL TWIN SPECIES
  // ==========================================================

  const twinSpecies =
    useMemo(() => {
      const source =
        selectedAnimal
          ? getAnimalType(
              selectedAnimal
            )
          : "";

      const lower =
        String(source)
          .toLowerCase();

      if (
        lower.includes("chicken") ||
        lower.includes("hen") ||
        lower.includes("poultry") ||
        lower.includes("bird")
      ) {
        return "poultry";
      }

      if (
        lower.includes("cow") ||
        lower.includes("cattle") ||
        lower.includes("dairy")
      ) {
        return "dairy";
      }

      return "ruminants";
    }, [
      selectedAnimal,
    ]);

  // ==========================================================
  // FILE SELECT
  // ==========================================================

  function handleFileChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select an image file."
      );

      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    const url =
      URL.createObjectURL(
        file
      );

    setSelectedFile(file);
    setPreviewUrl(url);

    setAiResult(null);
    setMlResults({});
    setMlError("");
    setError("");
    setSuccessMessage("");
  }

  // ==========================================================
  // ANALYSE IMAGE
  // ==========================================================

  async function handleAnalyze() {
    if (!selectedAnimalId) {
      setError(
        "Please select an Animal ID."
      );

      return;
    }

    if (!selectedFile) {
      setError(
        "Please select an animal image."
      );

      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setSuccessMessage("");
      setAiResult(null);

      // IMPORTANT:
      // uploadAIImage accepts the image file.
      // Animal ID remains a frontend linkage.
      const rawResult =
        await uploadAIImage(selectedFile);

      const result =
        rawResult?.data &&
        typeof rawResult.data === "object" &&
        (
          rawResult.data.analysis ||
          rawResult.data.result ||
          rawResult.data.yolo ||
          rawResult.data.cnn
        )
          ? rawResult.data
          : rawResult;

      console.log(
        "DIGITAL TWIN AI RESPONSE FULL:",
        JSON.stringify(result, null, 2)
      );

      setAiResult(result);

      // Image intelligence is YOLO + CNN.
      // Structured XGBoost/ML runs separately against the
      // selected animal record and is never fabricated from
      // the image response.
      if (selectedAnimal) {
        try {
          await runAllStructuredModels(
            selectedAnimal
          );
        } catch (mlRunError) {
          console.error(
            "Structured ML analysis error:",
            mlRunError
          );
          setMlError(
            mlRunError?.message ||
              "Some structured ML models could not be run."
          );
        }
      }

      // Persist the latest real AI result so the Digital Twin
      // can retain the analysis when the user navigates away
      // and returns to this page.
      try {
        localStorage.setItem(
          "pashusense_last_ai_result",
          JSON.stringify({
            animalId: selectedAnimalId,
            result,
            fileName: selectedFile.name,
            timestamp: new Date().toISOString(),
          })
        );
      } catch (storageError) {
        console.warn(
          "Unable to persist AI result:",
          storageError
        );
      }

      setSuccessMessage(
        result?.message ||
          "Animal image analysed successfully."
      );
    } catch (err) {
      console.error(
        "AI analysis error:",
        err
      );

      if (
        err?.status === 401 ||
        err?.isUnauthorized
      ) {
        setError(
          "Your login session has expired. Please login again."
        );
      } else {
        setError(
          err?.message ||
            "AI analysis failed."
        );
      }

      setAiResult(null);
    } finally {
      setAnalyzing(false);
    }
  }

  // ==========================================================
  // RUN REAL STRUCTURED ML PREDICTIONS
  // ==========================================================

  async function runAllStructuredModels(animal) {
    if (!animal) {
      throw new Error("Please select an animal first.");
    }

    // Run only models that are applicable to the selected animal species.
    // The backend may have 12 models loaded, but a chicken must not receive
    // cattle/milk or pasture-model predictions.
    const speciesKey = String(
      getAnimalType(animal) || animal?.species || ""
    )
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " " );

    let applicableModels;

    if (
      speciesKey.includes("chicken") ||
      speciesKey.includes("poultry") ||
      speciesKey.includes("hen")
    ) {
      applicableModels = [
        "health",
        "egg",
        "feed",
        "behaviour",
        "anomaly",
      ];
    } else if (
      speciesKey.includes("cow") ||
      speciesKey.includes("cattle") ||
      speciesKey.includes("buffalo") ||
      speciesKey.includes("dairy")
    ) {
      applicableModels = [
        "health",
        "feed",
        "milk",
        "behaviour",
        "anomaly",
        "milk_forecast",
      ];
    } else if (
      speciesKey.includes("sheep") ||
      speciesKey.includes("goat") ||
      speciesKey.includes("ruminant")
    ) {
      applicableModels = [
        "health",
        "feed",
        "behaviour",
        "anomaly",
        "katanning",
        "murdoch",
        "muresk",
        "muresk_dry",
        "muresk_stubble",
      ];
    } else {
      // Unknown species: use only the generic models rather than producing
      // misleading species-specific production predictions.
      applicableModels = [
        "health",
        "feed",
        "behaviour",
        "anomaly",
      ];
    }

    const loadedModels =
      mlModels.length > 0
        ? mlModels
        : STRUCTURED_MODELS;

    const modelsToRun = applicableModels.filter(
      (modelName) => loadedModels.includes(modelName)
    );

    setMlLoading(true);
    setMlError("");

    const results = {};
    const featureCache = {};

    try {
      for (const modelName of modelsToRun) {
        try {
          let featureNames =
            mlFeatures[modelName] || [];

          if (!featureNames.length) {
            try {
              const featureResponse =
                await mlRequest(
                  `/api/ml-predictions/features/${encodeURIComponent(
                    modelName
                  )}`
                );

              featureNames =
                normalizeFeatureNames(
                  featureResponse
                );

              featureCache[modelName] =
                featureNames;
            } catch (featureError) {
              console.warn(
                `Feature lookup failed for ${modelName}:`,
                featureError
              );
            }
          }

          const data =
            buildStructuredData(
              animal,
              modelName,
              featureNames
            );

          const response =
            await mlRequest(
              "/api/ml-predictions/predict",
              {
                method: "POST",
                body: JSON.stringify({
                  model_name: modelName,
                  data,
                }),
              }
            );

          const prediction =
            extractMLPrediction(response);

          results[modelName] = {
            ...response,
            model_name:
              response?.model_name ||
              modelName,
            prediction,
            status:
              response?.status ||
              (prediction !== null
                ? "success"
                : "no_prediction"),
            input_features:
              Object.keys(data),
          };
        } catch (modelError) {
          console.error(
            `ML prediction failed for ${modelName}:`,
            modelError
          );

          results[modelName] = {
            model_name: modelName,
            prediction: null,
            status: "error",
            error:
              modelError?.message ||
              "Prediction failed",
          };
        }
      }

      setMlFeatures((previous) => ({
        ...previous,
        ...featureCache,
      }));

      setMlResults(results);

      return results;
    } finally {
      setMlLoading(false);
    }
  }

  // ==========================================================
  // RUN ML AFTER ANIMAL SELECTION
  // ==========================================================

  useEffect(() => {
    if (!selectedAnimal) {
      setMlResults({});
      return;
    }

    // Run structured models for the selected animal.
    // This is independent of image upload.
    let cancelled = false;

    async function runForSelectedAnimal() {
      try {
        const results =
          await runAllStructuredModels(
            selectedAnimal
          );

        if (cancelled) return;

        console.log(
          "DIGITAL TWIN STRUCTURED ML RESULTS:",
          JSON.stringify(
            results,
            null,
            2
          )
        );
      } catch (err) {
        if (!cancelled) {
          setMlError(
            err?.message ||
              "Structured ML analysis failed."
          );
        }
      }
    }

    runForSelectedAnimal();

    return () => {
      cancelled = true;
    };
  }, [selectedAnimalId]);

  // ==========================================================
  // PREVIEW CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl]);

  // ==========================================================
  // AI VALUES
  // ==========================================================

  const detectedSpecies =
    getDetectedSpecies(
      aiResult
    );

  const detectionCount =
    getDetectionCount(
      aiResult
    );

  const yoloConfidence =
    getDetectionConfidence(
      aiResult
    );

  const cnnStatus =
    getCNNStatus(
      aiResult
    );

  const cnnClassification =
    getSafeCNNClassification(
      aiResult
    );

  const cnnConfidence =
    getCNNConfidence(
      aiResult
    );

  const cnnPredictions =
    getTopCNNPredictions(
      aiResult
    );

  const actualXGBoostPrediction =
    getActualXGBoostPrediction(aiResult);

  const xgboostAvailable =
    getXGBoostModelAvailability(aiResult);

  // Structured ML results are fetched asynchronously.
  // IMPORTANT: define these values before anything that consumes them.
  const behaviourML =
    mlResults?.behaviour || null;

  const healthML =
    mlResults?.health || null;

  const primaryProductionModel =
    twinSpecies === "poultry"
      ? "egg"
      : twinSpecies === "dairy"
        ? "milk"
        : "muresk";

  const primaryProductionML =
    mlResults?.[primaryProductionModel] ||
    null;

  const structuredBehaviourPrediction =
    extractMLPrediction(behaviourML);

  const structuredHealthPrediction =
    extractMLPrediction(healthML);

  const structuredHealthLabel =
    getHealthModelLabel(
      structuredHealthPrediction,
      getAnimalType(selectedAnimal)
    );

  const structuredActivity =
    behaviourML
      ? formatMLPrediction(
          structuredBehaviourPrediction
        )
      : null;

  const health =
    structuredHealthLabel || getHealth(aiResult);

  const behaviour =
    structuredActivity || getBehaviour(aiResult);

  const activity =
    structuredActivity || getActivity(aiResult);

  const structuredModelCount =
    Object.keys(mlResults || {}).length;

  const structuredSuccessCount =
    Object.values(mlResults || {}).filter(
      (item) =>
        item?.status === "success" &&
        extractMLPrediction(item) !== null
    ).length;

  // ==========================================================
  // STATUS
  // ==========================================================

  const yoloRan =
    Boolean(aiResult);

  const yoloDetected =
    detectionCount > 0;

  const yoloSpeciesIdentified =
    Boolean(
      detectedSpecies
    );

  const cnnRan =
    Boolean(
      aiResult &&
      cnnStatus
    );

  const xgboostRan =
    actualXGBoostPrediction !== null &&
    actualXGBoostPrediction !== undefined ||
    structuredSuccessCount > 0;

  const cnnDisplayStatus =
    getCNNDisplayStatus(aiResult);

  const xgboostDisplayStatus =
    getXGBoostDisplayStatus(aiResult);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 0.5,
          }}
        >
          Digital Twin
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          AI-powered livestock identity,
          health and farm intelligence
        </Typography>
      </Box>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {/* ======================================================
          SUCCESS
      ====================================================== */}

      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
          }}
          onClose={() =>
            setSuccessMessage("")
          }
        >
          {successMessage}
        </Alert>
      )}

      {mlError && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          onClose={() => setMlError("")}
        >
          {mlError}
        </Alert>
      )}

      {/* ======================================================
          3D DIGITAL TWIN
      ====================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            3D Digital Twin
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
            }}
          >
            Interactive livestock simulation
            connected to the selected PashuSense
            animal profile.
          </Typography>

          {/* CONTROLS */}

          <Grid
            container
            spacing={2}
            sx={{
              mb: 2,
            }}
          >
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Species
              </Typography>

              <Box
                sx={{
                  border:
                    "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1.1,
                  fontWeight: 600,
                }}
              >
                {formatSpecies(
                  twinSpecies
                )}
              </Box>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Twin Mode
              </Typography>

              <Select
                fullWidth
                size="small"
                value={twinMode}
                onChange={(
                  event
                ) =>
                  setTwinMode(
                    event.target.value
                  )
                }
              >
                <MenuItem value="individual">
                  Individual Animal
                </MenuItem>

                <MenuItem value="flock">
                  Flock Simulation
                </MenuItem>
              </Select>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Linked Animal ID
              </Typography>

              <Box
                sx={{
                  border:
                    "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1.1,
                  fontWeight: 700,
                }}
              >
                {selectedAnimalId ||
                  "Not selected"}
              </Box>
            </Grid>
          </Grid>

          <DigitalTwin3D
            species={
              twinSpecies
            }
            mode={
              twinMode
            }
            animalId={
              selectedAnimalId
            }
          />
        </CardContent>
      </Card>

      {/* ======================================================
          AI LIVESTOCK ANALYSIS
      ====================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            AI Livestock Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Upload an animal image and link it
            to an existing Animal ID.
          </Typography>

          <Grid
            container
            spacing={3}
          >
            {/* LEFT */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Animal Image
              </Typography>

              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{
                  mb: 2,
                  py: 1.4,
                  textTransform:
                    "none",
                }}
              >
                Upload Animal Image

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFileChange
                  }
                />
              </Button>

              {selectedFile && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    wordBreak:
                      "break-word",
                  }}
                >
                  {selectedFile.name}
                </Typography>
              )}

              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Select Animal ID
              </Typography>

              {loadingAnimals ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <CircularProgress
                    size={20}
                  />

                  <Typography>
                    Loading animals...
                  </Typography>
                </Box>
              ) : (
                <Select
                  fullWidth
                  value={
                    selectedAnimalId
                  }
                  displayEmpty
                  onChange={(
                    event
                  ) => {
                    const nextId =
                      event.target.value;

                    setSelectedAnimalId(nextId);
                    setError("");
                    setSuccessMessage("");

                    let restored = null;

                    try {
                      const saved =
                        localStorage.getItem(
                          "pashusense_last_ai_result"
                        );

                      if (saved) {
                        const parsed = JSON.parse(saved);

                        if (
                          String(parsed?.animalId) ===
                          String(nextId)
                        ) {
                          restored = parsed?.result || null;
                        }
                      }
                    } catch (storageError) {
                      console.warn(
                        "Unable to restore animal AI result:",
                        storageError
                      );
                    }

                    setAiResult(restored);
                  }}
                  sx={{
                    mb: 3,
                  }}
                >
                  <MenuItem value="">
                    Select Animal ID
                  </MenuItem>

                  {animals.map(
                    (animal) => {
                      const id =
                        getAnimalId(
                          animal
                        );

                      if (
                        id === "" ||
                        id === null ||
                        id ===
                          undefined
                      ) {
                        return null;
                      }

                      return (
                        <MenuItem
                          key={String(
                            id
                          )}
                          value={String(
                            id
                          )}
                        >
                          {String(id)}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              )}

              {selectedAnimal && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "rgba(0,0,0,0.03)",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Selected Animal
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Animal #
                    {getAnimalId(
                      selectedAnimal
                    )}
                  </Typography>

                  {getAnimalTag(
                    selectedAnimal
                  ) && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Tag:{" "}
                      {getAnimalTag(
                        selectedAnimal
                      )}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Species:{" "}
                    {getAnimalType(
                      selectedAnimal
                    )}
                  </Typography>

                  {getAnimalWeight(
                    selectedAnimal
                  ) !== null && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Weight:{" "}
                      {getAnimalWeight(
                        selectedAnimal
                      )} kg
                    </Typography>
                  )}
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                disabled={
                  !selectedFile ||
                  !selectedAnimalId ||
                  analyzing
                }
                onClick={
                  handleAnalyze
                }
                sx={{
                  py: 1.4,
                  textTransform:
                    "none",
                }}
              >
                {analyzing ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{
                        mr: 1,
                        color:
                          "inherit",
                      }}
                    />

                    Analysing with AI...
                  </>
                ) : (
                  "Analyse Image"
                )}
              </Button>
            </Grid>

            {/* RIGHT */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  mb: 1,
                }}
              >
                Preview
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  minHeight: 320,
                  borderRadius: 2,
                  border:
                    "1px dashed rgba(0,0,0,0.25)",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  overflow: "hidden",
                  backgroundColor:
                    "rgba(0,0,0,0.02)",
                }}
              >
                {previewUrl ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Uploaded animal"
                    sx={{
                      width:
                        "100%",
                      maxHeight: 450,
                      objectFit:
                        "contain",
                    }}
                  />
                ) : (
                  <Typography
                    color="text.secondary"
                  >
                    Upload an animal image
                    to preview it here.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ======================================================
          YOLO
      ====================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            AI Animal Identification
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            YOLO livestock detection
          </Typography>

          {!aiResult ? (
            <Typography
              color="text.secondary"
            >
              Upload and analyse an animal image
              to see the YOLO result.
            </Typography>
          ) : (
            <Grid
              container
              spacing={2}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      YOLO
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      {normalizeStatus(
                        getYOLO(
                          aiResult
                        )?.status
                      ) ||
                        (yoloDetected
                          ? "Success"
                          : "Completed")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Detected Animal
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      {detectedSpecies ||
                        (yoloDetected
                          ? "Animal detected"
                          : "Not detected")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Confidence
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      {formatConfidence(
                        yoloConfidence
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Animals Detected
                    </Typography>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      {detectionCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* ======================================================
          CNN
      ====================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            Health & Disease Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            CNN image classification
          </Typography>

          {!aiResult ? (
            <Typography
              color="text.secondary"
            >
              CNN health classification will
              appear after image analysis.
            </Typography>
          ) : (
            <>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        CNN
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          mt: 1,
                        }}
                      >
                        {cnnDisplayStatus}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Animal Health
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          mt: 1,
                        }}
                      >
                        {cnnClassification
                          ? formatSpecies(
                              cnnClassification
                            )
                          : (
                              cnnDisplayStatus ===
                              "Low Confidence"
                                ? "Not available"
                                : health
                            )}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        Confidence:{" "}
                        {formatConfidence(
                          cnnConfidence
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* LOW CONFIDENCE WARNING */}

              {aiResult &&
                cnnDisplayStatus ===
                  "Low Confidence" && (
                  <Alert
                    severity="warning"
                    sx={{
                      mt: 2,
                    }}
                  >
                    CNN confidence is low.
                    Treat this result as
                    an AI indication, not a
                    confirmed diagnosis.
                  </Alert>
                )}

              {/* TOP PREDICTIONS */}

              {cnnPredictions.length >
                0 && (
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                    }}
                  >
                    Top CNN Predictions
                  </Typography>

                  {cnnPredictions
                    .slice(0, 5)
                    .map(
                      (
                        prediction,
                        index
                      ) => {
                        const label =
                          typeof prediction ===
                          "string"
                            ? prediction
                            : prediction?.class ||
                              prediction?.label ||
                              prediction?.prediction ||
                              prediction?.name ||
                              "Unknown";

                        const confidence =
                          typeof prediction ===
                          "object"
                            ? prediction?.confidence ??
                              prediction?.probability ??
                              prediction?.score
                            : null;

                        return (
                          <Box
                            key={`${label}-${index}`}
                            sx={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              py: 1,
                              borderBottom:
                                "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            <Typography>
                              #
                              {index +
                                1}{" "}
                              {formatSpecies(
                                label
                              )}
                            </Typography>

                            <Typography
                              fontWeight={
                                600
                              }
                            >
                              {formatConfidence(
                                confidence
                              )}
                            </Typography>
                          </Box>
                        );
                      }
                    )}
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ======================================================
          LIVE EDGE INFERENCE
      ====================================================== */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            Live Edge Inference
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Latest real AI response returned by the PashuSense
            backend. XGBoost model availability is shown separately
            from actual structured predictions.
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#0b1220",
              color: "#d1fae5",
              maxHeight: 360,
              overflow: "auto",
              fontFamily:
                '"Roboto Mono", "Courier New", monospace',
              fontSize: 12,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {aiResult
              ? JSON.stringify(aiResult, null, 2)
              : "Waiting for an AI image analysis..."}
          </Box>
        </CardContent>
      </Card>

      {/* ======================================================
          AI FARM ANALYSIS
      ====================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            AI Farm Analysis
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Automated insights from animal
            monitoring.
          </Typography>

          <Grid
            container
            spacing={3}
          >
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  mb: 1,
                }}
              >
                Behaviour
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {behaviour !== "Not available"
                  ? `Behaviour model: ${formatMLPrediction(
                      structuredBehaviourPrediction
                    )}`
                  : aiResult
                    ? "Behaviour model did not return a value."
                    : "Select an animal to run Behaviour ML."}
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  mb: 1,
                }}
              >
                Health
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {structuredHealthLabel ||
                  (aiResult
                    ? health
                    : "Select an animal to run Health ML.")}
              </Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  mb: 1,
                }}
              >
                Activity
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {structuredActivity !== null
                  ? `Activity / behaviour score: ${structuredActivity}`
                  : aiResult
                    ? activity
                    : "Select an animal to run Activity ML."}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ======================================================
          GROWTH & WEIGHT
      ====================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 0.5,
            }}
          >
            Growth & Weight
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Species-specific farm intelligence
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              mt: 2,
            }}
          >
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  border:
                    "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Animal Record
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {selectedAnimal
                    ? "Linked"
                    : "Not linked"}
                </Typography>
              </Box>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  border:
                    "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Current Weight
                </Typography>

                <Typography
                  fontWeight={700}
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {getAnimalWeight(
                    selectedAnimal
                  ) !== null
                    ? `${getAnimalWeight(
                        selectedAnimal
                      )} kg`
                    : "Not available"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ======================================================
          XGBOOST / STRUCTURED ML
      ====================================================== */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 0.5 }}
          >
            Structured ML Prediction Engine
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Real predictions from the loaded PashuSense
            structured ML models. These predictions use the
            selected animal record and the model's required
            feature pipeline.
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{
                p: 2,
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 2,
              }}>
                <Typography variant="body2" color="text.secondary">
                  Models available
                </Typography>
                <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                  {mlModels.length || xgboostAvailable || 0}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{
                p: 2,
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 2,
              }}>
                <Typography variant="body2" color="text.secondary">
                  Predictions returned
                </Typography>
                <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                  {structuredSuccessCount}
                  {mlLoading ? " • running..." : ""}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{
                p: 2,
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 2,
              }}>
                <Typography variant="body2" color="text.secondary">
                  Primary production model
                </Typography>
                <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                  {primaryProductionModel}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {mlLoading && (
            <Box sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}>
              <CircularProgress size={18} />
              <Typography variant="body2">
                Running structured ML models...
              </Typography>
            </Box>
          )}

          <Box sx={{
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}>
            {(
              mlModels.length
                ? mlModels
                : STRUCTURED_MODELS
            ).map((modelName) => {
              const item =
                mlResults?.[modelName];

              const prediction =
                extractMLPrediction(item);

              const success =
                item?.status === "success" &&
                prediction !== null;

              return (
                <Box
                  key={modelName}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1.2fr 1fr 1fr",
                    },
                    gap: 1,
                    p: 1.5,
                    borderBottom:
                      "1px solid rgba(0,0,0,0.07)",
                  }}
                >
                  <Typography fontWeight={600}>
                    {modelName}
                  </Typography>

                  <Typography variant="body2">
                    {item
                      ? formatMLPrediction(prediction)
                      : mlLoading
                        ? "Running..."
                        : "Not run"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color={
                      success
                        ? "success.main"
                        : "text.secondary"
                    }
                  >
                    {item?.status
                      ? normalizeStatus(
                          item.status
                        )
                      : "Waiting"}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Box sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "rgba(0,0,0,0.03)",
          }}>
            <Typography variant="body2" color="text.secondary">
              Behaviour prediction:{" "}
              <strong>
                {formatMLPrediction(
                  structuredBehaviourPrediction
                )}
              </strong>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Health prediction:{" "}
              <strong>
                {structuredHealthLabel ||
                  formatMLPrediction(
                    structuredHealthPrediction
                  )}
              </strong>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {primaryProductionModel} prediction:{" "}
              <strong>
                {formatMLPrediction(
                  extractMLPrediction(
                    primaryProductionML
                  )
                )}
              </strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* ======================================================
          DIGITAL TWIN STATUS
      ====================================================== */}

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              mb: 2,
            }}
          >
            Digital Twin Status
          </Typography>

          <Divider
            sx={{
              mb: 2,
            }}
          />

          <Grid
            container
            spacing={2}
          >
            {/* IMAGE */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Animal Image
              </Typography>

              <Typography
                fontWeight={600}
              >
                {selectedFile
                  ? "Complete"
                  : "Pending"}
              </Typography>
            </Grid>

            {/* YOLO */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                YOLO Animal Detection
              </Typography>

              <Typography
                fontWeight={600}
              >
                {!yoloRan
                  ? "Pending"
                  : yoloDetected
                  ? "Complete"
                  : "Completed - No animal detected"}
              </Typography>
            </Grid>

            {/* SPECIES */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Species Identification
              </Typography>

              <Typography
                fontWeight={600}
              >
                {!aiResult
                  ? "Pending"
                  : yoloSpeciesIdentified
                  ? "Complete"
                  : yoloDetected
                  ? "Animal detected - species unavailable"
                  : "Pending"}
              </Typography>
            </Grid>

            {/* CNN */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                CNN Health Analysis
              </Typography>

              <Typography
                fontWeight={600}
              >
                {!aiResult
                  ? "Pending"
                  : cnnDisplayStatus}
              </Typography>
            </Grid>

            {/* PROFILE */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Animal Profile
              </Typography>

              <Typography
                fontWeight={600}
              >
                {selectedAnimal
                  ? "Complete"
                  : "Pending"}
              </Typography>
            </Grid>

            {/* PRODUCTION */}

            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Species-specific Production
              </Typography>

              <Typography
                fontWeight={600}
              >
                {structuredSuccessCount > 0
                  ? `${structuredSuccessCount} model prediction(s) available`
                  : "Ready / Not run"}
              </Typography>
            </Grid>
          </Grid>

          {/* ====================================================
              HOW PASHUSENSE WORKS
          ==================================================== */}

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor:
                "rgba(0,0,0,0.03)",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              <strong>
                How PashuSense works:
              </strong>{" "}
              the uploaded image is sent to the
              real AI backend. YOLO performs
              livestock detection and returns
              detection information such as animal
              count, species and confidence when
              available. CNN performs image-based
              classification when an animal is
              detected and the model can produce a
              sufficiently confident result. A
              low-confidence CNN result should be
              treated as an AI indication rather
              than a confirmed diagnosis. Structured
              XGBoost models are separate from image
              analysis and are only marked as
              predicted when an actual structured
              prediction has been executed.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}