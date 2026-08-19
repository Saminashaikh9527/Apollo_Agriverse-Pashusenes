import api from "./axios";

// ============================================================
// GET ALL VACCINATION RECORDS
// ============================================================

export const getVaccinationRecords = async () => {
  const response = await api.get("/vaccination/");
  return response.data;
};

// ============================================================
// CREATE VACCINATION RECORD
// ============================================================

export const createVaccinationRecord = async (data) => {
  const response = await api.post("/vaccination/", data);
  return response.data;
};

// ============================================================
// GET SINGLE VACCINATION RECORD
// ============================================================

export const getVaccinationRecord = async (id) => {
  const response = await api.get(`/vaccination/${id}`);
  return response.data;
};

// ============================================================
// UPDATE VACCINATION RECORD
// ============================================================

export const updateVaccinationRecord = async (id, data) => {
  const response = await api.patch(`/vaccination/${id}`, data);
  return response.data;
};

// ============================================================
// DELETE VACCINATION RECORD
// ============================================================

export const deleteVaccinationRecord = async (id) => {
  const response = await api.delete(`/vaccination/${id}`);
  return response.data;
};
