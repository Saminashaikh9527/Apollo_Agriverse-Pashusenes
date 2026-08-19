import api from "./axios";

// ============================================================
// GET ALL FARMS
// ============================================================

export async function getFarms() {
  const response = await api.get("/farms/");
  return response.data;
}

// ============================================================
// GET SINGLE FARM
// ============================================================

export async function getFarm(farmId) {
  const response = await api.get(`/farms/${farmId}`);
  return response.data;
}

// ============================================================
// CREATE FARM
// ============================================================

export async function createFarm(farmData) {
  const response = await api.post("/farms/", farmData);
  return response.data;
}

// ============================================================
// UPDATE FARM
// ============================================================

export async function updateFarm(farmId, farmData) {
  const response = await api.put(
    `/farms/${farmId}`,
    farmData
  );
  return response.data;
}

// ============================================================
// DELETE FARM
// ============================================================

export async function deleteFarm(farmId) {
  const response = await api.delete(`/farms/${farmId}`);
  return response.data;
}