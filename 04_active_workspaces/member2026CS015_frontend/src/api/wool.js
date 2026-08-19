import api from "./axios";

// ============================================================
// GET ALL WOOL RECORDS
// ============================================================

export async function getWoolRecords() {
  const response = await api.get("/wool/");
  return response.data;
}

// ============================================================
// CREATE WOOL RECORD
// ============================================================

export async function createWoolRecord(woolData) {
  const response = await api.post("/wool/", woolData);
  return response.data;
}

// ============================================================
// GET SINGLE WOOL RECORD
// ============================================================

export async function getWoolRecord(woolRecordId) {
  const response = await api.get(`/wool/${woolRecordId}`);
  return response.data;
}

// ============================================================
// UPDATE WOOL RECORD
// ============================================================

export async function updateWoolRecord(woolRecordId, woolData) {
  const response = await api.patch(`/wool/${woolRecordId}`, woolData);
  return response.data;
}

// ============================================================
// DELETE WOOL RECORD
// ============================================================

export async function deleteWoolRecord(woolRecordId) {
  const response = await api.delete(`/wool/${woolRecordId}`);
  return response.data;
}
