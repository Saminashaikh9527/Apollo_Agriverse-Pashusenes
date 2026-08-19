const API_BASE_URL = "http://127.0.0.1:8000";

/* =========================================================
   COMMON API REQUEST
========================================================= */

async function apiRequest(endpoint, options = {}) {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    "";

  const headers = {
    Accept: "application/json",
    ...(options.body
      ? {
          "Content-Type": "application/json",
        }
      : {}),
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
    ...(options.headers || {}),
  };

  const url = `${API_BASE_URL}${endpoint}`;

  console.log("=================================");
  console.log("API REQUEST");
  console.log("URL:", url);
  console.log("METHOD:", options.method || "GET");
  console.log("=================================");

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    console.log("=================================");
    console.log("API RESPONSE");
    console.log("STATUS:", response.status);
    console.log("DATA:", data);
    console.log("=================================");

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        `Request failed with status ${response.status}`;

      throw new Error(
        typeof message === "string"
          ? message
          : JSON.stringify(message)
      );
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
}

/* =========================================================
   AUTHENTICATION
========================================================= */

/*
 * Login.jsx calls:
 *
 * loginUser({
 *   email: "...",
 *   password: "..."
 * })
 */

export async function loginUser(credentials) {
  console.log("=================================");
  console.log("LOGIN FUNCTION CALLED");
  console.log("=================================");

  if (
    !credentials ||
    typeof credentials !== "object" ||
    Array.isArray(credentials)
  ) {
    throw new Error(
      "Login data must be an object containing email and password."
    );
  }

  const email = String(
    credentials.email || ""
  ).trim();

  const password = String(
    credentials.password || ""
  );

  if (!email) {
    throw new Error("Email address is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  const payload = {
    email,
    password,
  };

  console.log("LOGIN PAYLOAD:", {
    email,
    password: "********",
  });

  /*
   * CONFIRMED FROM YOUR FASTAPI SWAGGER:
   *
   * POST /api/auth/login
   */

  const data = await apiRequest(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  console.log("LOGIN SUCCESS:", data);

  /* =====================================================
     SAVE JWT
  ===================================================== */

  if (data?.access_token) {
    localStorage.setItem(
      "access_token",
      data.access_token
    );

    localStorage.setItem(
      "token",
      data.access_token
    );

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    localStorage.setItem(
      "userEmail",
      email
    );
  }

  /* =====================================================
     SAVE USER
  ===================================================== */

  if (data?.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
  }

  return data;
}

/* =========================================================
   REGISTER
========================================================= */

export async function registerUser(userData) {
  console.log("REGISTER PAYLOAD:", userData);

  /*
   * CONFIRMED FROM FASTAPI SWAGGER:
   *
   * POST /api/auth/register
   */

  return apiRequest(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(userData),
    }
  );
}

/* =========================================================
   LOGOUT
========================================================= */

export function logoutUser() {
  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "authToken"
  );

  localStorage.removeItem(
    "isLoggedIn"
  );

  localStorage.removeItem(
    "userEmail"
  );

  localStorage.removeItem(
    "user"
  );
}

/* =========================================================
   BACKEND TEST
========================================================= */

export async function testBackendConnection() {
  return apiRequest(
    "/database-test"
  );
}

/* =========================================================
   FARMS
========================================================= */

export async function getFarms() {
  return apiRequest(
    "/api/farms/"
  );
}

export async function getFarm(farmId) {
  return apiRequest(
    `/api/farms/${farmId}`
  );
}

export async function createFarm(farmData) {
  return apiRequest(
    "/api/farms/",
    {
      method: "POST",
      body: JSON.stringify(farmData),
    }
  );
}

export async function updateFarm(
  farmId,
  farmData
) {
  return apiRequest(
    `/api/farms/${farmId}`,
    {
      method: "PUT",
      body: JSON.stringify(farmData),
    }
  );
}

export async function deleteFarm(farmId) {
  return apiRequest(
    `/api/farms/${farmId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   ANIMALS
========================================================= */

export async function getAnimals() {
  return apiRequest(
    "/api/animals/"
  );
}

export async function getAnimal(animalId) {
  return apiRequest(
    `/api/animals/${animalId}`
  );
}

export async function createAnimal(animalData) {
  return apiRequest(
    "/api/animals/",
    {
      method: "POST",
      body: JSON.stringify(animalData),
    }
  );
}

export async function updateAnimal(
  animalId,
  animalData
) {
  return apiRequest(
    `/api/animals/${animalId}`,
    {
      method: "PUT",
      body: JSON.stringify(animalData),
    }
  );
}

export async function deleteAnimal(animalId) {
  return apiRequest(
    `/api/animals/${animalId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   ANIMAL HEALTH
========================================================= */

export async function getHealthRecords() {
  return apiRequest(
    "/api/health/"
  );
}

export async function getHealthRecord(
  healthRecordId
) {
  return apiRequest(
    `/api/health/${healthRecordId}`
  );
}

export async function createHealthRecord(data) {
  return apiRequest(
    "/api/health/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateHealthRecord(
  healthRecordId,
  data
) {
  return apiRequest(
    `/api/health/${healthRecordId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteHealthRecord(
  healthRecordId
) {
  return apiRequest(
    `/api/health/${healthRecordId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   MILK PRODUCTION
========================================================= */

export async function getMilkRecords() {
  return apiRequest(
    "/api/milk/"
  );
}

export async function getMilkRecord(milkId) {
  return apiRequest(
    `/api/milk/${milkId}`
  );
}

export async function createMilkRecord(data) {
  return apiRequest(
    "/api/milk/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateMilkRecord(
  milkId,
  data
) {
  return apiRequest(
    `/api/milk/${milkId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteMilkRecord(milkId) {
  return apiRequest(
    `/api/milk/${milkId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   WOOL
========================================================= */

export async function getWoolRecords() {
  return apiRequest(
    "/api/wool/"
  );
}

export async function getWoolRecord(
  woolRecordId
) {
  return apiRequest(
    `/api/wool/${woolRecordId}`
  );
}

export async function createWoolRecord(data) {
  return apiRequest(
    "/api/wool/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateWoolRecord(
  woolRecordId,
  data
) {
  return apiRequest(
    `/api/wool/${woolRecordId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteWoolRecord(
  woolRecordId
) {
  return apiRequest(
    `/api/wool/${woolRecordId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   VACCINATION
========================================================= */

export async function getVaccinationRecords() {
  return apiRequest(
    "/api/vaccination/"
  );
}

export async function getVaccinationRecord(
  vaccinationId
) {
  return apiRequest(
    `/api/vaccination/${vaccinationId}`
  );
}

export async function createVaccinationRecord(
  data
) {
  return apiRequest(
    "/api/vaccination/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateVaccinationRecord(
  vaccinationId,
  data
) {
  return apiRequest(
    `/api/vaccination/${vaccinationId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteVaccinationRecord(
  vaccinationId
) {
  return apiRequest(
    `/api/vaccination/${vaccinationId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   FEED
========================================================= */

export async function getFeedRecords() {
  return apiRequest(
    "/api/feed/"
  );
}

export async function getFeedRecord(feedId) {
  return apiRequest(
    `/api/feed/${feedId}`
  );
}

export async function createFeedRecord(data) {
  return apiRequest(
    "/api/feed/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateFeedRecord(
  feedId,
  data
) {
  return apiRequest(
    `/api/feed/${feedId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function replaceFeedRecord(
  feedId,
  data
) {
  return apiRequest(
    `/api/feed/${feedId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteFeedRecord(feedId) {
  return apiRequest(
    `/api/feed/${feedId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   EGG
========================================================= */

export async function getEggRecords() {
  return apiRequest(
    "/api/egg/"
  );
}

export async function getEggRecord(eggId) {
  return apiRequest(
    `/api/egg/${eggId}`
  );
}

export async function createEggRecord(data) {
  return apiRequest(
    "/api/egg/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateEggRecord(
  eggId,
  data
) {
  return apiRequest(
    `/api/egg/${eggId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteEggRecord(eggId) {
  return apiRequest(
    `/api/egg/${eggId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   GROWTH
========================================================= */

export async function getGrowthRecords() {
  return apiRequest(
    "/api/growth/"
  );
}

export async function getGrowthRecord(growthId) {
  return apiRequest(
    `/api/growth/${growthId}`
  );
}

export async function createGrowthRecord(data) {
  return apiRequest(
    "/api/growth/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateGrowthRecord(
  growthId,
  data
) {
  return apiRequest(
    `/api/growth/${growthId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function replaceGrowthRecord(
  growthId,
  data
) {
  return apiRequest(
    `/api/growth/${growthId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteGrowthRecord(
  growthId
) {
  return apiRequest(
    `/api/growth/${growthId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  loginUser,
  registerUser,
  logoutUser,
  testBackendConnection,

  getFarms,
  getFarm,
  createFarm,
  updateFarm,
  deleteFarm,

  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,

  getHealthRecords,
  getHealthRecord,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,

  getMilkRecords,
  getMilkRecord,
  createMilkRecord,
  updateMilkRecord,
  deleteMilkRecord,

  getWoolRecords,
  getWoolRecord,
  createWoolRecord,
  updateWoolRecord,
  deleteWoolRecord,

  getVaccinationRecords,
  getVaccinationRecord,
  createVaccinationRecord,
  updateVaccinationRecord,
  deleteVaccinationRecord,

  getFeedRecords,
  getFeedRecord,
  createFeedRecord,
  updateFeedRecord,
  replaceFeedRecord,
  deleteFeedRecord,

  getEggRecords,
  getEggRecord,
  createEggRecord,
  updateEggRecord,
  deleteEggRecord,

  getGrowthRecords,
  getGrowthRecord,
  createGrowthRecord,
  updateGrowthRecord,
  replaceGrowthRecord,
  deleteGrowthRecord,
};