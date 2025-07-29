// utils/themePreference.js

/**
 * Save the selected theme to localStorage
 * @param {'light' | 'dark'} theme
 */
export const saveTheme = (theme) => {
  try {
    localStorage.setItem('theme', theme);
    
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
};

/**
 * Get the saved theme from localStorage
 * @returns {'light' | 'dark'}
 */
export const getTheme = () => {
  try {
    return localStorage.getItem('theme') || 'light'; // default to 'light'
  } catch (error) {
    console.error('Failed to get theme:', error);
    return 'light';
  }
};
