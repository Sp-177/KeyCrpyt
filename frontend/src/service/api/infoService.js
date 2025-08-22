// src/api/credentialService.js
import api from "./api";

// Add new credentials


// Get credentials
export const getActivityInfo = async () => {
  const response = await api.get("/get/activity-info");
  return response.data;
};

export const putActivityInfo = async (activityData) => {
  const response = await api.put(`/put/activity-info/${activityData.id}`,activityData);
  return response.data;
};

