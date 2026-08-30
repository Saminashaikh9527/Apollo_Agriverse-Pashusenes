
// ============================================================
// src/api/axios.js
// Apollo AgriVerse - PashuSense
// Authenticated API client
// ============================================================

import axios from "axios";

const API_BASE_URL =
  "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "access_token"
      ) ||
      localStorage.getItem(
        "token"
      );

    console.log(
      "================================="
    );

    console.log(
      "API REQUEST"
    );

    console.log(
      "URL:",
      `${API_BASE_URL}${config.url}`
    );

    console.log(
      "METHOD:",
      config.method?.toUpperCase()
    );

    console.log(
      "TOKEN EXISTS:",
      Boolean(token)
    );

    console.log(
      "================================="
    );

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => {
    console.log(
      "================================="
    );

    console.log(
      "API RESPONSE"
    );

    console.log(
      "STATUS:",
      response.status
    );

    console.log(
      "DATA:",
      response.data
    );

    console.log(
      "================================="
    );

    return response;
  },

  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status
    );

    console.error(
      "API DATA:",
      error.response?.data
    );

    if (
      error.response?.status ===
      401
    ) {
      console.error(
        "Authentication failed."
      );

      /*
       * Do not redirect automatically here.
       * This prevents unwanted redirects during
       * page loading.
       */
    }

    return Promise.reject(
      error
    );
  }
);

export default api;

