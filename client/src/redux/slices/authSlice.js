import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";
import { ROLES } from "@/constants/role";

// Pure Redux Initial State (In-Memory)
const initialState = {
  loading: false,
  error: null,
  role: null,
  otpVerified: false,
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

// Register User / Vendor / Admin
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ role = ROLES.USER, userData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.REGISTER(role),
        userData
      );

      return {
        ...response.data,
        role,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ role = ROLES.USER, email, otpCode }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.VERIFY_OTP(role),
        {
          email,
          otpCode,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ role = ROLES.USER, token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ROUTES.AUTH.RESET_PASSWORD(role),
        {
          token,
          password,
          newPassword:password,
          confirmPassword,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

// Login User / Vendor 
export const login = createAsyncThunk(
  "auth/login",
  async ({ role = ROLES.USER, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearAuthError());

      const response = await api.post(
        API_ROUTES.AUTH.LOGIN(role),
        data
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Admin login
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearAuthError());

      const endpoint = API_ROUTES.AUTH.ADMIN_LOGIN || API_ROUTES.AUTH.LOGIN(ROLES.ADMIN);
      
      const response = await api.post(endpoint, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Admin login failed"
      );
    }
  }
);

// Helper function to handle state updates for both login thunks
const handleLoginFulfilled = (state, action, fallbackRole) => {
  state.loading = false;
  
  const responseData = action.payload?.data || action.payload || {};
  const accessToken = responseData.accessToken || responseData.token;
  
  // Dynamic extraction for user, admin, or vendor entity
  const userEntity = responseData.user || responseData.admin || responseData.vendor;

  state.accessToken = accessToken;
  state.user = userEntity;
  
  // Safely assign role
  state.role = userEntity?.role || (responseData.admin ? ROLES.ADMIN : (action.meta?.arg?.role || fallbackRole));
  state.isAuthenticated = true;
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    resetOtpStatus: (state) => {
      state.otpVerified = false;
    },

    logout: (state) => {
      state.loading = false;
      state.error = null;
      state.role = null;
      state.otpVerified = false;
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        handleLoginFulfilled(state, action, ROLES.USER);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        handleLoginFulfilled(state, action, ROLES.ADMIN);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError, resetOtpStatus, logout } = authSlice.actions;
export default authSlice.reducer;