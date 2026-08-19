import api from "./axios";

// ============================================================
// GET ALL MILK RECORDS
// ============================================================

export async function getMilkRecords() {
  const response = await api.get("/milk/");
  return response.data;
}

// ============================================================
// GET SINGLE MILK RECORD
// ============================================================

export async function getMilkRecord(milkId) {
  const response = await api.get(`/milk/${milkId}`);
  return response.data;
}

// ============================================================
// CREATE MILK RECORD
// ============================================================

export async function createMilkRecord(milkData) {
  const response = await api.post("/milk/", milkData);
  return response.data;
}

// ============================================================
// UPDATE MILK RECORD
// ============================================================

export async function updateMilkRecord(milkId, milkData) {
  const response = await api.put(
    `/milk/${milkId}`,
    milkData
  );
  return response.data;
}

// ============================================================
// DELETE MILK RECORD
// ============================================================

export async function deleteMilkRecord(milkId) {
  const response = await api.delete(`/milk/${milkId}`);
  return response.data;
}