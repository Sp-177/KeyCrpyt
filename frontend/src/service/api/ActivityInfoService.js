// src/service/api/infoService.js
import api from "./api";




// Get credentials
export const getActivityInfos = async () => {
  const response = await api.get("/get/activity-infos");
  return response.data;
};

export const putActivityInfo = async (credential_id,activityData) => {
  const response = await api.put(`/put/activity-info/${credential_id}/${activityData.id}`,activityData);
  return response.data;
};

