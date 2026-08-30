
// ============================================================
// api.js
// Apollo Agriverse - PashuSense Frontend API Service
// ============================================================

import axios from "axios";

// ============================================================
// CONFIGURATION
// ============================================================

export const API_BASE_URL = "http://127.0.0.1:8000/api";

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// ============================================================
// TOKEN HELPERS
// ============================================================

const TOKEN_KEYS = [
    "access_token",
    "token",
    "jwt_token",
    "auth_token",
];

export function getAuthToken() {
    for (const key of TOKEN_KEYS) {
        const token = localStorage.getItem(key);

        if (token && token.trim()) {
            return token.trim();
        }
    }

    return null;
}

export function setAuthToken(token) {
    if (!token) {
        return;
    }

    localStorage.setItem("access_token", token);
}

export function clearAuthToken() {
    TOKEN_KEYS.forEach((key) => {
        localStorage.removeItem(key);
    });
}

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            console.warn("Authentication failed: token is invalid or expired.");

            // Remove invalid token
            clearAuthToken();

            // Do NOT automatically redirect here.
            // Let React handle the login/session UI.
        }

        return Promise.reject(error);
    }
);

// ============================================================
// GENERIC API REQUEST
// ============================================================

export async function apiRequest(
    endpoint,
    options = {}
) {
    try {
        const method = options.method || "GET";

        const config = {
            url: endpoint,
            method,
            params: options.params,
            data: options.data,
            headers: options.headers,
        };

        const response = await api.request(config);

        return response.data;
    } catch (error) {
        const status = error?.response?.status;
        const data = error?.response?.data;

        console.error("API ERROR:", status || error.message);
        console.error("API DATA:", data);

        if (status === 401) {
            throw new Error(
                "Your session has expired. Please login again."
            );
        }

        if (status === 404) {
            throw new Error(
                "API endpoint not found. Please check the backend route."
            );
        }

        if (status === 422) {
            throw new Error(
                data?.detail
                    ? JSON.stringify(data.detail)
                    : "Invalid request data."
            );
        }

        if (status >= 500) {
            throw new Error(
                "Backend server error. Please check the FastAPI server."
            );
        }

        throw new Error(
            data?.detail ||
            data?.message ||
            error.message ||
            "API request failed."
        );
    }
}

// ============================================================
// AUTHENTICATION
// ============================================================

export async function loginUser(email, password) {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        data: {
            email: email.trim(),
            password,
        },
    });

    // Support common FastAPI JWT response formats
    const token =
        data?.access_token ||
        data?.token ||
        data?.jwt_token;

    if (token) {
        setAuthToken(token);
    }

    return data;
}

export async function registerUser(userData) {
    return await apiRequest("/auth/register", {
        method: "POST",
        data: userData,
    });
}

export function logoutUser() {
    clearAuthToken();
}

// ============================================================
// AUTH CHECK
// ============================================================

export async function checkAuthentication() {
    const token = getAuthToken();

    if (!token) {
        return false;
    }

    try {
        // If your backend does not have a /auth/me endpoint,
        // token existence is used as the local check.
        return true;
    } catch {
        return false;
    }
}

// ============================================================
// ANIMALS
// ============================================================

export async function getAnimals(farmId = null) {
    const params = {};

    if (farmId !== null && farmId !== undefined) {
        params.farm_id = farmId;
    }

    return await apiRequest("/animals/", {
        method: "GET",
        params,
    });
}

export async function getAnimal(animalId) {
    return await apiRequest(`/animals/${animalId}`, {
        method: "GET",
    });
}

export async function createAnimal(animalData) {
    return await apiRequest("/animals/", {
        method: "POST",
        data: animalData,
    });
}

export async function updateAnimal(animalId, animalData) {
    return await apiRequest(`/animals/${animalId}`, {
        method: "PUT",
        data: animalData,
    });
}

export async function deleteAnimal(animalId) {
    return await apiRequest(`/animals/${animalId}`, {
        method: "DELETE",
    });
}

// ============================================================
// FARMS
// ============================================================

export async function getFarms() {
    return await apiRequest("/farms/", {
        method: "GET",
    });
}

export async function getFarm(farmId) {
    return await apiRequest(`/farms/${farmId}`, {
        method: "GET",
    });
}

export async function createFarm(farmData) {
    return await apiRequest("/farms/", {
        method: "POST",
        data: farmData,
    });
}

// ============================================================
// HEALTH
// ============================================================

export async function getHealthRecords(farmId = null) {
    const params = {};

    if (farmId !== null && farmId !== undefined) {
        params.farm_id = farmId;
    }

    return await apiRequest("/health/", {
        method: "GET",
        params,
    });
}

export async function getAnimalHealth(animalId) {
    return await apiRequest(`/health/animal/${animalId}`, {
        method: "GET",
    });
}

export async function createHealthRecord(data) {
    return await apiRequest("/health/", {
        method: "POST",
        data,
    });
}

// ============================================================
// MILK
// ============================================================

export async function getMilkRecords(farmId = null) {
    const params = {};

    if (farmId !== null && farmId !== undefined) {
        params.farm_id = farmId;
    }

    return await apiRequest("/milk/", {
        method: "GET",
        params,
    });
}

export async function createMilkRecord(data) {
    return await apiRequest("/milk/", {
        method: "POST",
        data,
    });
}

// ============================================================
// EGG
// ============================================================

export async function getEggRecords(farmId = null) {
    const params = {};

    if (farmId !== null && farmId !== undefined) {
        params.farm_id = farmId;
    }

    return await apiRequest("/egg/", {
        method: "GET",
        params,
    });
}

export async function getEggProduction(farmId = null) {
    return await getEggRecords(farmId);
}

export async function createEggRecord(data) {
    return await apiRequest("/egg/", {
        method: "POST",
        data,
    });
}

// ============================================================
// FEED
// ============================================================

export async function getFeedRecords(farmId = null) {
    const params = {};

    if (farmId !== null && farmId !== undefined) {
        params.farm_id = farmId;
    }

    return await apiRequest("/feed/", {
        method: "GET",
        params,
    });
}

export async function createFeedRecord(data) {
    return await apiRequest("/feed/", {
        method: "POST",
        data,
    });
}

// ============================================================
// WOOL
// ============================================================

export async function getWoolRecords(farmId = null) {
    const params = {};

    if (farmId !== null && farmId !== undefined) {
        params.farm_id = farmId;
    }

    return await apiRequest("/wool/", {
        method: "GET",
        params,
    });
}

export async function createWoolRecord(data) {
    return await apiRequest("/wool/", {
        method: "POST",
        data,
    });
}

// ============================================================
// VACCINATION
// ============================================================

export async function getVaccinationRecords(farmId = null) {
    const params = {};

    if (farmId !== null && farmId !== undefined) {
        params.farm_id = farmId;
    }

    return await apiRequest("/vaccination/", {
        method: "GET",
        params,
    });
}

export async function createVaccinationRecord(data) {
    return await apiRequest("/vaccination/", {
        method: "POST",
        data,
    });
}

// ============================================================
// GROWTH
// ============================================================

export async function getGrowthRecords(farmId = null) {
    const params = {};

    if (farmId !== null && farmId !== undefined) {
        params.farm_id = farmId;
    }

    return await apiRequest("/growth/", {
        method: "GET",
        params,
    });
}

// ============================================================
// REPORTS
// ============================================================

export async function getReportOverview(farmId = 7) {
    return await apiRequest("/reports/overview", {
        method: "GET",
        params: {
            farm_id: farmId,
        },
    });
}

export async function getHealthSummary(farmId = 7) {
    return await apiRequest("/reports/health-summary", {
        method: "GET",
        params: {
            farm_id: farmId,
        },
    });
}

export async function getProductionSummary(farmId = 7) {
    return await apiRequest("/reports/production", {
        method: "GET",
        params: {
            farm_id: farmId,
        },
    });
}

// ============================================================
// REPORT ALIASES
// ============================================================

export async function getReportHealthSummary(farmId = 7) {
    return await getHealthSummary(farmId);
}

export async function getReportProduction(farmId = 7) {
    return await getProductionSummary(farmId);
}

// ============================================================
// AI IMAGE UPLOAD
// ============================================================

export async function uploadAIImage(file) {
    if (!file) {
        throw new Error("No image file selected.");
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
        const token = getAuthToken();

        const headers = {};

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        // Do NOT manually set Content-Type.
        // Browser/Axios will set multipart/form-data boundary.
        const response = await api.post(
            "/ai/upload",
            formData,
            {
                headers,
                timeout: 120000,
            }
        );

        return response.data;
    } catch (error) {
        const status = error?.response?.status;
        const data = error?.response?.data;

        console.error("AI UPLOAD ERROR:", status);
        console.error("AI UPLOAD DATA:", data);

        if (status === 401) {
            clearAuthToken();
            throw new Error(
                "Your session has expired. Please login again."
            );
        }

        throw new Error(
            data?.detail ||
            data?.message ||
            "AI image upload failed."
        );
    }
}

// ============================================================
// ML PREDICTIONS
// ============================================================

export async function getMLPredictions() {
    return await apiRequest("/ml-predictions/", {
        method: "GET",
    });
}

export async function getMLPrediction(predictionId) {
    return await apiRequest(
        `/ml-predictions/${predictionId}`,
        {
            method: "GET",
        }
    );
}

export async function createMLPrediction(data) {
    return await apiRequest("/ml-predictions/", {
        method: "POST",
        data,
    });
}

export async function runMLPrediction(data) {
    return await apiRequest("/ml-predictions/predict", {
        method: "POST",
        data,
    });
}

// ============================================================
// DIGITAL TWIN
// ============================================================

export async function getDigitalTwin(animalId) {
    return await apiRequest(
        `/digital-twin/${animalId}`,
        {
            method: "GET",
        }
    );
}

// ============================================================
// BACKEND CONNECTION TEST
// ============================================================

export async function testBackendConnection() {
    try {
        const response = await axios.get(
            "http://127.0.0.1:8000/",
            {
                timeout: 10000,
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "Backend connection test failed:",
            error
        );

        throw error;
    }
}

// ============================================================
// DATABASE TEST
// ============================================================

export async function testDatabaseConnection() {
    return await axios.get(
        "http://127.0.0.1:8000/database-test",
        {
            timeout: 10000,
        }
    ).then((response) => response.data);
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;

