// src/service/api/credentialService.js
import api from "./api";

// Add new credentials
export const addCredential = async (credentialData) => {
  const response = await api.post("/post/credentials", credentialData);
  return response.data;
};

// Get credentials
export const getCredentials = async () => {
  const response = await api.get("/get/credentials");
  return response.data;
};

export const putCredential = async (credentialData) => {
  const response = await api.put(`/put/credential/${credentialData.id}`,credentialData);
  return response.data;
};

export const deleteCredential = async (id) => {
  const response = await api.delete(`/delete/credential/${id}`);
  return response.data;
};
