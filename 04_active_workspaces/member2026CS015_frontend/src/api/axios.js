// =====================================================
// AGROLENS PLF - CENTRAL API HELPER
// =====================================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

// =====================================================
// GENERIC API REQUEST
// =====================================================

async function apiRequest(endpoint, options = {}) {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    "";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // ===================================================
  // JWT AUTHENTICATION
  // ===================================================

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Make sure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = `${API_BASE_URL}${cleanEndpoint}`;

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

    // ===================================================
    // READ RESPONSE
    // ===================================================

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

    // ===================================================
    // UNAUTHORIZED
    // ===================================================

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");

      window.location.href = "/login";

      throw new Error(
        "Your session has expired. Please login again."
      );
    }

    // ===================================================
    // API ERROR
    // ===================================================

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        `API request failed: ${response.status}`;

      throw new Error(
        typeof message === "string"
          ? message
          : JSON.stringify(message)
      );
    }

    // ===================================================
    // IMPORTANT
    //
    // Return Axios-style object because your existing
    // animals.js, farms.js, milk.js, etc. use:
    //
    // const response = await api.get(...)
    // return response.data
    // ===================================================

    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
}

// =====================================================
// GET
// =====================================================

export function get(endpoint) {
  return apiRequest(endpoint, {
    method: "GET",
  });
}

// =====================================================
// POST
// =====================================================

export function post(endpoint, body) {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// =====================================================
// PUT
// =====================================================

export function put(endpoint, body) {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// =====================================================
// PATCH
// =====================================================

export function patch(endpoint, body) {
  return apiRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

// =====================================================
// DELETE
// =====================================================

export function del(endpoint) {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
}

// =====================================================
// REPORTS & ANALYTICS
// =====================================================
//
// IMPORTANT:
// API_BASE_URL already contains /api
//
// Therefore use:
// /reports/overview
//
// NOT:
// /api/reports/overview
// =====================================================

export async function getReportOverview(farmId = 7) {
  return get(
    `/reports/overview?farm_id=${farmId}`
  );
}

export async function getHealthSummary(farmId = 7) {
  return get(
    `/reports/health-summary?farm_id=${farmId}`
  );
}

export async function getProductionSummary(farmId = 7) {
  return get(
    `/reports/production?farm_id=${farmId}`
  );
}

// =====================================================
// DEFAULT API OBJECT
// =====================================================

const api = {
  get,
  post,
  put,
  patch,
  delete: del,

  getReportOverview,
  getHealthSummary,
  getProductionSummary,
};

export default api;