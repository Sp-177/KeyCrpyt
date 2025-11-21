import axios from 'axios';
import { getAuth } from 'firebase/auth';

const aiApi = axios.create({
  baseURL: 'http://localhost:8000', // Python FastAPI backend
});

// Attach Firebase ID token
aiApi.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default aiApi;
