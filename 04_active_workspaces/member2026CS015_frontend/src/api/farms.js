
import api from "./axios";

// ============================================================
// GET ALL FARMS
// ============================================================

export const getFarms = async () => {
  const response = await api.get("/api/farms/");
  return response.data;
};

// ============================================================
// GET SINGLE FARM
// ============================================================

export const getFarm = async (farmId) => {
  const response = await api.get(`/api/farms/${farmId}`);
  return response.data;
};

// ============================================================
// CREATE FARM
// ============================================================

export const createFarm = async (data) => {
  const response = await api.post("/api/farms/", data);
  return response.data;
};

// ============================================================
// UPDATE FARM
// ============================================================

export const updateFarm = async (farmId, data) => {
  const response = await api.put(
    `/api/farms/${farmId}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE FARM
// ============================================================

export const deleteFarm = async (farmId) => {
  const response = await api.delete(
    `/api/farms/{farmId}`
  );

  return response.data;
};

