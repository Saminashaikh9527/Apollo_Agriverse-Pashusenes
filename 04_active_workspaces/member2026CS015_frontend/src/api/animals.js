import api from "./axios";

// Get all animals
export const getAnimals = async () => {
  const response = await api.get("/animals/");
  return response.data;
};

// Get one animal by ID
export const getAnimal = async (animalId) => {
  const response = await api.get(`/animals/${animalId}`);
  return response.data;
};

// Create animal
export const createAnimal = async (animalData) => {
  const response = await api.post("/animals/", animalData);
  return response.data;
};

// Update animal
export const updateAnimal = async (animalId, animalData) => {
  const response = await api.put(`/animals/${animalId}`, animalData);
  return response.data;
};

// Delete animal
export const deleteAnimal = async (animalId) => {
  const response = await api.delete(`/animals/${animalId}`);
  return response.data;
};