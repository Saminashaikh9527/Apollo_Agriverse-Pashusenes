import api from "./axios";

// ============================================================
// GET ALL GROWTH RECORDS
// ============================================================

export async function getGrowthRecords() {
  const response = await api.get("/growth/");
  return response.data;
}

// ============================================================
// GET SINGLE GROWTH RECORD
// ============================================================

export async function getGrowthRecord(growthId) {
  const response = await api.get(`/growth/${growthId}`);
  return response.data;
}

// ============================================================
// CREATE GROWTH RECORD
// ============================================================

export async function createGrowthRecord(growthData) {
  const response = await api.post("/growth/", growthData);
  return response.data;
}

// ============================================================
// UPDATE GROWTH RECORD
// ============================================================

export async function updateGrowthRecord(growthId, growthData) {
  const response = await api.put(`/growth/${growthId}`, growthData);
  return response.data;
}

// ============================================================
// PATCH GROWTH RECORD
// ============================================================

export async function patchGrowthRecord(growthId, growthData) {
  const response = await api.patch(`/growth/${growthId}`, growthData);
  return response.data;
}

// ============================================================
// DELETE GROWTH RECORD
// ============================================================

export async function deleteGrowthRecord(growthId) {
  const response = await api.delete(`/growth/${growthId}`);
  return response.data;
}
