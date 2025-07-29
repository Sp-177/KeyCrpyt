// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getTheme } from '../utils/themePreference';

const initialState = {
  theme:getTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const { theme } = action.payload;
      state.theme=theme;
    },
    
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;