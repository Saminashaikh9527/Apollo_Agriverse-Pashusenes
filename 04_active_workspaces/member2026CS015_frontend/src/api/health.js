import api from "./axios";

// ============================================================
// GET ALL HEALTH RECORDS
// ============================================================

export async function getHealthRecords() {
  const response = await api.get("/health/");
  return response.data;
}

// ============================================================
// GET SINGLE HEALTH RECORD
// ============================================================

export async function getHealthRecord(healthRecordId) {
  const response = await api.get(`/health/${healthRecordId}`);
  return response.data;
}

// ============================================================
// CREATE HEALTH RECORD
// ============================================================

export async function createHealthRecord(healthData) {
  const response = await api.post("/health/", healthData);
  return response.data;
}

// ============================================================
// UPDATE HEALTH RECORD
// ============================================================

export async function updateHealthRecord(healthRecordId, healthData) {
  const response = await api.patch(
    `/health/${healthRecordId}`,
    healthData
  );
  return response.data;
}

// ============================================================
// DELETE HEALTH RECORD
// ============================================================

export async function deleteHealthRecord(healthRecordId) {
  const response = await api.delete(`/health/${healthRecordId}`);
  return response.data;
}