import aiApi from './aiApi';

/**
 * Retrains the personalized password strength model for a user.
 *
 * @param {string} userId - Firebase Auth user ID
 * @returns {Promise<Object>} Retraining status response
 *
 * Example response:
 * {
 *   message: "Model retrained successfully",
 *   user_id: "user_123",
 *   accuracy: 0.94,
 *   model_used: "user"
 * }
 */
export const retrainModel = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required to retrain model.');

    // ✅ Send POST request to backend
    const response = await aiApi.post(`/retrain/${userId}`);

    return response.data;
  } catch (error) {
    console.error('❌ Model retraining failed:', error);
    throw (
      error.response?.data || {
        message: 'Unable to retrain model. Please try again later.',
      }
    );
  }
};
