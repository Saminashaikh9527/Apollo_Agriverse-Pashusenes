
import api from "./axios";

// ============================================================
// GET HEALTH RECORDS
// ============================================================

export const getHealthRecords = async (animalId = null) => {
  const url = animalId
    ? `/api/health/?animal_id=${animalId}`
    : "/api/health/";

  const response = await api.get(url);
  return response.data;
};

// ============================================================
// GET SINGLE HEALTH RECORD
// ============================================================

export const getHealthRecord = async (id) => {
  const response = await api.get(`/api/health/${id}`);
  return response.data;
};

// ============================================================
// CREATE HEALTH RECORD
// ============================================================

export const createHealthRecord = async (data) => {
  const response = await api.post("/api/health/", data);
  return response.data;
};

// ============================================================
// UPDATE HEALTH RECORD
// ============================================================

export const updateHealthRecord = async (id, data) => {
  const response = await api.put(`/api/health/${id}`, data);
  return response.data;
};

// ============================================================
// PATCH HEALTH RECORD
// ============================================================

export const patchHealthRecord = async (id, data) => {
  const response = await api.patch(
    `/api/health/${id}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE HEALTH RECORD
// ============================================================

export const deleteHealthRecord = async (id) => {
  const response = await api.delete(`/api/health/${id}`);
  return response.data;
};

