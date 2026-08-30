import api from "./axios";

export const getAnimals = async () => {
  const response = await api.get("/api/animals/");
  return response.data;
};

export const createAnimal = async (data) => {
  const response = await api.post("/api/animals/", data);
  return response.data;
};

export const updateAnimal = async (animalId, data) => {
  const response = await api.put(
    `/api/animals/${animalId}`,
    data
  );
  return response.data;
};

export const deleteAnimal = async (animalId) => {
  const response = await api.delete(
    `/api/animals/${animalId}`
  );
  return response.data;
};