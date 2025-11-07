
import api from './api';

/**
 * Suggests strong passwords for a given user.
 *
 * @param {string} userId - Firebase Auth user ID
 * @param {Object} options - Optional parameters
 *
 * @returns {Promise<Object>} Backend response
 * Example:
 * {
 *   user_id: "user_123",
 *   model_used: "user",
 *   generated_count: 15,
 *   best_password: {...},
 *   all_passwords: [...]
 * }
 */
export const suggestPassword = async (userId, options = {}) => {
  try {
    if (!userId) throw new Error('User ID is required to generate passwords.');
    // ✅ Call backend endpoint with query params
    const response = await api.get(
      `/generate/generate-passwords/${userId}`
    );

    // ✅ Return structured data
    return response.data;
  } catch (error) {
    console.error('❌ Failed to suggest passwords:', error);
    throw (
      error.response?.data || {
        message: 'Unable to fetch password suggestions.',
      }
    );
  }
};
