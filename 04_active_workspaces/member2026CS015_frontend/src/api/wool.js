
// ============================================================
// src/api/wool.js
// Apollo Agriverse - PashuSense
// Wool API
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
// Authenticated headers
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
// GET WOOL RECORDS
// ============================================================

export async function getWoolRecords() {
  try {

    const token = getAuthToken();

    console.log("=================================");
    console.log("GET WOOL RECORDS");
    console.log("URL:", `${API_BASE_URL}/api/wool/`);
    console.log(
      "JWT:",
      token ? "Available" : "NOT AVAILABLE"
    );
    console.log("=================================");

    const response = await axios.get(
      `${API_BASE_URL}/api/wool/`,
      {
        headers: getHeaders(),
      }
    );

    console.log("=================================");
    console.log("WOOL API SUCCESS");
    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);
    console.log("=================================");

    return response.data;

  } catch (error) {

    console.error("=================================");
    console.error("WOOL API ERROR");
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
        "Wool API endpoint was not found."
      );
    }

    throw new Error(
      error?.response?.data?.detail ||
      error?.message ||
      "Unable to load wool records."
    );
  }
}

// ============================================================
// CREATE WOOL RECORD
// ============================================================

export async function createWoolRecord(data) {
  try {

    const response = await axios.post(
      `${API_BASE_URL}/api/wool/`,
      data,
      {
        headers: getHeaders(),
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "CREATE WOOL ERROR:",
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
      "Unable to create wool record."
    );
  }
}

// ============================================================
// UPDATE WOOL RECORD
// ============================================================

export async function updateWoolRecord(
  woolId,
  data
) {
  try {

    const response = await axios.put(
      `${API_BASE_URL}/api/wool/${woolId}`,
      data,
      {
        headers: getHeaders(),
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "UPDATE WOOL ERROR:",
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
      "Unable to update wool record."
    );
  }
}

// ============================================================
// DELETE WOOL RECORD
// ============================================================

export async function deleteWoolRecord(
  woolId
) {
  try {

    const response = await axios.delete(
      `${API_BASE_URL}/api/wool/${woolId}`,
      {
        headers: getHeaders(),
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "DELETE WOOL ERROR:",
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
      "Unable to delete wool record."
    );
  }
}

