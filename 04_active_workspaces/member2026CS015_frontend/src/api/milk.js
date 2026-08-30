
import api from "./axios";

// ============================================================
// GET MILK RECORDS
// ============================================================

export const getMilkRecords = async (animalId = null) => {
  const url = animalId
    ? `/api/milk/?animal_id=${animalId}`
    : "/api/milk/";

  const response = await api.get(url);
  return response.data;
};

// ============================================================
// GET SINGLE MILK RECORD
// ============================================================

export const getMilkRecord = async (id) => {
  const response = await api.get(`/api/milk/${id}`);
  return response.data;
};

// ============================================================
// CREATE MILK RECORD
// ============================================================

export const createMilkRecord = async (data) => {
  const response = await api.post("/api/milk/", data);
  return response.data;
};

// ============================================================
// UPDATE MILK RECORD
// ============================================================

export const updateMilkRecord = async (id, data) => {
  const response = await api.put(`/api/milk/${id}`, data);
  return response.data;
};

// ============================================================
// PATCH MILK RECORD
// ============================================================

export const patchMilkRecord = async (id, data) => {
  const response = await api.patch(
    `/api/milk/${id}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE MILK RECORD
// ============================================================

export const deleteMilkRecord = async (id) => {
  const response = await api.delete(`/api/milk/${id}`);
  return response.data;
};

