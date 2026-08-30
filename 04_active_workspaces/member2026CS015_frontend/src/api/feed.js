
// ============================================================
// src/api/feed.js
// Apollo Agriverse - PashuSense
// Feed API
// ============================================================

import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

// ------------------------------------------------------------
// Get saved JWT token
// ------------------------------------------------------------

function getAuthToken() {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt_token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

// ------------------------------------------------------------
// Create authenticated request headers
// ------------------------------------------------------------

function getHeaders() {
  const token = getAuthToken();

  return {
    Accept: "application/json",
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

// ============================================================
// GET FEED RECORDS
// ============================================================

export async function getFeedRecords() {
  try {
    const token = getAuthToken();

    console.log("=================================");
    console.log("GET FEED RECORDS");
    console.log("URL:", `${API_BASE_URL}/api/feed/`);
    console.log(
      "JWT:",
      token ? "Available" : "NOT AVAILABLE"
    );
    console.log("=================================");

    const response = await axios.get(
      `${API_BASE_URL}/api/feed/`,
      {
        headers: getHeaders(),
      }
    );

    console.log("=================================");
    console.log("FEED API SUCCESS");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);
    console.log("=================================");

    return response.data;

  } catch (error) {

    console.error("=================================");
    console.error("FEED API ERROR");
    console.error(
      "STATUS:",
      error?.response?.status
    );
    console.error(
      "DATA:",
      error?.response?.data
    );
    console.error("ERROR:", error);
    console.error("=================================");

    if (
      error?.response?.status === 401
    ) {
      throw new Error(
        "Session expired. Please login again."
      );
    }

    if (
      error?.response?.status === 404
    ) {
      throw new Error(
        "Feed API endpoint was not found."
      );
    }

    throw new Error(
      error?.response?.data?.detail ||
      error?.message ||
      "Unable to load feed records."
    );
  }
}

// ============================================================
// CREATE FEED RECORD
// ============================================================

export async function createFeedRecord(data) {
  try {

    const response = await axios.post(
      `${API_BASE_URL}/api/feed/`,
      data,
      {
        headers: getHeaders(),
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "CREATE FEED ERROR:",
      error?.response?.data || error
    );

    if (
      error?.response?.status === 401
    ) {
      throw new Error(
        "Session expired. Please login again."
      );
    }

    throw new Error(
      error?.response?.data?.detail ||
      error?.message ||
      "Unable to create feed record."
    );
  }
}

// ============================================================
// UPDATE FEED RECORD
// ============================================================

export async function updateFeedRecord(
  feedId,
  data
) {
  try {

    const response = await axios.put(
      `${API_BASE_URL}/api/feed/${feedId}`,
      data,
      {
        headers: getHeaders(),
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "UPDATE FEED ERROR:",
      error?.response?.data || error
    );

    if (
      error?.response?.status === 401
    ) {
      throw new Error(
        "Session expired. Please login again."
      );
    }

    throw new Error(
      error?.response?.data?.detail ||
      error?.message ||
      "Unable to update feed record."
    );
  }
}

// ============================================================
// DELETE FEED RECORD
// ============================================================

export async function deleteFeedRecord(
  feedId
) {
  try {

    const response = await axios.delete(
      `${API_BASE_URL}/api/feed/${feedId}`,
      {
        headers: getHeaders(),
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "DELETE FEED ERROR:",
      error?.response?.data || error
    );

    if (
      error?.response?.status === 401
    ) {
      throw new Error(
        "Session expired. Please login again."
      );
    }

    throw new Error(
      error?.response?.data?.detail ||
      error?.message ||
      "Unable to delete feed record."
    );
  }
}

