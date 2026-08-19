// =====================================================
// AGROLENS PLF - CENTRAL API CLIENT
// =====================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// =====================================================
// COMMON API REQUEST
// =====================================================

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach JWT token
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // ===================================================
  // AUTHENTICATION ERROR
  // ===================================================

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error(
      "Your session has expired. Please login again."
    );
  }

  // ===================================================
  // READ RESPONSE
  // ===================================================

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // ===================================================
  // API ERROR
  // ===================================================

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.message ||
        `API request failed: ${response.status}`
    );
  }

  return data;
}

// =====================================================
// BASIC HTTP METHODS
// =====================================================

export function get(endpoint) {
  return apiRequest(endpoint, {
    method: "GET",
  });
}

export function post(endpoint, body) {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function put(endpoint, body) {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function patch(endpoint, body) {
  return apiRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function del(endpoint) {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
}

// =====================================================
// REPORTS & ANALYTICS
// =====================================================

export async function getReportOverview(farmId = 7) {
  return get(`/api/reports/overview?farm_id=${farmId}`);
}

export async function getHealthSummary(farmId = 7) {
  return get(`/api/reports/health-summary?farm_id=${farmId}`);
}

export async function getProductionSummary(farmId = 7) {
  return get(`/api/reports/production?farm_id=${farmId}`);
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default apiRequest;