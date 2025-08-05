import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice'
import alertReducer from './alertSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme:themeReducer,
    alert:alertReducer,
  },
});