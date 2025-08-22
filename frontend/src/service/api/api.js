// src/api/api.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend base URL
});

// Attach token automatically for each request
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(); // Firebase ID token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
