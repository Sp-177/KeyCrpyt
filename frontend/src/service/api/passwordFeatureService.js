import api from './api';

/**
 * Sends password feature data to backend for storage or ML training.
 *
 * @param {Object} featureData - Extracted password features.
 * @returns {Promise<Object>} Response data from backend.
 */
export const postPasswordFeature = async (featureData) => {
  try {
    if (!featureData || typeof featureData !== 'object') {
      throw new Error('Invalid feature data passed to postPasswordFeature().');
    }

    console.log('🔹 Posting password feature:', featureData);

    const response = await api.post('/post/password-feature', featureData);

    return response.data;
  } catch (error) {
    console.error('❌ Error posting password feature:', error);

    // More detailed backend error
    throw (
      error.response?.data || {
        message: 'Unable to post password feature.',
        details: error.message,
      }
    );
  }
};
