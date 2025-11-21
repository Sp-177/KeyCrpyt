import api from './api';

/**
 * Sends extracted password feature data to backend.
 *
 * @param {Object} featureData - The password features object.
 * @returns {Promise<Object>} Backend response.
 */
export const reportPassword = async (featureData) => {
  try {
    if (!featureData || typeof featureData !== 'object') {
      throw new Error('Invalid password feature data.');
    }

    console.log('🔹 Reporting password feature:', featureData);

    const response = await api.post('/post/password-feature', featureData);

    return response.data;
  } catch (error) {
    console.error('❌ Failed to report password:', error);

    throw (
      error.response?.data || {
        message: 'Unable to report password feature.',
        details: error.message,
      }
    );
  }
};
