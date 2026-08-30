
import api from "./axios";

// ============================================================
// GET VACCINATION RECORDS
// ============================================================

export const getVaccinationRecords = async (animalId = null) => {
  const url = animalId
    ? `/api/vaccination/?animal_id=${animalId}`
    : "/api/vaccination/";

  const response = await api.get(url);
  return response.data;
};

// ============================================================
// GET SINGLE VACCINATION RECORD
// ============================================================

export const getVaccinationRecord = async (id) => {
  const response = await api.get(`/api/vaccination/${id}`);
  return response.data;
};

// ============================================================
// CREATE VACCINATION RECORD
// ============================================================

export const createVaccinationRecord = async (data) => {
  const response = await api.post(
    "/api/vaccination/",
    data
  );

  return response.data;
};

// ============================================================
// UPDATE VACCINATION RECORD
// ============================================================

export const updateVaccinationRecord = async (id, data) => {
  const response = await api.put(
    `/api/vaccination/${id}`,
    data
  );

  return response.data;
};

// ============================================================
// PATCH VACCINATION RECORD
// ============================================================

export const patchVaccinationRecord = async (id, data) => {
  const response = await api.patch(
    `/api/vaccination/${id}`,
    data
  );

  return response.data;
};

// ============================================================
// DELETE VACCINATION RECORD
// ============================================================

export const deleteVaccinationRecord = async (id) => {
  const response = await api.delete(
    `/api/vaccination/${id}`
  );

  return response.data;
};

