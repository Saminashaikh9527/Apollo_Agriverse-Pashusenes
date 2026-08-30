
// ============================================================
// src/api/backend.js
// Apollo AgriVerse - PashuSense
// CENTRAL FRONTEND BACKEND API
// ============================================================

import axios from "axios";

// ============================================================
// API CONFIG
// ============================================================

export const API_BASE_URL = "http://127.0.0.1:8000";

// ============================================================
// AXIOS INSTANCE
// ============================================================

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

// ============================================================
// AUTH TOKEN HELPERS
// ============================================================

export function getAuthToken() {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  ).trim();
}

export function saveAuthToken(token) {
  if (!token) return;

  const cleanToken = String(token).trim();

  if (!cleanToken) return;

  localStorage.setItem("access_token", cleanToken);
  localStorage.setItem("token", cleanToken);
  localStorage.setItem("authToken", cleanToken);
}

export function clearAuthToken() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  localStorage.removeItem("userEmail");
}

// ============================================================
// AXIOS REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    config.headers.Accept = "application/json";

    const token = getAuthToken();

    // Never send an empty Authorization header.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// AXIOS RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn(
        "401 Unauthorized:",
        error?.config?.url
      );

      /*
       * Do not automatically redirect here.
       *
       * Login itself can return 401.
       * Automatically clearing the token here can also
       * create redirect loops.
       */
    }

    return Promise.reject(error);
  }
);

// ============================================================
// COMMON ERROR MESSAGE
// ============================================================

export function getApiErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data?.detail) {
    if (Array.isArray(data.detail)) {
      return data.detail
        .map(
          (item) =>
            item?.msg ||
            item?.message ||
            String(item)
        )
        .join(", ");
    }

    return String(data.detail);
  }

  if (data?.message) {
    return String(data.message);
  }

  if (error?.message) {
    return error.message;
  }

  return "Request failed.";
}

// ============================================================
// GENERIC API REQUEST
// ============================================================

export async function apiRequest(
  endpoint,
  options = {}
) {
  const method = String(
    options.method || "GET"
  ).toUpperCase();

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const token = getAuthToken();

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    delete headers.Authorization;
  }

  const body = options.body;

  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    let data = null;

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      data = await response.json();
    } else {
      const text =
        await response.text();

      data = text || null;
    }

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        `Request failed with status ${response.status}`;

      const error = new Error(
        Array.isArray(message)
          ? message
              .map(
                (item) =>
                  item?.msg ||
                  item?.message ||
                  String(item)
              )
              .join(", ")
          : String(message)
      );

      error.status = response.status;

      error.response = {
        status: response.status,
        data,
      };

      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      `API REQUEST ERROR: ${method} ${url}`,
      error
    );

    throw error;
  }
}

// ============================================================
// AUTHENTICATION
// ============================================================

// ============================================================
// REGISTER
// ============================================================

export async function registerUser(userData) {
  const name = String(
    userData?.name ||
      userData?.full_name ||
      ""
  ).trim();

  const email = String(
    userData?.email || ""
  ).trim();

  const password = String(
    userData?.password || ""
  );

  const role = String(
    userData?.role || "farmer"
  ).trim();

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  try {
    const response = await api.post(
      "/api/auth/register",
      {
        name,
        email,
        password,
        role,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error)
    );
  }
}

// ============================================================
// LOGIN
// ============================================================

export async function loginUser(credentials) {
  const email = String(
    credentials?.email || ""
  ).trim();

  const password = String(
    credentials?.password || ""
  );

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  try {
    const response = await api.post(
      "/api/auth/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type":
            "application/json",
          Accept: "application/json",
        },
      }
    );

    const data = response.data;

    // --------------------------------------------------------
    // SAVE TOKEN
    // --------------------------------------------------------

    const token =
      data?.access_token ||
      data?.token ||
      data?.accessToken;

    if (token) {
      saveAuthToken(token);
    }

    // --------------------------------------------------------
    // SAVE USER
    // --------------------------------------------------------

    if (data?.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    localStorage.setItem(
      "userEmail",
      email
    );

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    return data;
  } catch (error) {
    if (
      error?.response?.status === 401
    ) {
      throw new Error(
        error?.response?.data?.detail ||
          "Invalid email or password."
      );
    }

    throw new Error(
      getApiErrorMessage(error)
    );
  }
}

// ============================================================
// LOGOUT
// ============================================================

export function logoutUser() {
  clearAuthToken();

  window.location.href = "/login";
}

// ============================================================
// CURRENT USER
// ============================================================

export async function getCurrentUser() {
  try {
    const response = await api.get(
      "/api/auth/me"
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error)
    );
  }
}

// ============================================================
// FARMS
// ============================================================

export async function getFarms() {
  const response = await api.get(
    "/api/farms/"
  );

  return response.data;
}

export async function getFarm(farmId) {
  if (
    farmId === null ||
    farmId === undefined ||
    String(farmId).trim() === ""
  ) {
    throw new Error("Farm ID is required.");
  }

  const response = await api.get(
    `/api/farms/${encodeURIComponent(
      farmId
    )}`
  );

  return response.data;
}

// ============================================================
// ANIMALS
// ============================================================

export async function getAnimals(
  farmId = null
) {
  const url =
    farmId !== null &&
    farmId !== undefined &&
    String(farmId).trim() !== ""
      ? `/api/animals/?farm_id=${encodeURIComponent(
          farmId
        )}`
      : "/api/animals/";

  const response = await api.get(url);

  return response.data;
}

export async function getFarmAnimals(
  farmId = null
) {
  const response =
    await getAnimals(farmId);

  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(response?.animals)
  ) {
    return response.animals;
  }

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  return [];
}

export async function getAnimal(animalId) {
  if (
    animalId === null ||
    animalId === undefined ||
    String(animalId).trim() === ""
  ) {
    throw new Error("Animal ID is required.");
  }

  const response = await api.get(
    `/api/animals/${encodeURIComponent(
      animalId
    )}`
  );

  return response.data;
}

export async function createAnimal(
  animalData
) {
  const response = await api.post(
    "/api/animals/",
    animalData
  );

  return response.data;
}

export async function updateAnimal(
  animalId,
  animalData
) {
  const response = await api.put(
    `/api/animals/${encodeURIComponent(
      animalId
    )}`,
    animalData
  );

  return response.data;
}

export async function patchAnimal(
  animalId,
  animalData
) {
  const response = await api.patch(
    `/api/animals/${encodeURIComponent(
      animalId
    )}`,
    animalData
  );

  return response.data;
}

export async function deleteAnimal(
  animalId
) {
  const response = await api.delete(
    `/api/animals/${encodeURIComponent(
      animalId
    )}`
  );

  return response.data;
}

// ============================================================
// HEALTH
// ============================================================

export async function getHealthRecords(
  animalId = null
) {
  const url =
    animalId !== null &&
    animalId !== undefined &&
    String(animalId).trim() !== ""
      ? `/api/health/?animal_id=${encodeURIComponent(
          animalId
        )}`
      : "/api/health/";

  const response = await api.get(url);

  return response.data;
}

export async function getHealthRecord(id) {
  const response = await api.get(
    `/api/health/${encodeURIComponent(id)}`
  );

  return response.data;
}

export async function createHealthRecord(
  data
) {
  const response = await api.post(
    "/api/health/",
    data
  );

  return response.data;
}

export async function updateHealthRecord(
  id,
  data
) {
  const response = await api.put(
    `/api/health/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function patchHealthRecord(
  id,
  data
) {
  const response = await api.patch(
    `/api/health/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function deleteHealthRecord(
  id
) {
  const response = await api.delete(
    `/api/health/${encodeURIComponent(id)}`
  );

  return response.data;
}

// ============================================================
// MILK
// ============================================================

export async function getMilkRecords(
  animalId = null
) {
  const url =
    animalId !== null &&
    animalId !== undefined &&
    String(animalId).trim() !== ""
      ? `/api/milk/?animal_id=${encodeURIComponent(
          animalId
        )}`
      : "/api/milk/";

  const response = await api.get(url);

  return response.data;
}

export async function getMilkRecord(id) {
  const response = await api.get(
    `/api/milk/${encodeURIComponent(id)}`
  );

  return response.data;
}

export async function createMilkRecord(
  data
) {
  const response = await api.post(
    "/api/milk/",
    data
  );

  return response.data;
}

export async function updateMilkRecord(
  id,
  data
) {
  const response = await api.put(
    `/api/milk/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function patchMilkRecord(
  id,
  data
) {
  const response = await api.patch(
    `/api/milk/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function deleteMilkRecord(id) {
  const response = await api.delete(
    `/api/milk/${encodeURIComponent(id)}`
  );

  return response.data;
}

// ============================================================
// FEED
// ============================================================

export async function getFeedRecords(
  animalId = null
) {
  const url =
    animalId !== null &&
    animalId !== undefined &&
    String(animalId).trim() !== ""
      ? `/api/feed/?animal_id=${encodeURIComponent(
          animalId
        )}`
      : "/api/feed/";

  const response = await api.get(url);

  return response.data;
}

export async function getFeedRecord(id) {
  const response = await api.get(
    `/api/feed/${encodeURIComponent(id)}`
  );

  return response.data;
}

export async function createFeedRecord(
  data
) {
  const response = await api.post(
    "/api/feed/",
    data
  );

  return response.data;
}

export async function updateFeedRecord(
  id,
  data
) {
  const response = await api.put(
    `/api/feed/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function patchFeedRecord(
  id,
  data
) {
  const response = await api.patch(
    `/api/feed/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function deleteFeedRecord(id) {
  const response = await api.delete(
    `/api/feed/${encodeURIComponent(id)}`
  );

  return response.data;
}

// ============================================================
// EGG
// ============================================================

export async function getEggRecords(
  animalId = null
) {
  const url =
    animalId !== null &&
    animalId !== undefined &&
    String(animalId).trim() !== ""
      ? `/api/egg/?animal_id=${encodeURIComponent(
          animalId
        )}`
      : "/api/egg/";

  const response = await api.get(url);

  return response.data;
}

export async function getEggRecord(id) {
  const response = await api.get(
    `/api/egg/${encodeURIComponent(id)}`
  );

  return response.data;
}

export async function createEggRecord(data) {
  const response = await api.post(
    "/api/egg/",
    data
  );

  return response.data;
}

export async function updateEggRecord(
  id,
  data
) {
  const response = await api.put(
    `/api/egg/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function patchEggRecord(
  id,
  data
) {
  const response = await api.patch(
    `/api/egg/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function deleteEggRecord(id) {
  const response = await api.delete(
    `/api/egg/${encodeURIComponent(id)}`
  );

  return response.data;
}

// ============================================================
// WOOL
// ============================================================

export async function getWoolRecords(
  animalId = null
) {
  const url =
    animalId !== null &&
    animalId !== undefined &&
    String(animalId).trim() !== ""
      ? `/api/wool/?animal_id=${encodeURIComponent(
          animalId
        )}`
      : "/api/wool/";

  const response = await api.get(url);

  return response.data;
}

export async function getWoolRecord(id) {
  const response = await api.get(
    `/api/wool/${encodeURIComponent(id)}`
  );

  return response.data;
}

export async function createWoolRecord(data) {
  const response = await api.post(
    "/api/wool/",
    data
  );

  return response.data;
}

export async function updateWoolRecord(
  id,
  data
) {
  const response = await api.put(
    `/api/wool/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function patchWoolRecord(
  id,
  data
) {
  const response = await api.patch(
    `/api/wool/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function deleteWoolRecord(id) {
  const response = await api.delete(
    `/api/wool/${encodeURIComponent(id)}`
  );

  return response.data;
}

// ============================================================
// VACCINATION
// ============================================================

export async function getVaccinationRecords(
  animalId = null
) {
  const url =
    animalId !== null &&
    animalId !== undefined &&
    String(animalId).trim() !== ""
      ? `/api/vaccination/?animal_id=${encodeURIComponent(
          animalId
        )}`
      : "/api/vaccination/";

  const response = await api.get(url);

  return response.data;
}

export async function getVaccinationRecord(id) {
  const response = await api.get(
    `/api/vaccination/${encodeURIComponent(id)}`
  );

  return response.data;
}

export async function createVaccinationRecord(
  data
) {
  const response = await api.post(
    "/api/vaccination/",
    data
  );

  return response.data;
}

export async function updateVaccinationRecord(
  id,
  data
) {
  const response = await api.put(
    `/api/vaccination/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function patchVaccinationRecord(
  id,
  data
) {
  const response = await api.patch(
    `/api/vaccination/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function deleteVaccinationRecord(
  id
) {
  const response = await api.delete(
    `/api/vaccination/${encodeURIComponent(id)}`
  );

  return response.data;
}

// ============================================================
// PREDICTIONS DATABASE
// ============================================================

export async function getPredictions() {
  const response = await api.get(
    "/api/predictions/"
  );

  return response.data;
}

export async function getPrediction(id) {
  const response = await api.get(
    `/api/predictions/${encodeURIComponent(id)}`
  );

  return response.data;
}

export async function createPrediction(data) {
  const response = await api.post(
    "/api/predictions/",
    data
  );

  return response.data;
}

export async function updatePrediction(
  id,
  data
) {
  const response = await api.put(
    `/api/predictions/${encodeURIComponent(id)}`,
    data
  );

  return response.data;
}

export async function deletePrediction(id) {
  const response = await api.delete(
    `/api/predictions/${encodeURIComponent(id)}`
  );

  return response.data;
}

// ============================================================
// ML MODELS
// ============================================================

export async function getMLModels() {
  const endpoints = [
    "/api/ml-predictions/models",
    "/api/ml-predictions/models/",
    "/api/predictions/models",
    "/api/predictions/models/",
    "/api/ml/models",
    "/api/ml/models/",
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response =
        await api.get(endpoint);

      return response.data;
    } catch (error) {
      lastError = error;

      if (
        error?.response?.status === 404
      ) {
        continue;
      }

      throw error;
    }
  }

  throw (
    lastError ||
    new Error(
      "ML models endpoint not found."
    )
  );
}

// ============================================================
// GET ALL ML FEATURES
// ============================================================

export async function getMLFeatures() {
  try {
    const response =
      await api.get(
        "/api/ml-predictions/features"
      );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error)
    );
  }
}

// ============================================================
// GET FEATURES FOR ONE MODEL
// ============================================================

export async function getMLModelFeatures(
  modelName
) {
  if (
    !modelName ||
    String(modelName).trim() === ""
  ) {
    throw new Error(
      "ML model name is required."
    );
  }

  const cleanModelName =
    String(modelName).trim();

  try {
    const response =
      await api.get(
        `/api/ml-predictions/features/${encodeURIComponent(
          cleanModelName
        )}`
      );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error)
    );
  }
}

// ============================================================
// ML STATUS
// ============================================================

export async function getMLStatus() {
  try {
    const response =
      await api.get(
        "/api/ml-predictions/status"
      );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error)
    );
  }
}

// ============================================================
// LOADED MODELS
// ============================================================

export async function getLoadedMLModels() {
  try {
    const response =
      await api.get(
        "/api/ml-predictions/loaded-models"
      );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error)
    );
  }
}

// ============================================================
// PRODUCTION / ML PREDICTION
// ============================================================
//
// IMPORTANT
//
// NO animal_id is sent.
//
// Frontend sends:
//
// {
//   model_name: "milk",
//   data: {
//     Index: 1,
//     "Days In Milk": 120,
//     "Lactation Number": 2
//   }
// }
//
// ============================================================

export async function predictProduction(
  modelName,
  features = {}
) {
  // ----------------------------------------------------------
  // MODEL
  // ----------------------------------------------------------

  if (
    !modelName ||
    String(modelName).trim() === ""
  ) {
    throw new Error(
      "ML model name is required."
    );
  }

  const cleanModelName =
    String(modelName).trim();

  // ----------------------------------------------------------
  // FEATURES MUST BE OBJECT
  // ----------------------------------------------------------

  if (
    features === null ||
    typeof features !== "object" ||
    Array.isArray(features)
  ) {
    throw new Error(
      "Prediction features must be an object."
    );
  }

  // ----------------------------------------------------------
  // COPY FEATURES
  // ----------------------------------------------------------

  const predictionFeatures = {
    ...features,
  };

  // ----------------------------------------------------------
  // NEVER SEND ANIMAL ID
  // ----------------------------------------------------------

  delete predictionFeatures.animal_id;
  delete predictionFeatures.animalId;
  delete predictionFeatures.animalID;
  delete predictionFeatures.Animal_ID;
  delete predictionFeatures["Animal ID"];

  // ----------------------------------------------------------
  // REMOVE EMPTY VALUES
  // ----------------------------------------------------------

  Object.keys(
    predictionFeatures
  ).forEach((key) => {
    const value =
      predictionFeatures[key];

    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      delete predictionFeatures[key];
    }
  });

  // ----------------------------------------------------------
  // REQUIRE AT LEAST ONE FEATURE
  // ----------------------------------------------------------

  if (
    Object.keys(
      predictionFeatures
    ).length === 0
  ) {
    throw new Error(
      "Please enter prediction features."
    );
  }

  // ----------------------------------------------------------
  // SEND ONLY MODEL + FEATURES
  // ----------------------------------------------------------

  const payload = {
    model_name: cleanModelName,
    data: predictionFeatures,
  };

  console.log(
    "================================="
  );

  console.log(
    "ML PREDICTION REQUEST"
  );

  console.log(
    "ENDPOINT:",
    "/api/ml-predictions/predict"
  );

  console.log(
    "MODEL:",
    cleanModelName
  );

  console.log(
    "FEATURES:",
    predictionFeatures
  );

  console.log(
    "PAYLOAD:",
    payload
  );

  console.log(
    "================================="
  );

  try {
    const response =
      await api.post(
        "/api/ml-predictions/predict",
        payload
      );

    console.log(
      "ML PREDICTION SUCCESS:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "ML PREDICTION FAILED:",
      error?.response?.data ||
        error?.message
    );

    throw new Error(
      getApiErrorMessage(error)
    );
  }
}

// ============================================================
// AI IMAGE UPLOAD
// ============================================================

export async function uploadAIImage(
  file,
  animalId = null
) {
  if (!file) {
    throw new Error(
      "Animal image is required."
    );
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  if (
    animalId !== null &&
    animalId !== undefined &&
    String(animalId).trim() !== ""
  ) {
    formData.append(
      "animal_id",
      String(animalId)
    );
  }

  const response =
    await api.post(
      "/api/ai/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
}

// ============================================================
// AI HEALTH PREDICTION
// ============================================================

export async function predictAnimalHealth(
  file,
  animalId = null
) {
  if (!file) {
    throw new Error(
      "Animal image is required."
    );
  }

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  if (
    animalId !== null &&
    animalId !== undefined &&
    String(animalId).trim() !== ""
  ) {
    formData.append(
      "animal_id",
      String(animalId)
    );
  }

  const response =
    await api.post(
      "/api/ai/health-predict",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
}

// ============================================================
// DIGITAL TWIN
// ============================================================

export async function getDigitalTwins() {
  const response =
    await api.get(
      "/api/digital-twin/"
    );

  return response.data;
}

export async function getDigitalTwinByAnimal(
  animalId
) {
  if (
    animalId === null ||
    animalId === undefined ||
    String(animalId).trim() === ""
  ) {
    throw new Error(
      "Animal ID is required."
    );
  }

  const response =
    await api.get(
      `/api/digital-twin/animal/${encodeURIComponent(
        animalId
      )}`
    );

  return response.data;
}

// ============================================================
// REPORT / DASHBOARD
// ============================================================

export async function getReportOverview() {
  const endpoints = [
    "/api/reports/overview",
    "/api/reports/overview/",
    "/api/dashboard/overview",
  ];

  for (const endpoint of endpoints) {
    try {
      const response =
        await api.get(endpoint);

      return response.data;
    } catch (error) {
      if (
        error?.response?.status === 404
      ) {
        continue;
      }

      throw error;
    }
  }

  return {};
}

export async function getHealthSummary() {
  const endpoints = [
    "/api/reports/health",
    "/api/reports/health/",
    "/api/dashboard/health",
  ];

  for (const endpoint of endpoints) {
    try {
      const response =
        await api.get(endpoint);

      return response.data;
    } catch (error) {
      if (
        error?.response?.status === 404
      ) {
        continue;
      }

      throw error;
    }
  }

  return {};
}

export async function getProductionSummary() {
  const endpoints = [
    "/api/reports/production",
    "/api/reports/production/",
    "/api/dashboard/production",
  ];

  for (const endpoint of endpoints) {
    try {
      const response =
        await api.get(endpoint);

      return response.data;
    } catch (error) {
      if (
        error?.response?.status === 404
      ) {
        continue;
      }

      throw error;
    }
  }

  return {};
}

// ============================================================
// BACKEND CONNECTION TEST
// ============================================================

export async function testBackendConnection() {
  return apiRequest(
    "/database-test",
    {
      method: "GET",
    }
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;

