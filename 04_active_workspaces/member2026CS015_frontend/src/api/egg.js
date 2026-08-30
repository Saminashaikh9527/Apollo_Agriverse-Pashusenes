
import api from "./axios";

// ============================================================
// GET EGG RECORDS
// ============================================================

export const getEggRecords = async (animalId = null) => {
  const url = animalId
    ? `/api/egg/?animal_id=${animalId}`
    : "/api/egg/";

  const response = await api.get(url);
  return response.data;
};

// ============================================================
// GET SINGLE EGG RECORD
// ============================================================

export const getEggRecord = async (id) => {
  const response = await api.get(`/api/egg/${id}`);
  return response.data;
};

// ============================================================
// CREATE EGG RECORD
// ============================================================

export const createEggRecord = async (data) => {
  const response = await api.post("/api/egg/", data);
  return response.data;
};

// ============================================================
// UPDATE EGG RECORD
// ============================================================

export const updateEggRecord = async (id, data) => {
  const response = await api.put(`/api/egg/${id}`, data);
  return response.data;
};

// ============================================================
// PATCH EGG RECORD
// ============================================================

export const patchEggRecord = async (id, data) => {
  const response = await api.patch(
    `/api/egg/${id}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE EGG RECORD
// ============================================================

export const deleteEggRecord = async (id) => {
  const response = await api.delete(`/api/egg/${id}`);
  return response.data;
};

