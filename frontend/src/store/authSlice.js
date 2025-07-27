// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  photoURL: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { email, photoURL } = action.payload;
      state.email = email;
      state.photoURL = photoURL;
      state.isAuthenticated = true;
    },
    // Added missing setEmail action used in SignIn
    setEmail: (state, action) => {
      state.email = action.payload;
      state.isAuthenticated = true;
    },
    // Added missing setUserEmail action used in SignUp
    setUserEmail: (state, action) => {
      state.email = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.email = null;
      state.photoURL = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setEmail, setUserEmail, clearUser } = authSlice.actions;
export default authSlice.reducer;