import aiApi from './aiApi';
import qs from 'qs'; // <-- add this

export const generatePassword = async (userId, options = {}) => {
  try {
    if (!userId) throw new Error('User ID is required to generate passwords.');

    const { keywords = [] } = options;

    console.log('🔹 Sending keywords to backend:', keywords);

    const response = await aiApi.get(`/generate/generate-passwords/${userId}`, {
      params: {
        keywords: keywords, // array
      },
      // ⭐ KEY FIX: serialize arrays as repeated params
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    });

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
