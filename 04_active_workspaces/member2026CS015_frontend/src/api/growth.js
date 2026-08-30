import api from "./axios";

const getGrowthRecords = async (animalId = null) => {
  const url = animalId
    ? `/api/growth/?animal_id=${animalId}`
    : `/api/growth/`;

  const response = await api.get(url);
  return response.data;
};

const getGrowthRecord = async (id) => {
  const response = await api.get(`/api/growth/${id}`);
  return response.data;
};

const createGrowthRecord = async (data) => {
  const response = await api.post("/api/growth/", data);
  return response.data;
};

const updateGrowthRecord = async (id, data) => {
  const response = await api.put(`/api/growth/${id}`, data);
  return response.data;
};

const patchGrowthRecord = async (id, data) => {
  const response = await api.patch(`/api/growth/${id}`, data);
  return response.data;
};

const deleteGrowthRecord = async (id) => {
  const response = await api.delete(`/api/growth/${id}`);
  return response.data;
};

export {
  getGrowthRecords,
  getGrowthRecord,
  createGrowthRecord,
  updateGrowthRecord,
  patchGrowthRecord,
  deleteGrowthRecord,
};