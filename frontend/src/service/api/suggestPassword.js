

import api from './api';

export const suggestPassword = async (userId, options = {}) => {
  try {
    const response = await api.get(
      `/generate/generate-passwords/${userId}`
    );

    return response.data; // { best_password, all_passwords, model_used, ... }
  } catch (error) {
    console.error('❌ Failed to suggest passwords:', error);
    throw error.response?.data || { message: 'Unable to fetch password suggestions.' };
  }
};
