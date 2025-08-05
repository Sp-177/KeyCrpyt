// src/store/alertSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alertCount: 4,
  alertMessage: [],
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlertCount: (state, action) => {
      state.alertCount += action.payload;
    },
    setAlertMessage: (state, action) => {
      state.alertMessage.push(action.payload);
      state.alertCount += 1;
    },
    clearAlertMessage: (state, action) => {
      let indicesToRemove = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      // Convert to Set for fast lookup
      const indexSet = new Set(indicesToRemove);

      // Filter out the selected indices
      state.alertMessage = state.alertMessage.filter((_, index) => !indexSet.has(index));

      // Decrease count accordingly
      state.alertCount = Math.max(0, state.alertCount - indexSet.size);
    },
  },
});

export const { setAlertCount, setAlertMessage, clearAlertMessage } = alertSlice.actions;
export default alertSlice.reducer;
