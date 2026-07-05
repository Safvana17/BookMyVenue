import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setAccessToken,
  setUser,
  setIsAuthenticated,
  logout,
} = authSlice.actions;

export default authSlice.reducer;