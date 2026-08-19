import api from "./axios";

// ============================================================
// GET ALL EGG RECORDS
// ============================================================

export async function getEggRecords() {
  const response = await api.get("/egg/");
  return response.data;
}

// ============================================================
// GET SINGLE EGG RECORD
// ============================================================

export async function getEggRecord(eggId) {
  const response = await api.get(`/egg/${eggId}`);
  return response.data;
}

// ============================================================
// CREATE EGG RECORD
// ============================================================

export async function createEggRecord(eggData) {
  const response = await api.post("/egg/", eggData);
  return response.data;
}

// ============================================================
// UPDATE EGG RECORD
// ============================================================

export async function updateEggRecord(eggId, eggData) {
  const response = await api.put(`/egg/${eggId}`, eggData);
  return response.data;
}

// ============================================================
// DELETE EGG RECORD
// ============================================================

export async function deleteEggRecord(eggId) {
  const response = await api.delete(`/egg/${eggId}`);
  return response.data;
}
