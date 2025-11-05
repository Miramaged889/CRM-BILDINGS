import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import API_ENDPOINTS from '../../services/apiEndpoints';

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Create FormData for form-data submission
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      // Post with form-data (not JSON)
      // Note: Don't set Content-Type header manually - axios will set it with boundary
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, formData);

      // Store tokens in localStorage
      // Backend might return: { access: "token", refresh: "refresh_token", user: {...} }
      const accessToken = response.access || response.data?.access || response.token;
      const refreshToken = response.refresh || response.data?.refresh;

      if (accessToken) {
        localStorage.setItem('token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Return user data and tokens
      return {
        user: response.user || response.data?.user || response,
        access: accessToken,
        refresh: refreshToken,
        token: accessToken, // For backward compatibility
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('token');

      if (!refreshToken) {
        // If no refresh token, just clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return true;
      }

      // POST to /auth/refresh/ with refresh token in body and Bearer token in header
      // The interceptor will add Authorization header automatically, but we ensure it's set
      await api.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refresh: refreshToken,
      });

      // Clear tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return true;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      // Don't reject, just log the error
      console.warn('Logout API call failed, but user is logged out locally:', error.message);
      return true;
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get user');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('token');

      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      // POST to /auth/refresh/ with refresh token in body and Bearer token in header
      // The interceptor will add Authorization header automatically
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refresh: refreshTokenValue,
      });

      // Update tokens
      const newAccessToken = response.access || response.data?.access || response.token;
      const newRefreshToken = response.refresh || response.data?.refresh || refreshTokenValue;

      if (newAccessToken) {
        localStorage.setItem('token', newAccessToken);
      }
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      return {
        access: newAccessToken,
        refresh: newRefreshToken,
        token: newAccessToken, // For backward compatibility
      };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.response?.data?.message || error.message || 'Token refresh failed');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.access || action.payload.token;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      if (action.payload.access || action.payload.token) {
        localStorage.setItem('token', action.payload.access || action.payload.token);
      }
      if (action.payload.refresh) {
        localStorage.setItem('refreshToken', action.payload.refresh);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access || action.payload.token;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.access || action.payload.token;
        state.refreshToken = action.payload.refresh;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

