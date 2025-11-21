import aiApi from './aiApi';

/**
 * Predicts the strength of a password for the given user.
 *
 * @param {string} userId - Firebase Auth user ID
 * @param {Object} features - Password feature object from frontend
 * Example:
 * {
 *   length: 12,
 *   uniqueChars: 8,
 *   upperRatio: 0.2,
 *   lowerRatio: 0.5,
 *   digitRatio: 0.2,
 *   symbolRatio: 0.1,
 *   entropy: 3.4,
 *   charClassCount: 3
 * }
 *
 * @returns {Promise<Object>} Prediction result:
 * {
 *   user_id: "user_123",
 *   predicted_label: "Strong",
 *   confidence: { weak: 0.05, medium: 0.2, strong: 0.75 },
 *   model_used: "user"
 * }
 */
export const passwordStrength = async (userId, features) => {
  try {
    if (!userId) throw new Error('User ID is required for prediction.');
    if (!features || typeof features !== 'object')
      throw new Error('Password features are required for prediction.');

    // ✅ Send POST request with password features
    const response = await aiApi.post(`/strength/predict-strength/${userId}`, features);

    return response.data;
  } catch (error) {
    console.error('❌ Failed to predict password strength:', error);
    throw (
      error.response?.data || {
        message: 'Unable to predict password strength. Please try again.',
      }
    );
  }
};
