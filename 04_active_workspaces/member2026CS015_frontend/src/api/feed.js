import api from "./axios";

export async function getFeedRecords() {
  const response = await api.get("/feed/");
  return response.data;
}

export async function getFeedRecord(feedId) {
  const response = await api.get(`/feed/${feedId}`);
  return response.data;
}

export async function createFeedRecord(feedData) {
  const response = await api.post("/feed/", feedData);
  return response.data;
}

export async function updateFeedRecord(feedId, feedData) {
  const response = await api.patch(`/feed/${feedId}`, feedData);
  return response.data;
}

export async function replaceFeedRecord(feedId, feedData) {
  const response = await api.put(`/feed/${feedId}`, feedData);
  return response.data;
}

export async function deleteFeedRecord(feedId) {
  const response = await api.delete(`/feed/${feedId}`);
  return response.data;
}
